// src/components/search/FilterBar.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { ListingsContext } from '../../contexts/ListingsContext';
import '../../../src/styles/street-style.css';

const FilterBar = ({ isOpen, onClose }) => {
  const { searchParams, setSearchParams } = useContext(ListingsContext);
  const filterPanelRef = useRef(null);

  // Filter states with default values from searchParams
  const [brand, setBrand] = useState(searchParams.brand || '');
  const [size, setSize] = useState(searchParams.size || '');
  const [location, setLocation] = useState(searchParams.location || '');
  const [sortBy, setSortBy] = useState(searchParams.sortBy || 'newest');
  const [condition, setCondition] = useState(searchParams.condition || '');

  // Popular brands for select options
  const popularBrands = [
    'Nike SB', 'Adidas', 'Vans', 'Converse', 'New Balance',
    'DC Shoes', 'És', 'Emerica', 'Lakai', 'Etnies'
  ];

  // Popular locations
  const popularLocations = [
    'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu',
    'Wuhan', 'Hangzhou', 'Nanjing', 'Xi\'an', 'Chongqing',
    'London', 'Liverpool', 'Glasgow', 'Birmingham'
  ];

  // UK sizes
  const ukSizes = [5, 6, 7, 8, 9, 10, 11, 12];

  // Condition options
  const conditionOptions = [
    { value: 'new', label: 'New (10/10)' },
    { value: 'like-new', label: 'Like New (8-9/10)' },
    { value: 'good', label: 'Good (6-7/10)' },
    { value: 'fair', label: 'Fair (4-5/10)' },
    { value: 'worn', label: 'Worn (1-3/10)' },
  ];

  // Apply filters on mount and when filter values change
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Click outside handler to close the filter panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Apply filters function
  const applyFilters = () => {
    const filters = {
      ...searchParams,
      brand: brand || undefined,
      size: size || undefined,
      location: location || undefined,
      sortBy: sortBy || undefined,
      condition: condition || undefined
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    setSearchParams(filters);
    onClose();
  };

  // Reset all filters
  const handleReset = () => {
    setBrand('');
    setSize('');
    setLocation('');
    setSortBy('newest');
    setCondition('');
  };

  return (
    <div
      ref={filterPanelRef}
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-heading tracking-wide">FILTERS</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Filter content - scrollable */}
        <div className="flex-grow overflow-y-auto p-4">
          {/* Brand filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="brand-filter">
              Brand
            </label>
            <select
              id="brand-filter"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Brands</option>
              {popularBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Size filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size (UK)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ukSizes.map(sizeOption => (
                <button
                  key={sizeOption}
                  className={`px-3 py-2 text-center rounded-md transition-colors ${parseInt(size) === sizeOption
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  onClick={() => setSize(size === sizeOption.toString() ? '' : sizeOption.toString())}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>

          {/* Condition filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <div className="space-y-2">
              {conditionOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    className="form-radio h-4 w-4 text-black focus:ring-black"
                    value={option.value}
                    checked={condition === option.value}
                    onChange={() => setCondition(option.value)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="location-filter">
              Location
            </label>
            <select
              id="location-filter"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Any Location</option>
              {popularLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Sort by filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  className="form-radio h-4 w-4 text-black focus:ring-black"
                  checked={sortBy === 'newest'}
                  onChange={() => setSortBy('newest')}
                />
                <span className="ml-2 text-sm text-gray-700">Newest First</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  className="form-radio h-4 w-4 text-black focus:ring-black"
                  checked={sortBy === 'condition-high'}
                  onChange={() => setSortBy('condition-high')}
                />
                <span className="ml-2 text-sm text-gray-700">Best Condition</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  className="form-radio h-4 w-4 text-black focus:ring-black"
                  checked={sortBy === 'condition-low'}
                  onChange={() => setSortBy('condition-low')}
                />
                <span className="ml-2 text-sm text-gray-700">Lowest Condition</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
            >
              <i className="fas fa-undo mr-2"></i> Reset
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;