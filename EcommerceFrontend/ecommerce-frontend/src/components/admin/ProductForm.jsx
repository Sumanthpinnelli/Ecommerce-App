import React, { useState} from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const ProductForm = () =>{
    const {token} = useAuth()
    const [form,setForm] = useState({name:'',description:'',price:'',imageUrl:'',quantity:''})

    const handleChange = (e) =>{
        setForm({ ...form, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const res = await fetch('https://localhost:7231/api/Product',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                Authorization:`Bearer ${token}`
            },
            body:JSON.stringify(
                {
                    ...form,
                    price: parseFloat(form.price)
                }
            )
        })
        if(res.ok)
        {
            toast.success('Product added!')
            setForm({name:'',description:'',price:'',image:''})
        }
        else{
            console.log(res);
            toast.error('Error adding product')
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4 max-w-md' >
            <input name="name" placeholder='Name' className='w-full p-2 border rounded' onChange={handleChange} value={form.name} required/>
            <input name="description" placeholder='Description' className='w-full p-2 border rounded' onChange={handleChange} value={form.description} required/>
            <input name="imageUrl" placeholder='Image URL' className='w-full p-2 border rounded' onChange={handleChange} value={form.imageUrl} required/>
            <input name="price" type='number' placeholder='Price' className='w-full p-2 border rounded' onChange={handleChange} value={form.price} required/>
            <input name="quantity" type='number' placeholder='Quantity' className='w-full p-2 border rounded' onChange={handleChange} value={form.quantity} required/>
            <button type="submit" className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'>Add Product</button>
        </form>
    )
}
export default ProductForm;