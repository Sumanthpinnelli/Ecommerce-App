import React, { createContext, useContext, useState,useEffect} from 'react';
import Cookies from 'js-cookie'

const AuthContext = createContext()
export const useAuth = ()=>useContext(AuthContext)


export const AuthProvider = ({children}) =>{
    const [user,setUser] = useState()
    const [token,setToken] = useState(Cookies.get('token')||'')
    
    useEffect(()=>{
        const fetchProfile = async ()=>{
            try{
                const response = await fetch('https://localhost:7231/api/Auth/profile',{
                    headers:{ Authorization:`Bearer ${token}`}
                });
                const data = await response.json();
                if(data?.email)
                    {
                        setUser(data)
                    }
                    else{
                        setUser(null)
                        setToken('')
                        Cookies.remove('token')
                    }
            } catch(error)
            {
                console.error("Error fetching profile",error);
                setUser(null);
                setToken('');
                Cookies.remove('token')
            }
        }
        fetchProfile();
    },[token])


    const login = (token)=>{
        Cookies.set('token',token,{expires:1})
        setToken(token)
    }
    const logout = ()=>{
        Cookies.remove('token')
        setUser(null);
        setToken('');
    }
    return (
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;