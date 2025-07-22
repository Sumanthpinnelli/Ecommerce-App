import React from 'react';
import Navbar from './components/layouts/Navbar';
import AppRoutes from './routes/AppRoutes'
import { BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <AppRoutes/>
    </BrowserRouter>
  )
}

export default App
