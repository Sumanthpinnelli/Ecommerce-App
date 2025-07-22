// import React, {useState} from 'react'
// import { useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'

// const Register = () =>{
//     const [email, setEmail] = useState('')
//     const[password,setPassword] = useState('')
//     const navigate = useNavigate()

//     const handleSubmit = async(e)=>{
//         e.preventDefault()
//         console.log("register");
//         const response = await fetch('https://localhost:7231/api/Auth/register',{
//             method: 'POST',
//             headers: {'Content-Type':'application/json' },
//             body: JSON.stringify({email, password})
//         })
//         console.log(response);
//         if(response.ok)
//         {
//             navigate('/login')
//             toast.success('Registration successful')

//         }
//         else{
//             toast.error('Registration failed')
//         }
//     }

//     return (
//         <div className='max-w-md mx-auto p-6'>
//             <h2 className='text-2xl font-bold mb-4'>Register</h2>
//             <form onSubmit={handleSubmit} className='space-y-4'>
//                 <input type="email" placeholder='Email' className='w-full p-2 border rounded' value={email}
//                 onChange={(e)=>setEmail(e.target.value)} required />
//                 <input type="password" placeholder='Password' className='w-full p-2 border rounded' value={password}
//                 onChange={(e)=>setPassword(e.target.value)} required />
//                 <button type='submit' className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700'>
//                     Register
//                 </button>
//             </form>
//         </div>
//     )
// }
// export default Register





import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length:false,
    lowercase:false,
    uppercase:false,
    digit:false,
    specialChar:false
  });
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  useEffect(()=>{
    const allValid = Object.values(passwordValidation).every(Boolean);
    if(allValid)
    {
      setShowPasswordRules(false);
    }
  },[passwordValidation]);

  const validatePassword = (value) =>{
    setPasswordValidation({
      length:value.length >=8,
    lowercase:/[a-z]/.test(value),
    uppercase:/[A-Z]/.test(value),
    digit:/\d/.test(value),
    specialChar:/[^a-zA-Z\d]/.test(value)
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    if(!passwordRegex.test(password))
    {
      toast.error('Password must be at least 8 characters, include uppercase,lowercase,number and special character');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
        console.log("register");
              if(password !== confirmPassword)
                toast.error('Passwords doesnot match')
                const response = await fetch('https://localhost:7231/api/Auth/register',{
                    method: 'POST',
                    headers: {'Content-Type':'application/json' },
                    body: JSON.stringify({name,email, password,confirmPassword})
                })
                console.log(response);
                if(response.ok)
                {
                    navigate('/login')
                    toast.success('Registration successful! Please check your email to verify your account')
        
                }
                else{
                    toast.error('Registration failed')
                }
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <Package className="h-10 w-10 text-teal-600" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {setPassword(e.target.value); validatePassword(e.target.value); if(e.target.value.length >0){setShowPasswordRules(true)}}}
                  onBlur={()=>{
                    if(password.length===0)
                    {
                      setShowPasswordRules(false)
                    }
                  }}
                  onFocus={()=>{
                    if(password.length > 0)
                      {
                        setShowPasswordRules(true)
                      }
                  }}
                  className="input w-full"
                  placeholder="Create a password"
                />
                { showPasswordRules && (
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p className={passwordValidation.length ? 'text-green-600' : 'text-red-500'}>
                      • At least 8 characters
                    </p>
                    <p className={passwordValidation.lowercase ? 'text-green-600' : 'text-red-500'}>
                      • At least one lowercase letter
                    </p>
                    <p className={passwordValidation.uppercase ? 'text-green-600' : 'text-red-500'}>
                      • At least one uppercase letter
                    </p>
                    <p className={passwordValidation.digit ? 'text-green-600' : 'text-red-500'}>
                      • At least one digit
                    </p>
                    <p className={passwordValidation.specialChar ? 'text-green-600' : 'text-red-500'}>
                      • At least one special character
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input w-full"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-xs text-gray-500 text-center">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-teal-600 hover:text-teal-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-teal-600 hover:text-teal-500">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;