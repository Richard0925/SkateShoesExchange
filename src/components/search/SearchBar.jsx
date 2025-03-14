// src/components/search/SearchBar.jsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingsContext } from '../../contexts/ListingsContext';
import '../../../src/styles/street-style.css';

const SearchBar = ({ onFilterClick }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { searchParams, setSearchParams } = useContext(ListingsContext);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Initialize query from searchParams if exists
    if (searchParams.query) {
      setQuery(searchParams.query);
    }
  }, [searchParams.query]);

  useEffect(() => {
    // Close suggestions on click outside
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
        inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.trim()) {
      // Set the search query and navigate to home page (with search results)
      setSearchParams({ ...searchParams, query: query.trim() });
      navigate('/');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Generate suggestions
    if (value.length > 1) {
      // This is a simple suggestion logic, in a real app you might fetch from API
      const keywords = ['Nike SB', 'Adidas', 'Vans', 'UK 8', 'UK 9', 'London', 'Beijing'];
      const filtered = keywords.filter(kw =>
        kw.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSearchParams({ ...searchParams, query: suggestion });
    navigate('/');
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search brands, models, sizes..."
            className="w-full px-4 py-2 pr-10 rounded-l bg-gray-100 border-0 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            aria-label="Search"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:text-orange-500 transition-colors"
            aria-label="Search"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

        <button
          type="button"
          className="flex items-center px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-r transition-colors"
          onClick={onFilterClick}
          aria-label="Toggle filters"
        >
          <i className="fas fa-sliders-h mr-2"></i>
          <span className="hidden sm:inline">Filter</span>
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg overflow-hidden"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <i className="fas fa-search text-gray-400 mr-2"></i>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;