// components/listings/ListingCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../../src/styles/street-style.css';

const ListingCard = ({ listing }) => {
  const {
    id,
    title,
    brand,
    model,
    size,
    condition,
    preferredFoot,
    imageUrls,
    location,
    createdAt,
    author
  } = listing;

  // Format date to DD/MM/YY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(2)}`;
  };

  // Get condition label
  const getConditionLabel = (condition) => {
    const condValue = parseInt(condition);
    if (condValue >= 9) return 'New';
    if (condValue >= 7) return 'Like New';
    if (condValue >= 5) return 'Good';
    if (condValue >= 3) return 'Fair';
    return 'Worn';
  };

  // Correct brand name if needed
  const correctedBrand = brand === 'Addias' ? 'Adidas' : brand;

  // Skip invalid items
  if (
    !correctedBrand ||
    correctedBrand === 'generate' ||
    correctedBrand === 'Lumped' ||
    correctedBrand === 'grubatis' ||
    correctedBrand === 'undefined' ||
    correctedBrand === 'NaN'
  ) {
    return null;
  }

  // Create a clean title
  const cleanTitle = `${correctedBrand} ${model}`.replace(/EHENGA RETINUUS 86/g, 'Emerica Reynolds G6');

  // Get condition color
  const getConditionColor = (condition) => {
    const condValue = parseInt(condition);
    if (condValue >= 9) return 'bg-green-100 text-green-800';
    if (condValue >= 7) return 'bg-green-100 text-green-800';
    if (condValue >= 5) return 'bg-yellow-100 text-yellow-800';
    if (condValue >= 3) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Link to={`/listings/${id}`} className="block transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        <div className="relative">
          <img
            src={imageUrls?.[0] || '/assets/images/placeholder.png'}
            alt={cleanTitle}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-medium text-gray-900 mb-2 truncate">{cleanTitle}</h3>

          <div className="flex flex-wrap gap-2 mb-3">
            <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
              <i className="fas fa-ruler-horizontal mr-1"></i> UK {size}
              {preferredFoot && (
                <span className="ml-1 font-bold text-xs">
                  {preferredFoot === 'left' ? '(L)' : preferredFoot === 'right' ? '(R)' : '(B)'}
                </span>
              )}
            </div>

            {condition && (
              <div className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getConditionColor(condition)}`}>
                {condition}/10 ({getConditionLabel(condition)})
              </div>
            )}

            {location && (
              <div className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                <i className="fas fa-map-marker-alt mr-1"></i> {location.substring(0, 3).toUpperCase()}
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 mr-2">
                {author?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
            </div>

            <div className="inline-flex items-center px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded font-medium">
              <i className="fas fa-eye mr-1"></i> View Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;