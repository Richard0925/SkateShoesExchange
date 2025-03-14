// src/components/profile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserProfile } from '../../utils/api';

const UserProfile = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log("UserProfile rendered with username:", username);
  }, [username]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        console.error("UserProfile: No username provided");
        setError("No username provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("UserProfile: Fetching profile for:", username);

        // Log the API endpoint we're calling
        console.log("UserProfile: Calling API endpoint:", `/users/profile/${username}`);

        const userData = await fetchUserProfile(username);
        console.log("UserProfile: Profile data received:", userData);

        if (!userData) {
          console.error("UserProfile: Received null or undefined user data");
          setError("Failed to fetch user profile data");
          setProfile(null);
        } else {
          setProfile(userData);
          setError(null);
        }
      } catch (err) {
        console.error("UserProfile: Error fetching user profile:", err);
        console.error("UserProfile: Error details:", err.message);
        setError("Unable to load user profile: " + (err.message || "Unknown error"));
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const getPreferredFootLabel = (foot) => {
    switch (foot) {
      case 'regular': return 'Regular Stance';
      case 'goofy': return 'Goofy Stance';
      case 'both': return 'Both Stances';
      default: return 'Not Set';
    }
  };

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
        <Link to="/" className="text-blue-500 underline mt-2">Return to Home</Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>User profile not found.</p>
        <Link to="/" className="text-blue-500 underline mt-2">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800 dark:text-white">
      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-r from-gray-800 to-orange-500"></div>

      <div className="relative px-6 py-4">
        <div className="absolute -top-16 left-6">
          <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold text-gray-600 dark:border-gray-700">
            {profile.username?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>

        <div className="mt-20">
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown date'}
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">Preferred Foot</p>
              <p className="text-xl font-semibold">{getPreferredFootLabel(profile.preferredFoot)}</p>
            </div>
            <div className="p-4 border rounded-lg dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">Shoe Size</p>
              <p className="text-xl font-semibold">{profile.shoeSize || 'Not Set'}</p>
            </div>
            <div className="p-4 border rounded-lg dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
              <p className="text-xl font-semibold">{profile.location || 'Not Set'}</p>
            </div>
          </div>

          {/* User Stats */}
          <div className="mt-6 flex space-x-4 text-center border-t border-b py-3 dark:border-gray-600">
            <div className="flex-1">
              <p className="text-2xl font-bold">{profile.listingsCount || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Listed Shoes</p>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold">{profile.transactionsCount || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Successful Trades</p>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold">{profile.rating ? `${profile.rating}/5` : 'New User'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;