import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import renderStars from '../types/renderStars';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('https://localhost:7231/api/Product')
        .then((res)=>res.json())
        .then((data)=>{
          const featuredOnly = data.filter((product)=>product.featured);
          setFeaturedProducts(featuredOnly)})
        .catch((err)=>console.error('Error fetching products:',err))
  }, []);

  const handleAddToCart = () => {
    addToCart(featuredProducts)
    toast.success($`{product.name} added to cart!`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-teal-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/5589050/pexels-photo-5589050.jpeg?auto=compress&cs=tinysrgb&w=1500" 
            alt="Delicious pickles" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 animate-fade-in">
              Premium Handcrafted Pickles
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 animate-slide-up">
              Discover our artisanal selection of gourmet pickles made from the finest ingredients using traditional recipes.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up">
              <Link to="/products" className="btn bg-white text-teal-700 hover:bg-gray-100 px-6 py-3">
                Shop Now
              </Link>
              <a href="#featured" className="btn bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3">
                Explore Featured
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Our Pickle Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Link to="/products?category=Dill" className="group">
              <div className="relative rounded-lg overflow-hidden h-40 md:h-60">
                <img 
                  src="https://images.pexels.com/photos/5589050/pexels-photo-5589050.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Dill Pickles" 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                  <h3 className="text-white text-lg md:text-xl font-medium p-4">Dill</h3>
                </div>
              </div>
            </Link>
            <Link to="/products?category=Sweet" className="group">
              <div className="relative rounded-lg overflow-hidden h-40 md:h-60">
                <img 
                  src="https://images.pexels.com/photos/5589047/pexels-photo-5589047.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Sweet Pickles" 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                  <h3 className="text-white text-lg md:text-xl font-medium p-4">Sweet</h3>
                </div>
              </div>
            </Link>
            <Link to="/products?category=Spicy" className="group">
              <div className="relative rounded-lg overflow-hidden h-40 md:h-60">
                <img 
                  src="https://images.pexels.com/photos/8604648/pexels-photo-8604648.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Spicy Pickles" 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                  <h3 className="text-white text-lg md:text-xl font-medium p-4">Spicy</h3>
                </div>
              </div>
            </Link>
            <Link to="/products?category=Variety" className="group">
              <div className="relative rounded-lg overflow-hidden h-40 md:h-60">
                <img 
                  src="https://images.pexels.com/photos/5589074/pexels-photo-5589074.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Variety Packs" 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                  <h3 className="text-white text-lg md:text-xl font-medium p-4">Variety</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section id="featured" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-teal-600 hover:text-teal-700 flex items-center text-sm font-medium">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                featuredProducts.map((product)=>(
                    <div key={product.id} className="card group animate-fade-in">
                        <Link to={`/product/${product.id}`} className="block relative pt-[100%]">
                            <img 
                                src={product.images?.[0]?.imageUrl} 
                                alt={product.title} 
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                                Featured
                            </span>
                        </Link>
                        <div className='p-4'>
                            <div className="flex items-center mb-2">
                                <div className="flex items-center text-amber-500">
                                    <span className="ml-1 text-sm">{renderStars(product.rating)}</span>
                                </div>
                                <span className="text-xs text-gray-500 ml-2">({Math.floor(Math.random() * 100) + 10} reviews)</span>
                            </div>
                            <Link to={`/product/${product.id}`} className="block">
                                <h3 className="font-medium text-gray-900 hover:text-teal-600 mb-1">{product.title}</h3>
                            </Link>
                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                <button 
                                onClick={() => handleAddToCart()}
                                className="btn btn-primary py-1.5 text-xs"
                            >
                                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            }
          </div>
        </div>  
      </section>
      
      {/* About Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Crafting the Perfect Pickle Since 1985</h2>
              <p className="text-gray-700 mb-4">
                Our family has been perfecting the art of pickle-making for generations. What started as a small family operation has grown into a beloved brand known for quality and exceptional taste.
              </p>
              <p className="text-gray-700 mb-6">
                We use only the freshest ingredients and traditional methods to ensure each jar delivers that distinctive crunch and flavor our customers have come to love.
              </p>
              <a href="#" className="btn btn-primary">
                Learn More About Us
              </a>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.pexels.com/photos/8604995/pexels-photo-8604995.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Pickle making process" 
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120",
                text: "These are hands down the best pickles I've ever tasted! The dill pickles have the perfect crunch and flavor. I'm now a lifetime customer!",
              },
              {
                name: "Michael Chen",
                avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120",
                text: "The spicy jalapeño pickles are amazing! They have just the right amount of heat without overwhelming the pickle flavor. Will definitely order again.",
              },
              {
                name: "Emma Williams",
                avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120",
                text: "I ordered the variety pack as a gift for my pickle-loving friend, and they couldn't stop raving about how delicious every single jar was. Great quality!",
              }
            ].map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-teal-600 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Experience Artisanal Pickles?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community of pickle enthusiasts and discover flavors that will transform your culinary experience.
          </p>
          <Link to="/products" className="btn bg-white text-teal-700 hover:bg-gray-100 px-6 py-3">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;