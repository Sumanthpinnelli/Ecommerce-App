import { useState } from 'react';
import { User, Mail, MapPin, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user,token } = useAuth()
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isDefault: true,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmitProfile = async(e) => {
    e.preventDefault();
    setLoading(true);
    
    try{
        await fetch('https://localhost:7231/api/Auth/profile',{
            method:"PUT",
            headers:{ 'Content-Type':'application/json',Authorization:`Bearer ${token}`},
            body: JSON.stringify(profileData)
        })
        toast.success('Profile updated successfully');
    }
    catch(err){
        console.error(err);
        toast.error('Failed to update profile');
    }
    finally{
        setLoading(false);
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try{
        await fetch('https://localhost:7231/api/Auth/address',{
            method:"PUT",
            headers:{ 'Content-Type':'application/json',Authorization:`Bearer ${token}`},
            body: JSON.stringify(addressData)
        })
        toast.success('Address saved successfully');
    }
    catch(err){
        console.error(err);
        toast.error('Failed to update address');
    }
    finally{
        setLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try{
        await fetch('https://localhost:7231/api/Auth/password',{
            method:"PUT",
            headers:{ 'Content-Type':'application/json',Authorization:`Bearer ${token}`},
            body: JSON.stringify({currentPassword: passwordData.currentPassword,newPassword: passwordData.newPassword})
        })
        toast.success('Password changed successfully');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
    }
    catch(err){
        console.error(err);
        toast.error('Failed to change password');
    }
    finally{
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Account</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-gray-500 hover:text-teal-600'
              }`}
            >
              <User className="h-4 w-4 inline-block mr-2" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'address'
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-gray-500 hover:text-teal-600'
              }`}
            >
              <MapPin className="h-4 w-4 inline-block mr-2" />
              Shipping Address
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'password'
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-gray-500 hover:text-teal-600'
              }`}
            >
              <KeyRound className="h-4 w-4 inline-block mr-2" />
              Change Password
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmitProfile} className="max-w-lg space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="input w-full"
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  className="input w-full"
                  placeholder="Tell us a little about yourself"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'address' && (
            <form onSubmit={handleSubmitAddress} className="max-w-lg space-y-6">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={addressData.street}
                  onChange={handleAddressChange}
                  className="input w-full"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressChange}
                    className="input w-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={addressData.zipCode}
                    onChange={handleAddressChange}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={addressData.country}
                    onChange={handleAddressChange}
                    className="input w-full"
                  >
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                    <option value="MEX">Mexico</option>
                    <option value="IND">India</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={addressData.isDefault}
                  onChange={() => 
                    setAddressData({ ...addressData, isDefault: !addressData.isDefault })
                  }
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default shipping address
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'password' && (
            <form onSubmit={handleSubmitPassword} className="max-w-lg space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;