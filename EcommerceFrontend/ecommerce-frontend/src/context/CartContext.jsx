import React, {createContext, useState, useContext,useEffect } from 'react'
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import debounce  from 'lodash/debounce';

// .map(item =>({
//     id: item.id,
//     name:item.product.name,
//     price:item.product.price,
//     quantity: item.quantity,
//     Product: item.Product
// }))
const CartContext = createContext();

export const useCart = ()=> useContext(CartContext)

const CartProvider = ({ children }) =>{
    const {token} = useAuth()
    const [cart,setCart] = useState([])
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const response = await fetch('https://localhost:7231/api/Cart',{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                if(response.ok)
                {
                    const res = await response.json()
                    setCart(res)
                }
            }
            catch(err)
            {
                console.error(err);
            }
        }
        if(token)
            fetchData();
    },[token])
    const addToCart = debounce(async (product, quant) =>{
        try{
            const response = await fetch('https://localhost:7231/api/Cart',{
                method:'POST',
                headers: {'Content-Type': 'application/json',Authorization:`Bearer ${token}`},
                body: JSON.stringify({productId: product.id,quantity:quant})
            })
            if(response.ok)
            {
                const isItemCart = cart.find((item)=>item.product.id === product.id)
                console.log(isItemCart);
                const currentQty = isItemCart ? isItemCart.quantity : 0;
                const totalQty = currentQty + quant;
                console.log(currentQty,totalQty);
                if(totalQty > product.stock)
                {
                    toast.error(`only ${product.stock} items available`);
                    return;
                }
                if(isItemCart)
                {
                    setCart((prev)=>
                        prev.map(item =>item.product.id === product.id ? {...item, quantity:item.quantity + quant}: item)
                    )
                }
                else
                {
                    const newItem = await response.json();
                    setCart((prev) =>[...prev, newItem])
                }
                toast.success(`${product.title} added to cart`);
            }
        }catch(err)
        {
            console.log(err);
            toast.error("failed to add product to cart");
        }
    },1000);

    const removeFromCart = async (id) =>{
        try{
        const res =await fetch(`https://localhost:7231/api/Cart/${id}`,{
            method:'DELETE',
            headers: {Authorization:`Bearer ${token}`}
        })
        if(res.ok)
        {
            setCart((prev) => prev.filter((item)=>item.id !== id))
        }
            
        else{
            toast.error("failed to delete product from cart");
        }
        }catch(err)
        {
            console.log(err);
            toast.error("failed to delete product from cart");
        }
    }

    const increaseQuantity = (id) =>{
        setCart((prev)=>prev.map((item)=>item.id === id ? {...item,quantity:item.quantity + 1}: item))
    }
    const decreaseQuantity = (id) =>{
        setCart((prev)=>prev.map((item)=>item.id === id ? {...item,quantity:item.quantity - 1}: item)
        .filter((item) => item.quantity > 0)
    )
    }
    const updateQuantity = (productId, quantity)=> {
        setCart(prev =>prev.map(item=>item.productId === productId ? {...item,quantity}:item))
    }
    const getCartTotal = ()=>{
       // return cart.reduce((total,item)=>total + item.price * item.quantity,0)
       let sum=0;
       for(const item of cart)
       {
        sum+=item.product?.price * item.quantity;
       }
       return sum;
    }
    const clearCart =async ()=>{
        try{
            const res =await fetch(`https://localhost:7231/api/Cart`,{
                method:'DELETE',
                headers: {Authorization:`Bearer ${token}`}
            })
            if(res.ok)
            {
                setCart([])
                toast.success('Items removed from cart');
            }
                
            else{
                toast.error("failed to delete product from cart");
            }
            }catch(err)
            {
                console.log(err);
                toast.error("failed to delete product from cart");
            }
    }
    return (
        <CartContext.Provider value={{cart, addToCart, removeFromCart,increaseQuantity,decreaseQuantity,clearCart,updateQuantity,getCartTotal}}>
            {children}
        </CartContext.Provider>
    )
}
export default CartProvider;