import { useAuth } from "../context/AuthContext"
    const {token} = useAuth();
    const response = await fetch('https://localhost:7231/api/Cart',{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const getCartItems = await response.json()
    console.log("cardata",res);
export default getCartItems;