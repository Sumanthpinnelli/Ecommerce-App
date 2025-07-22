import React, {useEffect,useState} from 'react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ProductsList = () => {
    const {token} = useAuth()
    const[products,setProducts] = useState([])
    const [isEditing,setIsEditing] = useState(false)
    const[editedProduct,setEditedProduct] = useState(null)

    const fetchProducts = async () =>{
        const res = await fetch('https://localhost:7231/api/Product')
        const data = await res.json();
        setProducts(data)
    }

    const deleteProduct = async (id) => {
        const res = await fetch('https://localhost:7231/api/Product',{
            method:'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if(res.ok){
            toast.success('Product deleted')
            fetchProducts()
        }
        else{
            toast.error('Failed to delete')
        }
    }
    const updateProduct = async () =>{
        console.log(editedProduct);
        if(editedProduct.name === null || editedProduct=== null || editedProduct.imageUrl=== null || editedProduct.price=== null || editedProduct.stock === null)
        {
            toast.error('Please fill in all fields')
            return
        }
        try{
            const res = await fetch(`https://localhost:7231/api/Product/${editedProduct.id}`,{
                method:'PUT',
            headers: {
                'Content-Type':'application/json',
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify({
                name:editedProduct.title,
                description:editedProduct.description,
                imageUrl:editedProduct.imageUrl,
                price:parseFloat(editedProduct.price),
                quantity:editedProduct.stock
            })
            })
            if(res.ok){
                toast.success('Product updated successsfully')
                setIsEditing(false)
                fetchProducts()
            }
            else{
                toast.error('Failed to update product')
            }
        }catch(error)
        {
            console.log(error);
            toast.error("error occurred while updating the product")
        }
    }

    const handleEditChange = (e) => {
        const {name,value} = e.target
        setEditedProduct((prev)=>({
            ...prev,
            [name]: value
        }))
    }

    const handleEditClick = (product)=>{
        setIsEditing(true)
        setEditedProduct({...product})
    }
    const handleCancelEdit = () =>{
        setIsEditing(false)
        setEditedProduct(null)
    }
    useEffect(()=>{
        fetchProducts()
    },[])

    return(
        <div className='mt-6'>
            <h3 className='text-xl font-bold mb-4'>Manage Products</h3>
            <div className='space-y-2'>
                {products.length>0 ? 
                (products.map((product)=>(
                    <div key={product.id} className='border p-2 flex justify-between items-center'>
                        <div>
                            <img src={product.imageUrl} alt={product.title} className='w-full h-48 object-cover rounded' />
                            <p className='font-semibold'>{product.title}</p>
                            <p className='text-sm text-gray-500'>${product.price}</p>
                            <p className='text-sm text-gray-500'>{product.stock}</p>
                        </div>
                        <div className='space-x-2'>
                            {/* edit logic */}
                            <button className='bg-blue-500 text-white px-2 py-1 rounded' onClick={()=>handleEditClick(product)}>
                                Edit
                            </button>
                            <button className='bg-red-500 text-white px-2 py-1 rounded' onClick={()=> deleteProduct(product.id)}>
                                Delete
                            </button>
                        </div>
                     </div>
                ))) : (
                    <p>No Products available</p>
                )   
                }
            </div>
            {isEditing && (
                <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50'>
                    <div className='bg-white rounded-lg shadow-lg p-6  w-full max-w-md'>
                        <h2 className='text-2xl font-bold mb-6'>Edit Product</h2>
                        <div className='mb-4'>
                        <label className='block text-sm font-medium mb-1'>Product Title</label>
                        <input type="text" name="title" value={editedProduct.title} onChange={handleEditChange}
                        className='border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300' />
                        </div>
                        <div className='mb-4'>
                        <label className='block mb-2'>Product Description</label>
                        <input type="text" name="description" value={editedProduct.description} onChange={handleEditChange}
                        className='border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300' />
                        </div>
                        <div className='mb-4'>
                        <label className='block mb-2'>Product ImageUrl</label>
                        <input type="text" name="imageUrl" value={editedProduct.imageUrl} onChange={handleEditChange}
                        className='border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300' />
                        </div>
                        <div className='mb-4'>
                        <label className='block mb-2'>Product Price</label>
                        <input type="number" name="price" value={editedProduct.price} onChange={handleEditChange}
                        className='border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300' />
                        </div>
                        <div className='mb-4'>
                        <label className='block mb-2'>Product Quantity</label>
                        <input type="number" name="stock" value={editedProduct.stock} onChange={handleEditChange}
                        className='border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300' />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button className='bg-gray-300 px-4 py-2 rounded' onClick={handleCancelEdit}>
                                Cancel
                            </button>
                            <button className='bg-green-500 text-white px-4 py-2 rounded' onClick={updateProduct}>
                                Save
                            </button>
                        </div>
                    </div>
                    </div>
            )}
        </div>
    )
}
export default ProductsList;