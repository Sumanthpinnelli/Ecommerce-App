// import React from "react";
// import { useCart } from '../context/CartContext'
// import CartItem from "../components/cart/CartItem";
// import { Link } from "react-router-dom";

// const Cart = ()=>{
//     const { cart, removeFromCart, increaseQuantity, decreaseQuantity} = useCart()
//     const total = cart.reduce((acc,item)=> acc + item.price * item.quantity,0);
//     if(cart.length === 0)
//     {
//         return (
//             <div className="text-center mt-10">
//             <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
//             <Link to="/" className="text-blue-600 hover:underline mt-4 block">
//                 Go back to shopping
//             </Link>
//             </div>
//         )
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
//             <div className="space-y-6">
//                     {cart.map((item)=>(
//                         <CartItem key={item.id} item={item} onRemove={removeFromCart} increaseQuantity ={increaseQuantity} decreaseQuantity={decreaseQuantity}/>
//                     ))}
//                     <div className="flex justify-between mt-6 items-center">
//                         <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
//                         <Link to="/checkout">
//                             <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//                                 Proceed to Checkout
//                             </button>
//                         </Link>
//                     </div>
//             </div>
//         </div>
//     )
// }
// export default Cart;


import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';

const Cart = () => {
  const {  removeFromCart, updateQuantity, getCartTotal, clearCart, cart} = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = getCartTotal();
  console.log(subtotal)
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping - couponDiscount;

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = debounce((id) => {
    removeFromCart(id);
  },500);

  const handleApplyCoupon = debounce(() => {
    // Mock coupon validation - in a real app, this would be an API call
    if (couponCode.toLowerCase() === 'discount10') {
      const discount = subtotal * 0.1;
      setCouponDiscount(discount);
      setCouponError('');
      toast.success('Coupon applied successfully!');
    } else {
      setCouponError('Invalid coupon code');
      setCouponDiscount(0);
    }
  },900);

  const handleProceedToCheckout = debounce(async() => {
    if (token) {
      try{
        const response = await fetch('https://localhost:7231/api/Orders/checkout',{
            method: 'POST',
            headers: {'Content-Type': 'application/json',Authorization:`Bearer ${token}`},
            body: JSON.stringify({items: cart})
        })
        const data = await response.json();
        window.location.href = data.url
    }
    catch(error)
    {
        console.error('Checkout failed:',error)
    }
    } else {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  },2000);

  const isEmpty = cart.length === 0;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Cart</h1>
      
      {isEmpty ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {console.log(cart)}
                    {cart.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={item.product?.images[0]?.imageUrl}
                              alt={item.product?.title}
                              className="h-16 w-16 object-cover rounded mr-4"
                            />
                            <div>
                              <Link
                                to={`/product/${item.productId}`}
                                className="text-gray-900 hover:text-teal-600 font-medium"
                              >
                                {item.product?.title}
                              </Link>
                              <div className="text-gray-500 text-sm mt-1">
                                {item.product?.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${item.product?.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center border border-gray-300 rounded-md w-24">
                            <button
                              onClick={() => 
                                handleQuantityChange(item.productId, Math.max(1, item.quantity - 1))
                              }
                              className="p-1 text-gray-500 hover:text-teal-600"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="flex-1 text-center text-sm text-gray-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => 
                                handleQuantityChange(item.productId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product?.stock}
                              className="p-1 text-gray-500 hover:text-teal-600 disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.product?.price * item.quantity).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <Link to="/products" className="text-teal-600 hover:text-teal-700 flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Continue Shopping
              </Link>
              <button
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared successfully');
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                  <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-gray-900 font-bold">Total</span>
                  <span className="text-gray-900 font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Coupon Code */}
              <div className="mb-6">
                <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="coupon"
                    className="input rounded-r-none flex-1"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode}
                    className="btn btn-primary rounded-l-none"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-xs mt-1">{couponError}</p>
                )}
                {!couponError && couponCode && couponDiscount > 0 && (
                  <p className="text-green-500 text-xs mt-1">Coupon applied successfully!</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Try "DISCOUNT10" for 10% off your order!
                </p>
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="btn btn-primary w-full"
              >
                {token ? 'Proceed to Checkout' : 'Sign in to Checkout'}
              </button>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Free shipping on orders over $50
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;