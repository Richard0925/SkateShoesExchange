import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/profile/UserProfile';
import CurrentUserProfile from '../components/profile/CurrentUserProfile';
import UserListings from '../components/profile/UserListings';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { currentUser } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("ProfilePage: Component rendered");
    console.log("ProfilePage: Username param:", username);
    console.log("ProfilePage: Current user:", currentUser);

    if (!username && !currentUser) {
      console.warn("ProfilePage: No username parameter and no current user");
      setError("Please log in or specify a username");
    } else {
      setError(null);
    }

    setLoading(false);

    // Check if viewing own profile
    if (currentUser && username) {
      const isOwnProfile = currentUser.username === username;
      console.log("ProfilePage: Is own profile:", isOwnProfile);
      setIsCurrentUser(isOwnProfile);
    } else if (currentUser && !username) {
      // If no username provided, default to current user's profile
      console.log("ProfilePage: No username provided, redirecting to current user profile");
      navigate(`/profile/${currentUser.username}`);
    }
  }, [username, currentUser, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-orange-500" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!username && !currentUser) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>Please log in to view your profile, or specify a username to view another user's profile.</p>
        <Link to="/" className="text-blue-500 underline mt-2">Return to Home</Link>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {isCurrentUser ? (
          <>
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <CurrentUserProfile />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">User Profile: {username}</h1>
            <UserProfile username={username} />
          </>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Listings</h2>
        <UserListings username={username || (currentUser && currentUser.username)} />
      </div>
    </div>
  );
};

export default ProfilePage;