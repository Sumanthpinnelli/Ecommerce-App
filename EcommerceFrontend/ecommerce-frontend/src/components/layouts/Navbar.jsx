import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {FiShoppingCart,FiLogIn, FiUserPlus, FiLogOut, FiSettings, FiBox, FiClipboard} from "react-icons/fi";

const Navbar = ()=>{
    const { user, logout } = useAuth()
    const { cart } = useCart()
    const cartCount = Array.isArray(cart)? cart.reduce((acc,item) =>acc + item.quantity,0) : 0
    const navigate = useNavigate()

    const handleLogout = ()=>{
        logout()
        navigate('/')
    }
    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-wide hover:text-gray-200 transition-colors no-underline">
                    Ecommerce-Shop
                </Link>
            <div className="flex space-x-6 text-sm font-medium">
                <Link to="/" className="hover:text-gray-200 transition-colors duration-200 no-underline">Home</Link>
                {user?.role==="Admin" && <Link to="/products" className="hover:text-gray-200 transition-colors duration-200 no-underline"><FiBox/>Products</Link>}
                { user && user?.role!=="Admin" && <Link to="/orders" className="hover:text-gray-200 transition-colors duration-200 no-underline">Orders</Link> }
                {user && user?.role!=="Admin" && <Link to="/cart" className="hover:text-gray-200 transition-colors duration-200 no-underline">
                                {cartCount > 0 && (
                        <span className="hover:text-red-200 transition-colors duration-200 no-underline">
                            {console.log("Hello cart",cartCount)}
                            {cartCount}
                        </span>
                    )}
                <FiShoppingCart className="text-white text-2xl">
                </FiShoppingCart>
                </Link>}
                {user?.role==="Admin" && <Link to="/admin" className="hover:text-gray-200 transition-colors duration-200 no-underline"><FiSettings/>Admin</Link>}
                {user ? (
                    <>
                        <span className="text-sm">Hi, {user.username}</span>
                        <button onClick={handleLogout} className="hover:text-gray-200 transition-colors duration-200 no-underline"><FiLogOut /></button>
                    </>
                ) :(
                    <>
                        <Link to="/login" className="hover:text-gray-200 transition-colors duration-200 no-underline"><FiLogIn />Login</Link>
                        <Link to="/register" className="hover:text-gray-200 transition-colors duration-200 no-underline"><FiUserPlus/>Register </Link>
                    </>
                )}
                
            </div>
            </div>
        </nav>

    )
}

export default Navbar;