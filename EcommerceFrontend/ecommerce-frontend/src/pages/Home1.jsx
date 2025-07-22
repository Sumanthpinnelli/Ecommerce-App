import React from 'react';
import ProductList from '../components/product/ProductList';

const Home1 = ()=>{
    return(
        <div className='max-w-6xl mx-auto p-4'>
            <h1 className='text-3xl font-bold mb-6'>Our Products</h1>
            <ProductList />
        </div>
    )
}

export default Home1;

