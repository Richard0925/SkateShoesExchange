// src/components/donations/DonationModal.jsx
import React, { useState } from 'react';

const DonationModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(10);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;
  
  const predefinedAmounts = [5, 10, 20, 50, 100];
  
  const handleAmountSelect = (value) => {
    setAmount(value);
  };
  
  const handleCustomAmount = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setAmount(value);
    } else if (e.target.value === '') {
      setAmount('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || amount < 1) {
      setError('Please enter a valid amount');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Simulate API call for donation processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, we would call a payment API here
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setAmount(10);
        setName('');
        setMessage('');
        setIsAnonymous(false);
      }, 3000);
    } catch (err) {
      console.error('Donation error:', err);
      setError('Donation processing failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black opacity-50" 
          onClick={onClose}
        ></div>
        
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6 dark:bg-gray-800 dark:text-white">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={isLoading || isSuccess}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Donation Successful!</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Thank you for supporting SkateSwap! Your donation will help us maintain the platform.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Support SkateSwap's Development
              </h2>
              
              <p className="mb-6 text-center text-gray-500 dark:text-gray-400">
                SkateSwap is a non-profit project, all donations will be used to maintain the platform's operating costs.
              </p>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Amount (£)</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {predefinedAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAmountSelect(val)}
                      className={`py-2 rounded-md ${
                        amount === val
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      £{val}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label htmlFor="custom-amount" className="block text-sm font-medium mb-2">
                    Custom Amount
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">£</span>
                    </div>
                    <input
                      type="number"
                      id="custom-amount"
                      value={amount}
                      onChange={handleCustomAmount}
                      className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Amount"
                      min="1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name (Optional)</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your name"
                  disabled={isAnonymous}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message (Optional)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Leave a message for developers..."
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Anonymous Donation</span>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium transition duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : 'Confirm Donation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationModal;