// import React, {useEffect,useState} from 'react';
// import { Link,useParams } from 'react-router-dom';
// import { useCart } from '../context/CartContext';

// const ProductDetails = ()=>{
//     const {id} = useParams()
//     const [product,setProduct] = useState(null)
//     const {addToCart} = useCart();

//     useEffect(()=>{
//         fetch(`https://localhost:7231/api/Product/${id}`)
//         .then((res)=>res.json())
//         .then((data)=>setProduct(data))
//     },[id])
    
//     const handleAddToCart = ()=>{
//         addToCart(product)
//     }

//     if(!product) return <p className='text-center mt-10'>Loading...</p>

//     return(
//         <div className='max-w-4xl mx-auto p-4'>
//             <img src={product.imageUrl} alt={product.title} className='w-full h-96 object-cover rounded' />
//             <h2 className='text-2xl font-bold mt-4'>{product.title}</h2>
//             <p className='text-gray-700 mt-2'>{product.description}</p>
//             <p className='text-x1 text-green-600 mt-2'>${product.price}</p>
//             <button className='mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700' onClick={handleAddToCart}>
//                 Add to cart
//             </button>
//         </div>
//     )
// }

// export default ProductDetails;


import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Star, Heart, ShoppingBag, Clock, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext'
import PRODUCTS from '../types/products';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import debounce from 'lodash/debounce';
import renderStars from '../types/renderStars';

const ProductDetails = () => {
  const {token} = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewText,setReviewText] = useState('');
  const [reviewRating,setReviewRating] = useState('');
  const [reviewLoading,setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewImage,setReviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be an API call
        console.log(id);
        const res = await fetch(`https://localhost:7231/api/Product/${id}`)
        const foundProduct = await res.json();
        console.log(foundProduct);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct?.images[0]?.imageUrl);
          
          // Get related products from the same category
          const related = PRODUCTS.filter(
            (p) => p.category === foundProduct.category && p.id !== id
          ).slice(0, 4);
          
          setRelatedProducts(related);
          
          // Get reviews for this product
        //   const productReviews = REVIEWS.filter((r) => r.productId === id);
        //   setReviews(productReviews);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try{
        const res = await fetch(`https://localhost:7231/api/Review/${id}`);
        const data = await res.json();
        setReviews(data);
      }catch(err){
        console.error('Error fetching reviews:',err);
      }
    }
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);
  useEffect(()=>{
    const fetchReviews = async () => {
      try{
        const res = await fetch(`https://localhost:7231/api/Review/${id}`);
        const data = await res.json();
        setReviews(data);
      }catch(err){
        console.error('Error fetching reviews:',err);
      }
    }
    fetchReviews();
  },[reviews])
  const handleAddToCart = debounce(() => {
    if (product) {
      setAddingToCart(true);
        //addItem(product, quantity);
        addToCart(product, quantity)
        //toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
        setAddingToCart(false);
    }
  },1000);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if(!reviewText || !reviewRating)
    {
      toast.error('Please provide both rating and comment');
      return;
    }
    setReviewLoading(true);
    const formData = new FormData();
    formData.append('rating',reviewRating),
    formData.append('comment',reviewText),
    formData.append('image',reviewImage)
    try{
      console.log(product.id);
      const res= await fetch(`https://localhost:7231/api/Review/${product.id}`,{
        method:"POST",
        headers:{Authorization:`Bearer ${token}`},
        body: formData
      });
      if(res.ok){
        const newReview = await res.json();
        setReviews((prev)=>[...prev,newReview]);
        setReviewText('')
        setReviewRating('');
        setReviewImage(null);
        setShowReviewForm(false);
        toast.success('Review Submitted!');
      }else{
        toast.error('Failed to submit review');
      }
    }catch(err)
    {
      console.error(err);
      setReviewLoading(false);
    }
  };

  const handleWishlist = debounce(async()=>{
    try
    {
      const res= await fetch('https://localhost:7231/api/Wishlist',{
            method:"POST",
            headers:{ 'Content-Type':'application/json',Authorization:`Bearer ${token}`},
            body: JSON.stringify({productId:id})
      });
      if(res.status === 409)
        toast.success(`${product.title} is already in your wishlist`)
      else if(res.ok)
        toast.success(`${product.title} added to wishlist`);
      else
        toast.error('Failed to Add Wishlist');

    }
    catch(err)
    {
      console.log(err);
      toast.error('Failed to Add Wishlist');
    }
  },1000);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">We couldn't find the product you're looking for.</p>
        <Link to="/products" className="btn btn-primary">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Link to="/products" className="text-sm text-gray-500 hover:text-teal-600 flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>
      
      {/* Product Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-3 p-4 md:p-6">
            <div className="mb-4">
              <img 
                src={selectedImage} 
                alt={product.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>
            
            {product.images?.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image.imageUrl)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
                      selectedImage === image.imageUrl ? 'ring-2 ring-teal-500' : 'opacity-70'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${product.title} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="lg:col-span-2 p-4 md:p-6 flex flex-col">
            <div className="mb-2">
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-amber-500">
                <span className="ml-1 text-sm font-medium">{renderStars(product.rating)}</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                <a href="#reviews" className='hover:underline'>
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </a>
              </span>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-4">
              ${product.price.toFixed(2)}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Stock status */}
            <div className="flex items-center mb-6">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span className={`text-sm ${
                product.stock > 10 
                  ? 'text-green-600' 
                  : product.stock > 0 
                    ? 'text-amber-600' 
                    : 'text-red-600'
              }`}>
                {product.stock > 10 
                  ? 'In stock' 
                  : product.stock > 0 
                    ? `Only ${product.stock} left in stock` 
                    : 'Out of stock'}
              </span>
            </div>
            
            {/* Quantity */}
            <div className="flex items-center mb-6">
              <span className="text-sm font-medium text-gray-700 mr-3">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-2 text-gray-500 hover:text-teal-600 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-gray-700">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="p-2 text-gray-500 hover:text-teal-600 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col space-y-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="btn btn-primary"
              >
                {addingToCart ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="btn btn-outline flex items-center justify-center" onClick={handleWishlist}>
                  <Heart className="h-5 w-5 mr-2" />
                  Wishlist
                </button>
                <button className="btn btn-outline flex items-center justify-center" disabled={addingToCart || product.stock === 0}>
                  <Link to="/cart">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Buy Now
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews */}
      {console.log(reviews)}
      <div className="mt-12" id="reviews">
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
        
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                      {review.user?.name}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="font-medium text-gray-900">{review.user?.name}</h4>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-amber-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-gray-500 mb-4">No reviews yet for this product.</p>
            {/* Would display a "Write a review" button for logged-in customers who have purchased the product */}
          </div>
        )}
      </div>

      {/* Add Review Form */}
      <div className="mt-12 border-t pt-6">

  {token ? (
    <>
      {!showReviewForm ? (
        <button
          onClick={() => setShowReviewForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Write a Review
        </button>
      ) : (
        <form onSubmit={handleReviewSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Rating</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && 's'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Write your thoughts here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReviewImage(e.target.files[0])}
              className="w-full"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              disabled={reviewLoading}
            >
              {reviewLoading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="text-gray-600 underline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  ) : (
    <p className="text-sm text-gray-600">
      Please <Link to="/login" className="text-teal-600 underline">login</Link> to write a review.
    </p>
  )}
</div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="card group">
                <Link to={`/product/${relatedProduct.id}`} className="block relative pt-[100%]">
                  <img 
                    src={relatedProduct.images[0]?.imageUrl} 
                    alt={relatedProduct.name} 
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/:${relatedProduct.id}`} className="block">
                    <h3 className="font-medium text-gray-900 hover:text-teal-600 mb-1">
                      {relatedProduct.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">${relatedProduct.price.toFixed(2)}</span>
                    {relatedProduct.stock === 0 ? (
                            <button disabled className="btn btn-disabled">Out Of Stock</button>
                          ):(
                    <button 
                      onClick={() => {
                        addToCart(relatedProduct, 1);
                      }}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;