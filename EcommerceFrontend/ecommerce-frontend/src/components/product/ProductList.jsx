// import React, {useEffect, useState} from 'react'
// import ProductCard from './ProductCard';

// const ProductList = ()=>{
//     const [products, setProducts] =useState([]);

//     useEffect(()=>{
//         fetch('https://localhost:7231/api/Product')
//         .then((res)=>res.json())
//         .then((data)=>setProducts(data))
//         .catch((err)=>console.error('Error fetching products:',err))
//     },[])

//     return(
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
//             {products.length === 0 ? (
//                 <p>No products found</p>
//             ):(products.map((product)=>(
//                 <ProductCard key={product.id} product={product} />
//             ))
//             )}
//         </div>
//     )
// }

// export default ProductList

import { useState,useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Filter,Search,Star,ShoppingCart,X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import CATEGORIES from "../../types/categories";
import { useAuth } from "../../context/AuthContext";
import debounce from 'lodash/debounce';
import renderStars from "../../types/renderStars";

const ProductList = ()=>{
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [priceRange, setPriceRange] = useState([0,20])
    const [showFilters, setShowFilters] = useState(false)
    const {addToCart,cart} = useCart()
    const {token} = useAuth()
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const navigate = useNavigate();

    useEffect(()=>{
        fetch('https://localhost:7231/api/Product')
        .then((res)=>res.json())
        .then((data)=>setProducts(data))
        .catch((err)=>console.error('Error fetching products:',err))

        const categoryParam = searchParams.get('category');
        if(categoryParam && CATEGORIES.includes(categoryParam)){
            setSelectedCategory(categoryParam)
        }
    },[searchParams])

    useEffect(()=>{
        let filtered = [...products]
        if(searchTerm){
            filtered = filtered.filter(
                (product)=>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if(selectedCategory !== 'All')
        {
            filtered = filtered.filter(
                (product)=> product.category === selectedCategory
            )
        }
        filtered = filtered.filter(
            (product)=>product.price >= priceRange[0] && product.price <= priceRange[1]
        )
        setFilteredProducts(filtered);
        setCurrentPage(1);
    },[products,searchTerm,selectedCategory,priceRange]);

    const handleAddToCart =debounce((product)=>{
      if(!token)
        navigate("/login")
      else{
        addToCart(product,1);
      }
    },900)
    const handleCategoryChange=(category)=>{
        setSelectedCategory(category)
        if(category === 'All')
        {
            searchParams.delete('category');
        }
        else{
            searchParams.set('category',category);
        }
        setSearchParams(searchParams);
    };

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currrentProducts = filteredProducts.slice(indexOfFirstProduct,indexOfLastProduct);
    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Shop Our Pickles</h1>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10 w-full"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              className="md:hidden flex items-center btn btn-outline space-x-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Filters Sidebar */}
            <div className={`md:w-64 md:block ${showFilters ? 'block' : 'hidden'}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4 md:hidden">
                  <h3 className="font-medium">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={`category-${category}`}
                          name="category"
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded-full"
                          checked={selectedCategory === category}
                          onChange={() => handleCategoryChange(category)}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>${priceRange[0].toFixed(2)}</span>
                      <span>${priceRange[1].toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                  </div>
                </div>
                <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setPriceRange([0, 20]);
                      searchParams.delete('category');
                      setSearchParams(searchParams);
                    }}
                    className="btn btn-outline"
                  >
                    Clear all filters
                  </button>
              </div>
            </div>
            
            { /* Products Grid */ }
            <div className="flex-1">
              {console.log(currrentProducts)}
              {currrentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currrentProducts.map((product) => (
                    <div key={product.id} className="card group">
                      <Link to={`/product/${product.id}`} className="block relative pt-[100%]">
                        <img 
                          src={product.images?.[0]?.imageUrl} 
                          alt={product.title} 
                          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </Link>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center text-amber-500">
                            <span className="ml-1 text-sm">{renderStars(product.rating)}</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">(
                            {product.ratingCount} reviews)
                          </span>
                        </div>
                        <Link to={`/product/${product.id}`} className="block">
                          <h3 className="font-medium text-gray-900 hover:text-teal-600 mb-1">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                          {product.stock === 0 ? (
                            <button disabled className="btn btn-disabled">Out Of Stock</button>
                          ):(
                            <button 
                            onClick={() => handleAddToCart(product)}
                            className="btn btn-primary py-1.5 text-xs"
                          >
                            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                            Add to Cart
                          </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setPriceRange([0, 20]);
                      searchParams.delete('category');
                      setSearchParams(searchParams);
                    }}
                    className="btn btn-outline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-outline"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline'}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-outline"
              >
                Next
              </button>
            </div>
        </div>
      );
}
export default ProductList