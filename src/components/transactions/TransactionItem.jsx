// src/components/transactions/TransactionItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TransactionItem = ({ transaction }) => {
  const {
    id,
    status,
    createdAt,
    updatedAt,
    listing,
    requester,
    owner,
  } = transaction;

  const getStatusLabel = () => {
    switch (status) {
      case 'pending':
        return { text: 'Pending Confirmation', color: 'bg-yellow-100 text-yellow-800' };
      case 'accepted':
        return { text: 'Accepted', color: 'bg-blue-100 text-blue-800' };
      case 'rejected':
        return { text: 'Rejected', color: 'bg-red-100 text-red-800' };
      case 'completed':
        return { text: 'Exchange Completed', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { text: 'Cancelled', color: 'bg-gray-100 text-gray-800' };
      default:
        return { text: 'Unknown Status', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const statusInfo = getStatusLabel();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center">
            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
              <img
                src={listing.imageUrls[0] || '/assets/images/placeholder.txt'}
                alt={`${listing.brand} ${listing.model}`}
                className="h-24 w-24 rounded-md object-cover"
              />
            </div>
            <div>
              <h4 className="text-lg font-bold">
                <Link to={`/listings/${listing.id}`} className="hover:text-orange-500">
                  {listing.brand} {listing.model}
                </Link>
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Size: US {listing.size} | Condition: {listing.condition}/10
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-2">Requester:</span>
                <Link to={`/profile/${requester.username}`} className="font-medium hover:text-orange-500">
                  {requester.username}
                </Link>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-2">Seller:</span>
                <Link to={`/profile/${owner.username}`} className="font-medium hover:text-orange-500">
                  {owner.username}
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {status === 'pending' ? 'Requested on:' : 'Updated on:'}
              <span className="ml-1">{formatDate(updatedAt || createdAt)}</span>
            </div>

            {/* Action buttons based on status */}
            {status === 'pending' && (
              <div className="mt-3 space-x-2">
                <button className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">
                  Accept
                </button>
                <button className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
                  Reject
                </button>
              </div>
            )}

            {status === 'accepted' && (
              <div className="mt-3">
                <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                  Contact for Exchange
                </button>
              </div>
            )}

            {status === 'completed' && (
              <div className="mt-3">
                <button className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600">
                  Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;