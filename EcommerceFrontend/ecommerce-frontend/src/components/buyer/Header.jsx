import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Search, 
  Menu, 
  X,
  Package,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();
  const { cart } = useCart();
  

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-7 w-7 text-teal-600" />
            <span className="text-xl font-bold">Pickels</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  clsx(
                    'text-sm font-medium hover:text-teal-600 transition-colors',
                    isActive ? 'text-teal-600' : 'text-gray-700'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Search, Cart, Profile */}
          <div className="flex items-center space-x-4">
            <Link to="/products" className="text-gray-700 hover:text-teal-600">
              <Search className="h-5 w-5" />
            </Link>
            
            <Link to="/wishlist" className="text-gray-700 hover:text-teal-600">
              <Heart className="h-5 w-5" />
            </Link>
            
            <Link to="/cart" className="text-gray-700 hover:text-teal-600 relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            
            <div className="relative">
              <button 
                className="text-gray-700 hover:text-teal-600 rounded-full"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {token && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {token ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 border-t pt-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    clsx(
                      'text-base font-medium hover:text-teal-600',
                      isActive ? 'text-teal-600' : 'text-gray-700'
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              
              {token && (
                <>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      clsx(
                        'text-base font-medium hover:text-teal-600 flex items-center',
                        isActive ? 'text-teal-600' : 'text-gray-700'
                      )
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </NavLink>
                  <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                      clsx(
                        'text-base font-medium hover:text-teal-600 flex items-center',
                        isActive ? 'text-teal-600' : 'text-gray-700'
                      )
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Orders
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-base font-medium text-gray-700 hover:text-teal-600 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              )}
              
              {!token && (
                <>
                  <NavLink
                    to="/login"
                    className="text-base font-medium text-gray-700 hover:text-teal-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="text-base font-medium text-gray-700 hover:text-teal-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create account
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;