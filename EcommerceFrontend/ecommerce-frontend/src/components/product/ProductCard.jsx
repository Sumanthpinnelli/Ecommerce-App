import React from 'react';
import {Link} from 'react-router-dom';

const ProductCard = ({ product }) =>{

    return (
        
        <div className = "border rounded-lg shadow p-4 hover:shadow-lg transition duration-300">
        <img src={product.imageUrl} alt={product.title} className='w-full h-48 object-cover rounded' />
        <h3 className='text-lg font-semibold mt-2'>{product.title}</h3>
        <p className='text-gray-600'>${product.price}</p>
        <Link to={`/product/${product.id}`}>
            <button className='mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
                View Details
            </button>
        </Link>
        </div>
    )
}
export default ProductCard;