import {Navigate} from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react';

const AdminGuard = ({children})=>{
    const {user,token} = useAuth();
    const [loading,setLoading]=useState("")

    if(loading) {
        return <div className='h-screen flex items-center justify-center'>Loading...</div>
    }
    console.log(user);
    // || user.role !=='Admin'
    if(!token ){
        return <Navigate to="/login" />
    }

    return <>{children}</>
}

export default AdminGuard;