import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListingsContext } from '../contexts/ListingsContext';
import { AuthContext } from '../contexts/AuthContext';
import ListingCard from '../components/listings/ListingCard';
import UnifiedSearchBar from '../components/search/UnifiedSearchBar';
import FilterBar from '../components/filters/FilterBar';
import Pagination from '../components/pagination/Pagination';
import GradientText from '../components/common/GradientText';
import '../styles/street-style.css';

const HomePage = () => {
  const { listings, isLoading, error, searchParams } = useContext(ListingsContext);
  const { currentUser } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 每页显示8个商品，适合2x4网格
  const navigate = useNavigate();

  // 计算总页数
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  // 获取当前页的商品
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listings.slice(startIndex, endIndex);
  };

  // 处理页面变化
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 滚动到页面顶部，提供更好的用户体验
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 当listings或searchParams变化时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [listings.length, searchParams]);

  // Check if user is logged in
  const isLoggedIn = !!currentUser;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* Hero section */}
        <section className="mb-6">
          <div className="bg-black rounded-lg p-4 sm:p-6 md:p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#ff7940", "#ff40aa", "#40ffaa"]}
                animationSpeed={6}
                showBorder={false}
                className="text-4xl sm:text-5xl md:text-6xl font-heading tracking-wider mb-4 font-bold mx-auto"
              >
                FIND YOUR PERFECT SKATE SHOES
              </GradientText>
              <GradientText
                colors={["#ffffff", "#cccccc", "#ffffff"]}
                animationSpeed={8}
                showBorder={false}
                className="text-xl sm:text-2xl md:text-3xl font-medium tracking-wide mb-6 sm:mb-8 mx-auto"
              >
                Exchange, buy, or sell skateboard shoes with the community
              </GradientText>
            </div>
          </div>
        </section>

        {/* Search and filter section */}
        <section className="mb-6">
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <div className="w-full flex flex-col md:flex-row">
              <div className="flex-grow mr-0 md:mr-4 mb-3 md:mb-0">
                <UnifiedSearchBar />
              </div>
              <div className="flex-shrink-0 md:w-[150px]">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('reset-filters'))}
                  className="w-full h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded flex items-center justify-center transition-colors"
                >
                  <i className="fas fa-undo mr-2"></i>
                  Reset
                </button>
              </div>
            </div>
            <div className="mt-3">
              <FilterBar showResetButton={false} />
            </div>
          </div>
        </section>

        {/* Listings section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-heading tracking-wide">AVAILABLE SHOES</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              <i className="fas fa-exclamation-circle mr-2"></i>
              Error loading listings. Please try again later.
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <i className="fas fa-shoe-prints text-5xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No shoes found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {getCurrentPageItems().map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {/* 分页导航 */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>

        {/* Info section for non-logged in users */}
        {!isLoggedIn && (
          <section className="mb-12 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 order-2 md:order-1">
                <img
                  src="/assets/images/skate-shoes.jpg"
                  alt="Skateboard Shoes"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-6 md:w-1/2 order-1 md:order-2">
                <h2 className="text-xl sm:text-2xl font-heading tracking-wide mb-4">JOIN THE SKATESWAP COMMUNITY</h2>
                <p className="text-gray-600 mb-6">
                  SkateSwap is the premier marketplace for skateboarders to buy, sell, and trade shoes. Sign up now to list your shoes or connect with other skaters.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-orange-500">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <p className="ml-3 text-gray-600">
                      <span className="font-medium text-gray-900">Find your perfect fit</span> — browse shoes by size, brand, and condition
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-orange-500">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <p className="ml-3 text-gray-600">
                      <span className="font-medium text-gray-900">Connect with skaters</span> — message sellers directly through our platform
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-orange-500">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <p className="ml-3 text-gray-600">
                      <span className="font-medium text-gray-900">Sell with ease</span> — list your shoes for free in minutes
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link to="/register" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-medium transition-colors">
                    <i className="fas fa-user-plus mr-2"></i> Create an Account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;