// import React, {useState,useEffect} from 'react'
// import {useAuth} from '../../context/AuthContext'

// const OrderHistory = () =>{
//     const { token} = useAuth();
//     const [orders, setOrders] = useState([])

//     useEffect(()=> {
//         const fetchOrders = async ()=>{
//             const res =await fetch('https://localhost:7231/api/Orders',{
//                 headers:{
//                     Authorization:`Bearer ${token}`
//                 }
//             })
//             const data = await res.json()
//             setOrders(data)
//         }
//         fetchOrders()
//     },[token])

//     return(
//         <div className='p-6'>
//             <h2 className='text-2xl font-bold mb-4'>My Orders</h2>
//             {orders.length === 0 ? (
//                 <p>No orders found.</p>
//             ):(
//                 <div className='space-y-4'>
//                     {orders.map((order)=>(
//                         <div key={order.id} className='border p-4 rounded bg-white shadow'>
//                             <h3 className='text-lg font-semibold'>Order #{order.id}</h3>
//                             <p>Total: ${order.totalAmount}</p>
//                             <p>Status: {order.status ?? "pending"}</p>
//                             <div className='mt-2'>
//                                 <h4 className='font-medium'>Items:</h4>
//                                 <ul className='list-disc list-inside'>
//                                     {order.items.map((item)=>(
//                                         <li key={item.id}>
//                                             {item.product.title} x {item.quantity}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }

// export default OrderHistory;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Eye, Search } from 'lucide-react';
import PRODUCTS from '../../types/products'
import { useAuth } from '../../context/AuthContext';

const OrderHistory = () => {
  const { user,token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch orders - in a real app this would be an API call
    const fetchOrders = async () => {
      setLoading(true);
                try
                {
                    const res =await fetch('https://localhost:7231/api/Orders',{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    })
                    const data = await res.json()
                    setOrders(data)
                }
                catch (error) {
                    console.error('Error fetching orders:', error);
                } 
                finally {
                    setLoading(false);
                }
    };
    
    fetchOrders();
  }, [token]);
  
  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  
  // Function to get product image by ID
  const getProductImage = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    return product?.images[0]?.imageUrl || '';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet. Start shopping to create your first order.
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10 w-full"
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' : 
                            order.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status.toLowerCase() === 'processing' ? 'bg-amber-100 text-amber-800' :
                            order.status.toLowerCase() === 'pending' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-teal-600 hover:text-teal-900 inline-flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Order #{selectedOrder.id}
              </h3>
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Order Date</h4>
                  <p className="text-gray-900">
                    {new Date(selectedOrder.orderDate).toLocaleDateString()} at {new Date(selectedOrder.orderDate).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Order Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${selectedOrder.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' : 
                      selectedOrder.status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      selectedOrder.status.toLowerCase() === 'processing' ? 'bg-amber-100 text-amber-800' :
                      selectedOrder.status.toLowerCase() === 'pending' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <address className="not-italic text-sm text-gray-700">
                    {console.log("select",selectedOrder)}
                    {selectedOrder.user.address?.street}<br />
                    {selectedOrder.user.address?.city}, {selectedOrder.user.address?.state} {selectedOrder.user.address?.zipCode}<br />
                    {selectedOrder.user.address?.country}
                  </address>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h4>
                  <p className="text-sm text-gray-700">
                    Payment Method: {selectedOrder.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Total Amount: ${selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.productId} className="flex border-b pb-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img 
                          src={getProductImage(item.productId)} 
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-sm font-medium text-gray-900">
                            <h3 className="pr-6">{item.title}</h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="mt-4 flex-1 flex items-end">
                          <Link 
                            to={`/product/${item.productId}`}
                            className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
                          >
                            View Product
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;