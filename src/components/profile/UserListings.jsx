// src/components/profile/UserListings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getListingsByUser } from '../../utils/api';

const UserListings = ({ username }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("UserListings rendered with username:", username);

    const fetchListings = async () => {
      if (!username) {
        setListings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getListingsByUser(username);
        console.log("Fetched listings:", response);
        setListings(Array.isArray(response) ? response : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Could not load listings. Please try again later.");
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-orange-500" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-8 rounded text-center">
        <p className="mb-4">No listings found for this user.</p>
        {username && (
          <Link to="/new-listing" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
            Create Your First Listing
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <Link to={`/listing/${listing.id}`}>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No Image Available
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded text-sm font-medium">
                {listing.condition}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">{listing.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 truncate">{listing.brand}</p>
              <div className="flex justify-between items-center">
                <p className="text-orange-500 font-bold">${listing.price}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Size: {listing.size}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default UserListings;