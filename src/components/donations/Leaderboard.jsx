// src/components/donations/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('all'); // 'all', 'month', 'week'

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setIsLoading(true);

        // In a real implementation, we'd fetch data from an API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockDonors = [
          { id: 1, name: 'Skater A', amount: 500, date: '2023-12-01', avatar: null, message: 'Supporting the nonprofit platform, hope it helps more skaters!' },
          { id: 2, name: 'Anonymous User', amount: 200, date: '2023-12-03', avatar: null, message: '' },
          { id: 3, name: 'Tony Hawk', amount: 150, date: '2023-12-05', avatar: null, message: 'Great initiative!' },
          { id: 4, name: 'Xiaoming', amount: 100, date: '2023-12-08', avatar: null, message: 'Hope the platform keeps getting better!' },
          { id: 5, name: 'Anonymous User', amount: 88, date: '2023-12-10', avatar: null, message: 'Keep it up!' },
          { id: 6, name: 'Skate Shop Owner', amount: 66, date: '2023-12-12', avatar: null, message: 'Support!' },
          { id: 7, name: 'Community Member', amount: 50, date: '2023-12-15', avatar: null, message: 'Great idea!' },
          { id: 8, name: 'Anonymous User', amount: 30, date: '2023-12-18', avatar: null, message: '' },
          { id: 9, name: 'New Skater', amount: 20, date: '2023-12-20', avatar: null, message: 'Thanks for providing this platform' },
          { id: 10, name: 'Skateboard Coach', amount: 10, date: '2023-12-22', avatar: null, message: 'Great!' },
        ];

        setDonors(mockDonors);
        setError('');
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError('Unable to load donation leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonors();
  }, [timeframe]); // Re-fetch when timeframe changes

  // Filter donors based on timeframe
  const getFilteredDonors = () => {
    const now = new Date();
    let cutoffDate = new Date();

    if (timeframe === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else {
      // For 'all', no filtering needed
      return donors;
    }

    return donors.filter(donor => new Date(donor.date) >= cutoffDate);
  };

  const filteredDonors = getFilteredDonors();
  const totalAmount = filteredDonors.reduce((sum, donor) => sum + donor.amount, 0);

  // Format currency
  const formatCurrency = (amount) => {
    return `¥${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800 dark:text-white">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Donation Leaderboard</h1>

        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('all')}
            className={`px-4 py-2 rounded-md ${timeframe === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-md ${timeframe === 'month' ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-md ${timeframe === 'week' ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            This Week
          </button>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg mb-6 dark:bg-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">Total Donations</p>
            <p className="text-3xl font-bold text-orange-500">{formatCurrency(totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-300">Number of Donors</p>
            <p className="text-3xl font-bold text-orange-500">{filteredDonors.length}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
              I Want to Donate
            </Link>
          </div>
        </div>
      </div>

      {filteredDonors.length === 0 ? (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No Donation Records</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No donation records in this time period
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Donor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredDonors.map((donor, index) => (
                <tr key={donor.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-400 text-white' :
                            index === 1 ? 'bg-gray-300 text-gray-800' :
                              'bg-orange-600 text-white'
                          }`}>
                          {index + 1}
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 w-8 text-center font-medium">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 text-lg font-medium">
                          {donor.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {donor.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-orange-500">{formatCurrency(donor.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{donor.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {donor.message || 'No message'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;