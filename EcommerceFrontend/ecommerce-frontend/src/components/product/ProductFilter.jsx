import React, {useState,useEffect} from 'react'

const ProductFilter = ({onFilter}) =>{
    const [categories,setCategories] = useState([])
    const [selectedCategory,setSelectedCategory] = useState('')
    const [priceOrder, setPriceOrder] = useSate('')

    useEffect(() =>{
        const fetchCategories = async () => {
            const res = await fetch('https://localhost:7512/api/categories')
            const data = await res.json();
            setCategories(data)
        }
        fetchCategories()
    },[])

    const handleFilterChange = ()=>{
        onFilter({category:selectedCategory,priceOrder})
    } 

    return (
        <div className='flex space-x-4 mt-4'>
            <select value ={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)} className='border p-2 rounded'>
                <option value="">All Categories</option>
                {categories.map((cat)=>(
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
            </select>
            <select value={priceOrder} onChange={(e)=>setPriceOrder(e.target.value)} className='border p-2 rounded'>
                <option value="">Sort by Price</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
            </select>

            <button onClick={handleFilterChange} className='bg-blue-500 text-white p-2 rounded'>Apply Filters</button>
        </div>
    )
}
export default ProductFilter