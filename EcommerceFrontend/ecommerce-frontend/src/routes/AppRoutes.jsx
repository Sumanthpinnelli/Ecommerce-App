import React from 'react';
import { Routes,Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetails from '../pages/ProductDetails';
import NotFound from '../pages/NotFound';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/admin/AdminPanel';
import OrderHistory from '../components/orders/OrderHistory';
import OrderSuccess from '../components/orders/OrderSuccess';
import ProductList from '../components/product/ProductList';
import SuccessPage from '../pages/SuccessPage';
import SocialSuccess from '../pages/SocialSuccess';
import AdminGuard from '../components/guards/AdminGuard';
import AdminLayout from '../components/layouts/AdminLayout'
import BuyerLayout from '../components/layouts/BuyerLayout';
import BuyerGuard from '../components/guards/BuyerGuard';
import AdminDashboard from '../pages/AdminDashboard';
import ProductManagement from '../pages/ProductManagement';
import OrderManagement from '../pages/OrderManagement';
import VerifyEmail from '../pages/VerifyEmail';
import CouponManagement from '../pages/CouponManagement';
import UserProfile from '../pages/UserProfile';
import Wishlist from '../pages/Wishlist';
import ResetPassword from '../pages/ResetPassword';

const AppRoutes = () =>{

    const PrivateRoute = ({children}) =>{
        const { token } = useAuth()
        return token ? children : <Navigate to="/login" />
    }
    return (
            <Routes>
                {/* Buyer routes */}
                <Route path="/" element ={<BuyerLayout />}>
                    <Route index element={<Home />} />
                    <Route path="verify-email" element={<VerifyEmail />}/>
                    <Route path="products" element={<ProductList />}/>
                    <Route path="product/:id" element={<ProductDetails />}/>
                    <Route path="cart" element={<BuyerGuard><Cart /></BuyerGuard>} />
                    <Route path="checkout" element={<BuyerGuard><Checkout/></BuyerGuard>}/>
                    <Route path="orders" element={<BuyerGuard><OrderHistory/></BuyerGuard>}/>
                    <Route path="profile" element={<BuyerGuard><UserProfile/></BuyerGuard>}/>
                    <Route path="wishlist" element={<BuyerGuard><Wishlist/></BuyerGuard>}/>
                </Route>
                {/* <Route path ="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<PrivateRoute><Cart/></PrivateRoute>} />
                <Route path="/checkout" element={<PrivateRoute><Checkout/></PrivateRoute>} />
                {/* <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} /> */}
                {/* <Route path="/products" element = {<PrivateRoute><ProductList/></PrivateRoute>} />  */}
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                {/* <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} /> */}
                <Route path="/social-success" element={<SocialSuccess />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* <Route path="/success" element={<SuccessPage />} /> */}
                <Route path="/success" element={<OrderSuccess />} />
                <Route path = "*" element={<NotFound />} />
                <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="coupons" element={<CouponManagement />} />
                </Route>
            </Routes>
    )
}

export default AppRoutes;