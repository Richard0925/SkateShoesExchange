// components/auth/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  // Update internal state when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle modal open state changes
  useEffect(() => {
    // Reset to login mode when modal closes
    if (!isOpen) {
      setMode('login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    console.log('AuthModal: handleSuccess called'); // Debug info
    onClose();
    console.log('AuthModal: called onClose'); // Debug info
  };

  const handleClose = () => {
    console.log('AuthModal: handleClose called'); // Debug info
    // Reset mode when closing
    setMode('login');
    onClose();
    console.log('AuthModal: reset mode and closed'); // Debug info
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={handleClose}
        ></div>

        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6 dark:bg-gray-800 dark:text-white">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {mode === 'login' ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={() => setMode('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;