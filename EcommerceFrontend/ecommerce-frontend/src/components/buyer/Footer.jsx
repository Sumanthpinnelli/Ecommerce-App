import { Link } from 'react-router-dom';
import { Package, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Package className="h-6 w-6 text-teal-400" />
              <span className="text-xl font-bold">Pickels</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Premium quality pickles for pickle enthusiasts. Hand-crafted with care using traditional recipes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Dill" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Dill Pickles
                </Link>
              </li>
              <li>
                <Link to="/products?category=Sweet" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Sweet Pickles
                </Link>
              </li>
              <li>
                <Link to="/products?category=Spicy" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Spicy Pickles
                </Link>
              </li>
              <li>
                <Link to="/products?category=Variety" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Variety Packs
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">
                123 Pickle Lane
                <br />
                Pickleville, NY 10001
              </li>
              <li className="text-gray-400 text-sm">
                <a href="tel:+1234567890" className="hover:text-teal-400 transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@pickels.com" className="hover:text-teal-400 transition-colors">
                  info@pickels.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Pickels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;