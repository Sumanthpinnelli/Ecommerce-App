import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CATEGORIES from '../types/categories';
import debounce from 'lodash/debounce'


const ProductManagement = () => {
  const {token} = useAuth()
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing,setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const formRef = useRef();
  const [previews,setPreviews] = useState([])
  const [deletedExistingImages,setDeletedExistingImages] = useState([]);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchProducts = async () =>{
    try{
      const response = await fetch('https://localhost:7231/api/Product');
      const data = await response.json();
      setProducts(data);
    }catch(err){
      toast.error('Failed to fetch products');
    }
  }

  useEffect(()=>{
    fetchProducts();
}, []);
useEffect(()=>{
  if(showForm && isEditing && editId !== null && formRef.current){
    const product = products.find(p=>p.id === editId);
    if(product){
      const form = formRef.current;
      form.title.value = product.title;
      form.description.value = product.description;
      form.price.value = product.price;
      form.stock.value = product.stock;
      form.category.value = product.category;
      form.featured.checked = product.featured;
      form.images.value = "";
    }
  }
},[showForm,isEditing,editId])

const handleFileChange =()=>{
  const files = Array.from(formRef.current.images.files);
  const urls = files.map((file)=>URL.createObjectURL(file));
  setPreviews((prev)=>[...prev, ...urls]);
}

  const handleAddProduct = debounce(() => {
      setIsEditing(false);
      setEditId(null);
      setPreviews([]);
      formRef.current?.reset();
      setShowForm(true);
  },300);

  const handleEditProduct = debounce((product) => {
    setIsEditing(true)
    setEditId(product.id);
    setPreviews(product.images || []);
    setShowForm(true);
  },300);

  const handleDeleteProduct = debounce(async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if(!confirm) return;
    try{
      const response = await fetch(`https://localhost:7231/api/Product/${id}`,{
        method:'DELETE',
        headers: { Authorization:`Bearer ${token}`}
      });
      if(response.ok)
      {
        setProducts(products.filter(product => product.id !== id));
        toast.success('Product deleted successfully');
      }
      else{
        toast.error('Failed to delete product')
      }
    }
    catch{
      toast.error('Something went wrong');
    }
  },300);
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleRemovePreview =debounce((idx)=>{
    const removedPreview = previews[idx]
    setDeletedExistingImages((prev)=>[...prev,removedPreview.imageUrl])
    const newPreviews  = previews.filter((_,i)=>i !==idx);
    setPreviews(newPreviews);
    const inputFiles = formRef.current.images.files;
    const dt = new DataTransfer();
    Array.from(inputFiles).forEach((file,i)=>{
      if(i!==idx) dt.items.add(file);
    });
    formRef.current.images.files = dt.files;
  },300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const newImages = Array.from(form.images.files);
    const formData = new FormData();
    formData.append("title",form.title.value);
    formData.append("description",form.description.value);
    formData.append("price",form.price.value);
    formData.append("stock",form.stock.value);
    formData.append("category",form.category.value);
    formData.append("featured",form.featured.checked ? "true":"false");
    if(isEditing)
    formData.append("existingImages",JSON.stringify(deletedExistingImages));

    newImages.forEach(file=>{
      formData.append("images",file);
    })
    const url = isEditing ? `https://localhost:7231/api/Product/${editId}` : 'https://localhost:7231/api/Product';
    const method = isEditing ? 'PUT' : 'POST';
    const res = await fetch(url,{
      method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if(res.ok)
    {
      console.log(res);
      const saved = await res.json();
      toast.success(`Product ${isEditing ? 'Updated': 'Added'} successfully`);
      console.log(saved);
      setProducts((prev)=> isEditing ? prev.map((p)=>(p.id === editId ? saved : p)):[...prev, saved]);
      setShowForm(false);
      setDeletedExistingImages([]);
    }
    else{
      console.log(res);
      toast.error(`Failed to ${isEditing ? 'Update': 'Add'} product`)
    }
  };
  const sortedProducts = useMemo(()=>{
    return Array.isArray(products)?[...products].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }):[]; 
  },[products,sortField,sortDirection])
    
  const filteredProducts = useMemo(()=>{
    return sortedProducts?.filter((product) =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },[sortedProducts,searchTerm])
    

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Product Management</h1>
        <button 
          onClick={handleAddProduct}
          className="btn btn-primary flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Add Product
        </button>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
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
        </div>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form ref = {formRef}  onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input mt-1 w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="input mt-1 w-full"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.filter(cat => cat !== 'All').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  required
                  className="input mt-1 w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  required
                  className="input mt-1 w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                rows={3}
                required
                className="input mt-1 w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images *
              </label>
              <input
                type="file"
                name='images'
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className='input w-full mt-1'
              />
              <div className='flex space-x-2 mt-2'>
                {previews.map((url,i)=>(
                  <div key={i} className='relative'>
                    <img src={url} alt={`preview-${i}`} className='h-16 w-16 object-cover rounded-md' />
                    <button type='button' onClick ={()=>{
                      // const files =Array.from(formRef.current.images.files);
                      // files.splice(i,1);
                      // const dt = new DataTransfer();
                      // files.forEach((f)=>dt.items.add(f));
                      // formRef.current.images.files = dt.files;
                      // handleFileChange();
                      handleRemovePreview(i);
                    }}
                    className='absolute -top-2 -right-2 bg-white p-1 rounded-full shadow' >
                    <X className='w-4 h-4 text-red-600'/>
                    </button>
                  </div>

                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Feature this product on the homepage
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Product
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {sortField === 'price' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center">
                    Stock
                    {sortField === 'stock' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {console.log(filteredProducts)}
              {filteredProducts?.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.images?.[0]?.imageUrl}
                            alt={product.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.featured ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-teal-600 hover:text-teal-900 mr-4"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-rose-600 hover:text-rose-900"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;