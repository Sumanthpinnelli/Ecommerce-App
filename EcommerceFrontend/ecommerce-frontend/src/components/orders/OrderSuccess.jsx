import React from 'react'
import {Link} from 'react-router-dom'

const OrderSuccess = () => {
    return (
        <div className='p-6 text-center'>
            <h2 className='text-3xl font-bold text-green-600'>Payment Successful!</h2>
            <p className='mt-2'>Thank you for your purchase.</p>
            <Link to="/orders" className='text-blue-500 underline mt-4 block'>
            View My Orders
            </Link>
        </div>
    )
}

export default OrderSuccess;