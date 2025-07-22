import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import debounce from 'lodash/debounce';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState();
  const {token} = useAuth();
  useEffect(()=>{
    const wishlistProducts = async()=>{
        try{
            const res = await fetch(`https://localhost:7231/api/Wishlist`,{
                method:'GET',
                headers:{ Authorization:`Bearer ${token}`}
            });
            const data = await res.json();
            console.log("data",data);
            setWishlist(data);
        }
        catch(err)
        {
            console.log(err);
            toast.error('failed to fetch wishlist products')
        }
    }
    wishlistProducts();
  },[token])
  const { addToCart } = useCart()

  const handleRemoveFromWishlist = debounce(async (id) => {
    console.log("wishlist-id",id)
    try{
        const res = await fetch(`https://localhost:7231/api/Wishlist/${id}`,{
            method:"DELETE",
            headers:{ Authorization:`Bearer ${token}`},
        });
        if(res.ok)
        {
            setWishlist(wishlist.filter((product) => product.id !== id));
            toast.success('Product removed from wishlist');
        }
        else{
            toast.error('Failed to delete');
        }
    }
    catch(err)
    {
        console.log(err);
        toast.error('Failed to delete');
    }
  },500);

  const handleAddToCart = debounce((product) => {
    addToCart(product,1);
  },900);
  console.log(wishlist);
  const isEmpty = wishlist?.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Wishlist</h1>
      
      {isEmpty ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">
            Add items you love to your wishlist. Review them anytime and easily move them to the cart.
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist?.map((item) => (
            <div key={item.id} className="card relative">
              <Link to={`/product/${item.product.id}`} className="block relative pt-[80%]">
                <img 
                  src={item.product.images[0]?.imageUrl} 
                  alt={item.product.title} 
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </Link>
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-4">
                <Link to={`/product/${item.product.id}`} className="block">
                  <h3 className="font-medium text-gray-900 hover:text-teal-600 mb-1">
                    {item.product.title}
                  </h3>
                </Link>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                  {item.product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">${item.product.price.toFixed(2)}</span>
                  {item.product.stock === 0 ? (
                            <button disabled className="btn btn-disabled">Out Of Stock</button>
                          ):(
                  <button 
                    onClick={() => handleAddToCart(item.product)}
                    className="btn btn-primary py-1.5 text-xs"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    Add to Cart
                  </button>
                          )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;