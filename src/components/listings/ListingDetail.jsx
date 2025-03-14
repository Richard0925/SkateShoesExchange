// src/components/listings/ListingDetail.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ListingsContext } from '../../contexts/ListingsContext';

const ListingDetail = ({ listing, onRequestExchange }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [comment, setComment] = useState('');
  const { currentUser } = useContext(AuthContext);
  const { addComment } = useContext(ListingsContext);
  const navigate = useNavigate();

  const {
    id,
    title,
    brand,
    model,
    size,
    condition,
    preferredFoot,
    description,
    imageUrls,
    location,
    createdAt,
    author,
    comments = []
  } = listing;

  // Get preferred foot label
  const getFootLabel = (foot) => {
    switch (foot) {
      case 'left': return 'Left Foot';
      case 'right': return 'Right Foot';
      case 'both': return 'Both Feet';
      default: return 'Unspecified';
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!currentUser) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }

    addComment(id, comment);
    setComment('');
  };

  const handleRequestExchange = () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }

    onRequestExchange(id);
  };

  const handleContactAuthor = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Navigate to messaging with the author
    navigate(`/messages?user=${author.username}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800 dark:text-white">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image section */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-w-1 aspect-h-1">
            <img
              src={imageUrls?.[activeImageIndex] || '/assets/images/placeholder.txt'}
              alt={`${brand} ${model}`}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Thumbnails */}
          {imageUrls && imageUrls.length > 1 && (
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${idx === activeImageIndex ? 'ring-2 ring-orange-500' : 'opacity-70'
                    }`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details section */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold mb-4">{title || `${brand} ${model}`}</h1>

          <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700 dark:text-gray-200">
            <div>
              <p className="font-semibold">Brand:</p>
              <p>{brand}</p>
            </div>

            <div>
              <p className="font-semibold">Model:</p>
              <p>{model}</p>
            </div>

            <div>
              <p className="font-semibold">Size:</p>
              <p>US {size}</p>
            </div>

            <div>
              <p className="font-semibold">Condition:</p>
              <p>{condition}/10</p>
            </div>

            <div>
              <p className="font-semibold">Preferred Foot:</p>
              <p>{getFootLabel(preferredFoot)}</p>
            </div>

            <div>
              <p className="font-semibold">Location:</p>
              <p>{location}</p>
            </div>
          </div>

          {/* Author info */}
          <div className="flex items-center mb-6">
            <Link to={`/profile/${author.username}`} className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                {author.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2">
                <p className="font-medium">{author.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleRequestExchange}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium"
            >
              Request Exchange
            </button>

            <button
              onClick={handleContactAuthor}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium"
            >
              Contact Seller
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Description:</h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{description}</p>
      </div>

      {/* Comments section */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Comments:</h2>

        {comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {comments.map((comment, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Link to={`/profile/${comment.author.username}`} className="font-medium text-orange-500">
                    @{comment.author.username}
                  </Link>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-6">No comments yet</p>
        )}

        {/* Comment form */}
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-md"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingDetail;