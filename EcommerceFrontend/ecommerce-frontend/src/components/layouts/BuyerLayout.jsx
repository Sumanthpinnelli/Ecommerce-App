import { Outlet } from 'react-router-dom';
import Header from '../buyer/Header';
import Footer from '../buyer/Footer';

const BuyerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default BuyerLayout;