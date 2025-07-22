import React from 'react'

const CartItem = ({item, onRemove,increaseQuantity,decreaseQuantity}) =>
{
    return(
        <div className='flex justify-between items-center p-4 border-b'>
            <div>
                <h3 className='text-lg font-semibold'>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
            </div>
            <div className='flex items-center gap-3'>
                <button onClick={()=>decreaseQuantity(item.id)} className='bg-gray-300 px-2 py-1 rounded'>-</button>
                <span>{item.quantity}</span>
                <button onClick={()=>increaseQuantity(item.id)} className='bg-gray-300 px-2 py-1 rounded'>+</button>
            </div>
            <div>
            <button onClick={()=> onRemove(item.id)} className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'>
                Remove
            </button>
            </div>
        </div>
    )
}
export default CartItem;