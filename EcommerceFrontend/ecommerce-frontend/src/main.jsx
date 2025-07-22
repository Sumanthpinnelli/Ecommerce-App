import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
// import App1 from './App1'
import { BrowserRouter } from 'react-router-dom'
import CartProvider from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster 
         position = "top-center"
         toastOptions={{
          duration:2000,
          style:{
            background:'#363636',
            color:'#fff'
          }
         }}/>
      </CartProvider>
    </AuthProvider>
    {/* <App1 /> */}
  </StrictMode>
)
