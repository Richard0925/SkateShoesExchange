import React, { createContext, useState, useCallback, useEffect } from 'react';
import { fetchListings, fetchListing, fetchUserListings, createListing, updateListing as updateListingApi } from '../utils/api';
import { getDefaultListings, getFeaturedListings, getMatchedListings } from '../utils/mockData';

// 创建初始状态
const initialState = {
  listings: [],
  featuredListings: [],
  matchedListings: [],
  isLoading: false,
  error: '',
  searchParams: {},
};

// 创建Context
export const ListingsContext = createContext({
  ...initialState,
  setSearchParams: () => { },
  getListing: async () => { },
  getUserListings: async () => { },
  addListing: async () => { },
  updateListing: async () => { },
  addComment: async () => { },
  loadListings: async () => { },
});

// 使用命名导出的函数组件
export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [matchedListings, setMatchedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({});

  // 根据搜索参数加载列表
  const loadListings = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError('');

      console.log('Loading listings with params:', params);

      // 打印参数键值，方便调试
      if (Object.keys(params).length > 0) {
        console.group('Search parameters:');
        Object.entries(params).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
        console.groupEnd();
      } else {
        console.log('No search parameters provided, loading all listings');
      }

      // 在真实应用中，这会调用API并传入搜索参数
      // 现在，我们使用模拟数据
      const response = await fetchListings(params);
      console.log(`Loaded ${response.length} listings`);
      setListings(response);

      // 加载特色和匹配的列表
      const featured = await getFeaturedListings();
      setFeaturedListings(featured);

      const matched = await getMatchedListings();
      setMatchedListings(matched);

    } catch (err) {
      console.error('Error loading listings:', err);
      setError('Failed to load shoe listings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 设置搜索参数并重新加载列表
  const handleSetSearchParams = useCallback((params) => {
    console.log('Setting search params:', params);

    // 使用新的对象创建搜索参数，而不是合并
    // 这样可以确保当 params 为空时，所有先前的过滤器都被清除
    setSearchParams(params);

    // 确保即使 params 是空对象也能加载数据
    loadListings(params).catch(err => {
      console.error('Failed to load listings after setting search params:', err);
      setError('加载鞋子列表失败，请重试');
    });
  }, [loadListings]);

  // 通过ID获取单个列表
  const getListing = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError('');
      return await fetchListing(id);
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError('Failed to get shoe details');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 通过用户名获取列表
  const getUserListings = useCallback(async (username) => {
    try {
      setIsLoading(true);
      setError('');
      return await fetchUserListings(username);
    } catch (err) {
      console.error('Error fetching user listings:', err);
      setError('Failed to get user shoe listings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 添加新列表
  const addListing = useCallback(async (listingData) => {
    try {
      setError('');
      const newListing = await createListing(listingData);

      // 用新列表更新列表状态
      setListings(prevListings => [newListing, ...prevListings]);

      return newListing.id;
    } catch (err) {
      console.error('Error adding listing:', err);
      setError('Failed to post shoe listing');
      throw err;
    }
  }, []);

  // 更新现有列表
  const updateListing = useCallback(async (id, listingData) => {
    try {
      setError('');
      const updatedListing = await updateListingApi(id, listingData);

      // 更新列表状态
      setListings(prevListings =>
        prevListings.map(listing =>
          listing.id === id ? updatedListing : listing
        )
      );

      return updatedListing;
    } catch (err) {
      console.error('Error updating listing:', err);
      setError('Failed to update shoe listing');
      throw err;
    }
  }, []);

  // 为列表添加评论
  const addComment = useCallback(async (listingId, comment) => {
    try {
      setError('');
      // 在真实应用中，这会调用API
      const newComment = {
        id: Date.now().toString(),
        text: comment,
        author: {
          username: 'currentUser', // 会使用实际的当前用户
        },
        createdAt: new Date().toISOString(),
      };

      setListings(prevListings =>
        prevListings.map(listing => {
          if (listing.id === listingId) {
            return {
              ...listing,
              comments: [...(listing.comments || []), newComment],
            };
          }
          return listing;
        })
      );

      return newComment;
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
      throw err;
    }
  }, []);

  // 在组件挂载时初始化列表
  useEffect(() => {
    loadListings(searchParams);
  }, [loadListings, searchParams]);

  // Context值
  const value = {
    listings,
    featuredListings,
    matchedListings,
    isLoading,
    error,
    searchParams,
    setSearchParams: handleSetSearchParams,
    getListing,
    getUserListings,
    addListing,
    updateListing,
    addComment,
    loadListings,
  };

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
}