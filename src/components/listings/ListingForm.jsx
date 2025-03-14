// src/components/listings/ListingForm.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ListingsContext } from '../../contexts/ListingsContext';

const ListingForm = ({ listing = null }) => {
  const isEditing = !!listing;
  const { currentUser } = useContext(AuthContext);
  const { addListing, updateListing } = useContext(ListingsContext);
  const navigate = useNavigate();

  // Form fields
  const [title, setTitle] = useState(listing?.title || '');
  const [brand, setBrand] = useState(listing?.brand || '');
  const [model, setModel] = useState(listing?.model || '');
  const [size, setSize] = useState(listing?.size || '');
  const [condition, setCondition] = useState(listing?.condition || '8');
  const [preferredFoot, setPreferredFoot] = useState(listing?.preferredFoot || '');
  const [description, setDescription] = useState(listing?.description || '');
  const [location, setLocation] = useState(listing?.location || currentUser?.location || '');
  const [images, setImages] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Popular brands for select options
  const popularBrands = [
    'Nike SB', 'Adidas', 'Vans', 'Converse', 'New Balance', 
    'DC Shoes', 'És', 'Emerica', 'Lakai', 'Etnies', 'Other'
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!currentUser) {
      setError('Please login first');
      setIsLoading(false);
      return;
    }

    try {
      const listingData = {
        title: title || `${brand} ${model}`,
        brand,
        model,
        size,
        condition: parseInt(condition, 10),
        preferredFoot,
        description,
        location,
        // In a real app, we would handle image upload with FormData and store URLs
        imageUrls: images.length ? 
          Array(images.length).fill('/assets/images/placeholder.txt') : 
          (listing?.imageUrls || ['/assets/images/placeholder.txt']),
      };

      if (isEditing) {
        await updateListing(listing.id, listingData);
        navigate(`/listings/${listing.id}`);
      } else {
        const newListingId = await addListing(listingData);
        navigate(`/listings/${newListingId}`);
      }
    } catch (err) {
      setError('Listing failed, please try again');
      console.error('Error submitting listing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Shoe Listing' : 'List New Shoes'}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium mb-2">Brand *</label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="">Select Brand</option>
              {popularBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="model" className="block text-sm font-medium mb-2">Model *</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Example: Dunk Low Pro"
              required
            />
          </div>
          
          <div>
            <label htmlFor="size" className="block text-sm font-medium mb-2">Size *</label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="">Select Size</option>
              {Array.from({ length: 16 }, (_, i) => i + 35).map(size => (
                <option key={size} value={size}>US {size}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="condition" className="block text-sm font-medium mb-2">Condition (1-10) *</label>
            <div className="flex items-center">
              <input
                type="range"
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                min="1"
                max="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                required
              />
              <span className="ml-2 font-bold text-lg">{condition}/10</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="preferredFoot" className="block text-sm font-medium mb-2">Preferred Foot *</label>
            <select
              id="preferredFoot"
              value={preferredFoot}
              onChange={(e) => setPreferredFoot(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="">Select Preferred Foot</option>
              <option value="left">Left Foot</option>
              <option value="right">Right Foot</option>
              <option value="both">Both Feet</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Example: Los Angeles"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium mb-2">Title (Optional)</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="Will use brand and model if left empty"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="Describe the shoe's condition, wear and tear, what type of skaters it's suitable for, etc."
            required
          ></textarea>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Shoe Images (Max 5) *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Please upload clear photos of the shoes, including front view, side view, and close-ups of worn areas
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 mr-4 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isEditing ? 'Save Changes' : 'List Shoes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;