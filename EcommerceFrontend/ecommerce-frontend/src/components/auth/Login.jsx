import {useState} from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Dialog} from '@headlessui/react';

const Login = () =>{
    const [email, setEmail] = useState('')
    const[password,setPassword] = useState('')
    const [loading, setLoading] = useState('')
    const { user,login } = useAuth();
    const navigate = useNavigate()
    const location = useLocation()
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail,setForgotEmail] = useState('');

    const from = location.state?.from?.pathname || '/';
    const handleForgotPassword = async (e) => {
      e.preventDefault();
      if (!forgotEmail) return toast.error("Email is required");
      
      try {
      const response = await fetch('https://localhost:7231/api/Auth/forgot-password', {
       method: 'POST',
      headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: forgotEmail })
       });
      
       if (response.ok) {
       toast.success("Reset link sent to your email");
       setShowForgotModal(false);
       setForgotEmail('');
       } else {
       const data = await response.json();
       toast.error(data.message || "Something went wrong");
       }
       } catch (err) {
       toast.error("Failed to send reset link");
       }
      };
    const handleSubmit = async(e)=>{
        e.preventDefault()
        setLoading(true)
        try{
        const response = await fetch('https://localhost:7231/api/Auth/login',{
            method: 'POST',
            headers: {'Content-Type':'application/json' },
            body: JSON.stringify({email, password})
        })
        const data = await response.json()
        // user.isEmailConfirmed &&
        if( data.token)
        {
            console.log(data.token);
            login(data.token)
            fetch('https://localhost:7231/api/Auth/profile',{
              headers:{ Authorization:`Bearer ${data.token}`}
          })
          .then((res)=>res.json())
          .then((data)=>{
            const redirect = data?.role==="Admin"?'/admin':from;
            navigate(redirect)
            toast.success('Login successful')
          });

        }
        else{
            toast.error('Invalid credentials')
        }
    }catch(error)
    {
      console.log("login error",error)
        toast.error('Invalid credentials')
    }
    finally{
        setLoading(false)
    }
    }

    // return (
    //     <div className='max-w-md mx-auto p-6'>
    //         <h2 className='text-2xl font-bold mb-4'>Login</h2>
    //         <form onSubmit={handleSubmit} className='space-y-4'>
    //             <input type="email" placeholder='Email' className='w-full p-2 border rounded' value={email}
    //             onChange={(e)=>setEmail(e.target.value)} required />
    //             <input type="password" placeholder='Password' className='w-full p-2 border rounded' value={password}
    //             onChange={(e)=>setPassword(e.target.value)} required />
    //             <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
    //                 Login
    //             </button>
    //         </form>
    //         <div className='text-align-center'>OR</div>
    //             <a href="https://localhost:7231/api/auth/google-login">
    //             <button className='w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-2'>
    //                 Login with Google
    //             </button>
    //             </a>
    //             <a href="https://localhost:7231/api/auth/microsoft-login">
    //             <button className='w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-2'>
    //                 Login with Microsoft
    //             </button>
    //             </a>
    //     </div>
    // )

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Link to="/" className="inline-flex items-center justify-center">
                <Package className="h-10 w-10 text-teal-600" />
              </Link>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500">
                  create a new account
                </Link>
              </p>
            </div>
            
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input w-full"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
    
                <div className="text-sm text-right">
                 <button type="button" onClick={()=>setShowForgotModal(true)} className='font-medium text-teal-6000 hover:text-teal-500'>
                    Forgot your password?
                  </button>
                </div>
    
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
              
             </div>
          </div>
          {showForgotModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
              type="email"
              className="input w-full"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              />
              <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowForgotModal(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">Send Reset Link</button>
              </div>
            </form>
            </div>
          </div>
          )}
        </div>
      );
}
export default Login