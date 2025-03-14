// components/layout/Header.jsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DonateButton from '../donations/DonateButton';
import AuthModal from '../auth/AuthModal';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle navigation link clicks
  const handleNavigation = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-heading tracking-wider text-white">SKATE<span className="text-orange-500">SWAP</span></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/create-listing" className="text-white hover:text-orange-400 font-medium">
                  <i className="fas fa-plus-circle mr-1"></i> List Shoe
                </Link>
                <Link to="/messages" className="text-white hover:text-orange-400">
                  <i className="fas fa-envelope mr-1"></i> Messages
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center focus:outline-none hover:text-orange-400 transition-colors"
                    onClick={toggleDropdown}
                  >
                    <span className="mr-1">{currentUser.username}</span>
                    <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} text-xs ml-1`}></i>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg z-20" onClick={e => e.stopPropagation()}>
                      <a
                        href="#"
                        onClick={(e) => handleNavigation(e, `/profile/${currentUser.username}`)}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-orange-500"
                      >
                        <i className="fas fa-user mr-2"></i> Profile
                      </a>
                      <a
                        href="#"
                        onClick={(e) => handleNavigation(e, `/profile/${currentUser.username}?tab=listings`)}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-orange-500"
                      >
                        <i className="fas fa-shoe-prints mr-2"></i> My Shoes
                      </a>
                      <a
                        href="#"
                        onClick={(e) => handleNavigation(e, "/donation")}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-orange-500"
                      >
                        <i className="fas fa-hand-holding-heart mr-2"></i> Donation
                      </a>
                      <a
                        href="#"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-orange-500"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium transition-colors"
              >
                <i className="fas fa-sign-in-alt mr-1"></i> Login
              </button>
            )}
            <DonateButton />
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthMode('login');
        }}
        initialMode={authMode}
      />
    </header>
  );
};

export default Header;