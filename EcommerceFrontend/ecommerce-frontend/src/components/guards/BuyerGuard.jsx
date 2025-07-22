import {Navigate} from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const BuyerGuard = ({children})=>{
    const {token} = useAuth();
    // const [loading,setLoading]=useState("")
    // if(loading) {
    //     return <div className='h-screen flex items-center justify-center'>Loading...</div>
    // }

    if(!token){
        return <Navigate to="/login" />
    }

    return <>{children}</>
}

export default BuyerGuard;