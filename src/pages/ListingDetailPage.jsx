import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListingsContext } from '../contexts/ListingsContext';
import { AuthContext } from '../contexts/AuthContext';
import ListingDetail from '../components/listings/ListingDetail';
import AuthModal from '../components/auth/AuthModal';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListing, isLoading, error } = useContext(ListingsContext);
  const { currentUser } = useContext(AuthContext);

  const [listing, setListing] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [exchangeRequestSent, setExchangeRequestSent] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingData = await getListing(id);
        setListing(listingData);
      } catch (err) {
        console.error('Error fetching listing:', err);
      }
    };

    fetchListing();
  }, [id, getListing]);

  // Handle exchange request
  const handleRequestExchange = async (listingId) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      // In a real implementation, this would call an API to create a transaction
      console.log(`Creating exchange request for listing ${listingId}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExchangeRequestSent(true);

      // Show success message
      setTimeout(() => {
        setExchangeRequestSent(false);
      }, 5000);
    } catch (err) {
      console.error('Error requesting exchange:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-orange-500" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error || 'Could not find information for this shoe'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-orange-500 dark:text-gray-400"
        >
          Home
        </button>
        <svg className="w-4 h-4 mx-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 dark:text-white">{listing.brand} {listing.model}</span>
      </div>

      {/* Success message */}
      {exchangeRequestSent && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <div>
            <p className="font-bold">Exchange request sent!</p>
            <p>You will be notified when the seller accepts and you can start communicating with them.</p>
          </div>
          <button
            onClick={() => setExchangeRequestSent(false)}
            className="text-green-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Listing Detail */}
      <ListingDetail
        listing={listing}
        onRequestExchange={handleRequestExchange}
      />

      {/* Related listings section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Similar Shoes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* This would show similar listings in a real implementation */}
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            Similar shoes feature coming soon
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
};

export default ListingDetailPage;