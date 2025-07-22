import React from 'react'
import { useAuth } from '../../context/AuthContext'
import ProductForm from './ProductForm'
import ProductList from './ProductsList'


const AdminPanel = ()=>{
    const { user } = useAuth()

    if(!user?.role === "Admin") return <div className='p-4'>Access denied</div>

    return(
        <div className='p-6'>
            <h2 className='text-2xl font-bold mb-4'>Admin Panel</h2>
            <ProductForm />
        </div>
    )
}

export default AdminPanel;