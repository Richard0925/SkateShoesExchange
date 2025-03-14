import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ListingForm from '../components/listings/ListingForm';

const CreateListingPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  if (!currentUser) {
    return null; // Return null while redirecting
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 dark:text-white">List New Shoes</h1>
        <ListingForm />
      </div>
    </div>
  );
};

export default CreateListingPage;