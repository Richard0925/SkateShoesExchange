// src/components/donations/DonateButton.jsx
import React, { useState } from 'react';
import DonationModal from './DonationModal';

const DonateButton = ({ className = '', size = 'normal' }) => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const openDonationModal = () => {
    setIsDonationModalOpen(true);
  };

  // Different button styles based on size prop
  const buttonClasses = {
    small: "px-3 py-1 text-sm",
    normal: "px-4 py-2",
    large: "px-6 py-3 text-lg"
  };

  return (
    <>
      <button
        onClick={openDonationModal}
        className={`bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors duration-200 flex items-center ${buttonClasses[size]} ${className}`}
      >
        <i className="fas fa-beer mr-2"></i>
        Support Us
      </button>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </>
  );
};

export default DonateButton;