// components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import DonateButton from '../donations/DonateButton';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-heading tracking-wider mb-4">SKATESWAP</h3>
            <p className="text-gray-300">
              A skateboard shoe exchange platform, providing a safe and convenient exchange community for skateboard enthusiasts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-heading tracking-wider mb-4">LINKS</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors"><i className="fas fa-home mr-2"></i>Home</Link></li>
              <li><Link to="/create-listing" className="text-gray-300 hover:text-orange-400 transition-colors"><i className="fas fa-plus-circle mr-2"></i>Post Shoes</Link></li>
              <li><Link to="/messages" className="text-gray-300 hover:text-orange-400 transition-colors"><i className="fas fa-envelope mr-2"></i>Messages</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading tracking-wider mb-4">ABOUT</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-orange-400 transition-colors"><i className="fas fa-info-circle mr-2"></i>About Us</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-orange-400 transition-colors"><i className="fas fa-file-contract mr-2"></i>Terms of Use</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-orange-400 transition-colors"><i className="fas fa-shield-alt mr-2"></i>Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading tracking-wider mb-4">SUPPORT US</h3>
            <p className="text-gray-300 mb-4">
              SkateSwap is a non-profit project maintained through donations.
            </p>
            <DonateButton className="w-full" />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <div className="flex justify-center space-x-4 mb-4">
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
              <i className="fab fa-youtube text-xl"></i>
            </a>
          </div>
          <p>© {new Date().getFullYear()} SkateSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;