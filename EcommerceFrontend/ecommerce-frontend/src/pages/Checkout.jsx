import React, {useState} from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext';

const Checkout = ()=>{
    const { cart } = useCart()
    const { token} = useAuth();
    const {email, setEmail} = useState('');

    const handleCheckout = async()=>{
        try{
            const response = await fetch('https://localhost:7231/api/Orders/checkout',{
                method: 'POST',
                headers: {'Content-Type': 'application/json',Authorization:`Bearer ${token}`},
                body: JSON.stringify({items: cart,email})
            })
            const data = await response.json();
            window.location.href = data.url
        }
        catch(error)
        {
            console.error('Checkout failed:',error)
        }
    }
    return (
        <div className='max-w-2xl mx-auto p-4'>
            <h2 className='text-2xl font-bold mb-4'>CheckOut</h2>
            <input type="email" placeholder='Enter your email' className='w-full p-2 border mb-4 rounded' value={email} onChange={(e)=>setEmail(e.target.value)} />
            <button onClick={handleCheckout} className='w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
                Pay with Stripe
            </button>
        </div>
    )
}
export default Checkout;