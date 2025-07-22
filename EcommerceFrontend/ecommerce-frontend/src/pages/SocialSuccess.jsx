import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const SocialSuccess = () => {
    const [searchParams] = useSearchParams()
    const { login } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const token = searchParams.get('token')
        if(token){
            login(token)
            navigate('/')
        }
        else{
            toast.error('Login failed')
            navigate("/login")
        }
    },[searchParams,login,navigate])

    return <p>Logging you in......</p>
}

export default SocialSuccess