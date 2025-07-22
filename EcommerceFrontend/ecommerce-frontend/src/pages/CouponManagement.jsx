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


const CouponManagement = () => {
  const {token} = useAuth()
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing,setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const formRef = useRef(null);
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchCoupons = async () =>{
    try{
      const response = await fetch('https://localhost:7231/api/Coupon',{
        method:'GET',
        headers: { Authorization:`Bearer ${token}`}
      });
      const data = await response.json();
      setCoupons(data);
    }catch(err){
      toast.error('Failed to fetch coupons');
    }
  }

  useEffect(()=>{
    fetchCoupons();
}, []);


  const handleAddProduct = () => {
      setIsEditing(false);
      setEditId(null);
      formRef.current?.reset();
      setShowForm(true);
  };

  const handleEditProduct = (coupon) => {
    setIsEditing(true)
    setEditId(coupon.id);
    setShowForm(true);
    setTimeout(()=>{
      const form = formRef.current;
      form.code.value = coupon.code;
      form.discountAmount.value = coupon.discountAmount;
      form.minimumOrderAmount.value = coupon.minimumOrderAmount;
      form.expiryDate.value = coupon.expiryDate;
    },0);
  };

  const handleDeleteProduct = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this coupon?');
    if(!confirm) return;
    try{
      const response = await fetch(`https://localhost:7231/api/Coupon/${id}`,{
        method:'DELETE',
        headers: { Authorization:`Bearer ${token}`}
      });
      if(response.ok)
      {
        setCoupons(coupons.filter(coupon => coupon.id !== id));
        toast.success('Coupon deleted successfully');
      }
      else{
        toast.error('Failed to delete Coupon')
      }
    }
    catch{
      toast.error('Something went wrong');
    }
  };
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const url = isEditing ? `https://localhost:7231/api/Coupon/${editId}` : 'https://localhost:7231/api/Coupon';
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
      toast.success(`Coupon ${isEditing ? 'Updated': 'Added'} successfully`);
      const saved = await res.json();
      console.log(saved);
      setCoupons((prev)=> isEditing ? prev.map((p)=>(p.id === editId ? saved : p)):[...prev, saved]);
    }
    else{
      console.log(res);
      toast.error(`Failed to ${isEditing ? 'Update': 'Add'} coupon`)
    }
    setShowForm(false);
  };
  const sortedProducts = useMemo(()=>{
    return Array.isArray(coupons)?[...coupons].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }):[]; 
  },[coupons,sortField,sortDirection])
    
  const filteredProducts = useMemo(()=>{
    return sortedProducts?.filter((coupon) =>
      coupon.code?.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
  },[sortedProducts,searchTerm])
    

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Coupon Management</h1>
        <button 
          onClick={handleAddProduct}
          className="btn btn-primary flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Add Coupon
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
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Coupon Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {isEditing ? 'Edit Coupon' : 'Add New Coupon'}
            </h3>
            <button 
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form ref = {formRef}  onSubmit={handleSubmit}  className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  required
                  className="input mt-1 w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount Amount ($)*
                </label>
                <input
                  type="number"
                  name="discountAmount"
                  step="0.01"
                  min="0"
                  required
                  className="input mt-1 w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Order Amount ($) *
                </label>
                <input
                  type="number"
                  name="minimumOrderAmount"
                  step="0.01"
                  min="0"
                  required
                  className="input mt-1 w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ExpiryDate *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  required
                  className="input mt-1 w-full"
                />
              </div>
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
                {isEditing ? 'Update Coupon' : 'Add Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('code')}
                >
                  <div className="flex items-center">
                    Coupon
                    {sortField === 'code' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Expiry Date
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('minimumOrderAmount')}
                >
                  <div className="flex items-center">
                    Minimum Order Amount
                    {sortField === 'minimumOrderAmount' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('discountAmount')}
                >
                  <div className="flex items-center">
                    Discount Amount
                    {sortField === 'discountAmount' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {console.log(filteredProducts)}
              {filteredProducts?.length > 0 ? (
                filteredProducts.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {coupon.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {coupon.expiryDate?.split('T')[0] || ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${coupon.minimumOrderAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.discountAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditProduct(coupon)}
                        className="text-teal-600 hover:text-teal-900 mr-4"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(coupon.id)}
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
                    No Coupons found matching your search.
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

export default CouponManagement;