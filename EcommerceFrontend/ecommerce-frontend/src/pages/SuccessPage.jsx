import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const SuccessPage = () => {
    const { clearCart } = useCart()
    useEffect(()=> {
        clearCart()
    },[]);

    return (
        <div className='max-w-2xl mx-auto mt-10 text-center'>
            <h2 className='text-3xl font-bold mb-4'>Thank you for your order!</h2>
            <p className='text-lg'> A confirmation email has been sent to your email address.</p>
        </div>
    )
}

export default SuccessPage;