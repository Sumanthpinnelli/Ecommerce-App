import { useState,useEffect } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";

const VerifyEmail = ()=>{
    const [searchParams] = useSearchParams();
    const [message,setMessage] = useState('');
    const navigate = useNavigate();
    useEffect(()=>{
        const token = searchParams.get('token');
        if(token)
        {
        fetch(`https://localhost:7231/api/Auth/verify-email?token=${token}`)
    .then((res)=>res.json())
    .then((data)=>{
        setMessage(data);
        setTimeout(()=>navigate('login'),3000);
        })
    .catch((err)=>{console.error('Error fetching products:',err);setMessage('Invalid or expired session try again')})
        }
        else {
            setMessage("Verification failed try again")
        }
    },[])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Verification</h2>
                <p className="text-gray-600">{message}</p>
                {message.toLowerCase().includes('success') && (
                    <p className="text-green-600 mt-2">Redirecting to login...</p>
                )}
                {message.toLowerCase().includes('invalid') && (
                    <p className="text-red-600 mt-2">Please request a new Verification link.</p>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail;