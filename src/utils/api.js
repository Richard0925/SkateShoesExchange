// src/utils/api.js
// API 调用函数

import {
  getDefaultListings,
  getUserListings as mockUserListings,
  getListingDetails,
  getConversations as mockConversations,
  getMessages as mockMessages
} from './mockData';

// API 基础URL - 从环境变量中获取或使用默认值
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 调试模式设置
const DEBUG_MODE = true;

// 获取存储在localStorage中的token
const getAuthToken = () => localStorage.getItem('authToken');

// 调试日志函数
const logDebug = (message, data) => {
  if (DEBUG_MODE) {
    console.group(`🔍 API Debug: ${message}`);
    if (data) console.log(data);
    console.groupEnd();
  }
};

// 通用API调用函数
const apiCall = async (endpoint, method = 'GET', data = null, params = null) => {
  let url = `${API_BASE_URL}${endpoint}`;

  // 如果有查询参数，添加到URL
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  logDebug(`Making ${method} request to ${url}`, data);
  console.log(`API call: ${method} ${url}`);

  const headers = {
    'Content-Type': 'application/json',
  };

  // 如果有认证令牌，添加到请求头
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('API call: Using authorization token');
  } else {
    console.log('API call: No authorization token available');
  }

  const config = {
    method,
    headers,
    credentials: 'include', // 包含cookies
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    logDebug('Request config', config);

    // 使用try-catch包裹fetch，捕获网络错误
    try {
      console.log('API call: Sending request...');
      const response = await fetch(url, config);
      console.log(`API call: Received response with status: ${response.status}`);

      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('API call: Parsed JSON response:', responseData);
      } else {
        const text = await response.text();
        console.log('API call: Received text response:', text);
        try {
          // 尝试解析为JSON，即使Content-Type不是JSON
          responseData = JSON.parse(text);
          console.log('API call: Successfully parsed text as JSON:', responseData);
        } catch (e) {
          console.log('API call: Could not parse text as JSON, using as message');
          responseData = { message: text };
        }
      }

      // 如果响应不成功，抛出错误
      if (!response.ok) {
        console.error('API call: Response not OK, error:', responseData.error || responseData.message || 'Unknown error');
        throw new Error(responseData.error || responseData.message || '操作失败');
      }

      return responseData;
    } catch (networkError) {
      // 捕获网络错误，如连接拒绝等
      console.error('API call: Network error:', networkError);

      if (networkError.name === 'TypeError' && networkError.message.includes('NetworkError')) {
        throw new Error('网络错误，无法连接到服务器');
      }

      throw networkError; // 其他错误继续抛出
    }
  } catch (error) {
    console.error('API call: Error caught in outer try-catch:', error);

    // 检查是否是后端服务未启动的错误
    if (error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('网络错误')) {
      console.warn('API call: API service unavailable, falling back to mock data');
      return null; // 返回null表示需要回退到模拟数据
    }

    throw error;
  }
};

// Auth API
export const loginUser = async (email, password) => {
  try {
    logDebug('Attempting to login with email', email);
    // 尝试使用真实API
    const response = await apiCall('/auth/login', 'POST', { email, password });

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      logDebug('Using mock data for login');
      // 模拟登录逻辑（仅用于演示）
      const mockUser = {
        id: 'mock-user-123',
        username: email.split('@')[0],
        email,
        token: 'mock-token-' + Math.random().toString(36).substring(2)
      };

      // 保存模拟token
      localStorage.setItem('authToken', mockUser.token);
      return mockUser;
    }

    logDebug('Login successful', response);

    // 保存token到localStorage
    localStorage.setItem('authToken', response.token);

    return response.user;
  } catch (error) {
    logDebug('Login failed', error);
    throw error; // 直接传递原始错误
  }
};

export const registerUser = async (userData) => {
  try {
    logDebug('Attempting to register', userData);
    // 尝试使用真实API
    const response = await apiCall('/auth/register', 'POST', userData);

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      logDebug('Using mock data for registration');
      // 模拟注册逻辑（仅用于演示）
      const mockUser = {
        id: 'mock-user-' + Math.random().toString(36).substring(2),
        username: userData.username,
        email: userData.email,
        success: true,
        message: 'Mock registration successful!'
      };

      return mockUser;
    }

    logDebug('Registration successful', response);
    return response;
  } catch (error) {
    logDebug('Registration failed', error);
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    console.log('Requesting password reset for:', email);
    // 尝试使用真实API
    const response = await apiCall('/auth/forgot-password', 'POST', { email });

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for password reset');
      return { success: true, message: '密码重置链接已发送到您的邮箱（模拟）' };
    }

    console.log('Password reset request successful:', response);
    return response;
  } catch (error) {
    console.error('密码重置请求失败:', error);
    throw new Error(error.message || '密码重置请求失败');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    console.log('Resetting password with token');
    // 尝试使用真实API
    const response = await apiCall('/auth/reset-password', 'POST', { token, newPassword });

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for password reset');
      return { success: true, message: '密码已成功重置（模拟）' };
    }

    console.log('Password reset successful:', response);
    return response;
  } catch (error) {
    console.error('密码重置失败:', error);
    throw new Error(error.message || '密码重置失败');
  }
};

export const verifyEmail = async (token) => {
  try {
    console.log('Verifying email with token');
    // 尝试使用真实API
    const response = await apiCall('/auth/verify-email', 'POST', { token });

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for email verification');
      return { success: true, message: '邮箱验证成功（模拟）' };
    }

    console.log('Email verification successful:', response);
    return response;
  } catch (error) {
    console.error('邮箱验证失败:', error);
    throw new Error(error.message || '邮箱验证失败');
  }
};

export const fetchUserProfile = async (username) => {
  try {
    console.log('API: Fetching user profile for:', username);
    // 使用正确的 API 路径
    const response = await apiCall(`/users/profile/${username}`, 'GET');
    console.log('API: Raw response from user profile fetch:', response);

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('API: Using mock data for user profile');
      return {
        id: 'mock-user-' + Math.random().toString(36).substring(2),
        username,
        email: `${username}@example.com`,
        isActive: true,
        preferredFoot: 'regular',
        shoeSize: '42',
        location: 'Sample City',
        createdAt: new Date().toISOString(),
        listingsCount: 0,
        transactionsCount: 0,
        rating: 0
      };
    }

    if (!response.success || !response.user) {
      console.error('API: Response did not contain success=true or user data:', response);
      throw new Error(response.error || 'Invalid response format');
    }

    console.log('API: User profile fetched successfully:', response.user);
    return response.user;
  } catch (error) {
    console.error('API: Failed to fetch user profile:', error);
    throw new Error(error.message || 'Failed to fetch user profile');
  }
};

// Listings API
export const fetchListings = async (params = {}) => {
  try {
    console.log('API: Fetching listings with params:', params);

    // 尝试使用真实API
    const response = await apiCall('/listings', 'GET', null, params);

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('API service unavailable, falling back to mock data');
      // 使用模拟数据
      let listings = getDefaultListings();

      // 确保 params 是有效的对象，避免传入 null 等情况
      if (!params || typeof params !== 'object') {
        console.warn('Invalid params provided to fetchListings, using empty object instead');
        params = {};
      }

      // Filter by search params
      if (params.query && params.query.trim()) {
        const query = params.query.toLowerCase().trim();
        listings = listings.filter(listing =>
          (listing.brand?.toLowerCase() || '').includes(query) ||
          (listing.model?.toLowerCase() || '').includes(query) ||
          (listing.size?.toString() || '') === query
        );
      }

      if (params.brand && params.brand.trim()) {
        listings = listings.filter(listing => listing.brand === params.brand);
      }

      if (params.size && params.size.toString().trim()) {
        listings = listings.filter(listing =>
          listing.size?.toString() === params.size.toString()
        );
      }

      if (params.preferredFoot && params.preferredFoot.trim()) {
        listings = listings.filter(listing => listing.preferredFoot === params.preferredFoot);
      }

      if (params.condition && params.condition.toString().trim()) {
        listings = listings.filter(listing =>
          listing.condition && parseInt(listing.condition) <= parseInt(params.condition)
        );
      }

      if (params.location && params.location.trim()) {
        listings = listings.filter(listing => listing.location === params.location);
      }

      // Sort
      if (params.sortBy && params.sortBy.trim()) {
        switch (params.sortBy) {
          case 'newest':
            listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            listings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'a-z':
            listings.sort((a, b) => (a.brand + a.model).localeCompare(b.brand + b.model));
            break;
          case 'z-a':
            listings.sort((a, b) => (b.brand + b.model).localeCompare(a.brand + a.model));
            break;
          case 'condition-high':
            listings.sort((a, b) => b.condition - a.condition);
            break;
          case 'condition-low':
            listings.sort((a, b) => a.condition - b.condition);
            break;
          default:
            // 默认按最新排序
            listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        }
      } else {
        // 默认按最新排序
        listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      console.log(`API: Returning ${listings.length} listings after filtering (mock data)`);
      return listings;
    }

    console.log(`API: Received ${response.listings.length} listings from API`);
    return response.listings;
  } catch (error) {
    console.error('Error fetching listings:', error);
    // 返回空数组而不是抛出错误，这样UI可以显示空状态而不是错误
    return [];
  }
};

export const fetchListing = async (id) => {
  try {
    console.log('Fetching listing with ID:', id);
    // 尝试使用真实API
    const response = await apiCall(`/listings/${id}`, 'GET');

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for listing details');
      return getListingDetails(id);
    }

    console.log('Listing fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('获取鞋子详情失败:', error);
    throw new Error(error.message || '获取鞋子详情失败');
  }
};

export const fetchUserListings = async (username) => {
  try {
    console.log('Fetching listings for user:', username);
    // 尝试使用真实API
    const response = await apiCall(`/listings/user/${username}`, 'GET');

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for user listings');
      return mockUserListings(username);
    }

    console.log('User listings fetched successfully:', response);
    return response.listings;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw new Error(error.message || '获取用户列表失败');
  }
};

export const createListing = async (listingData) => {
  try {
    console.log('Creating new listing with data:', listingData);
    // 尝试使用真实API
    const response = await apiCall('/listings', 'POST', listingData);

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for creating listing');
      // 创建一个带有ID的模拟列表项
      const mockListing = {
        id: 'mock-listing-' + Math.random().toString(36).substring(2),
        ...listingData,
        createdAt: new Date().toISOString(),
        author: {
          username: 'current-user',
          rating: 4.5
        }
      };

      return mockListing;
    }

    console.log('Listing created successfully:', response);
    return response;
  } catch (error) {
    console.error('创建鞋子列表失败:', error);
    throw new Error(error.message || '创建鞋子列表失败');
  }
};

export const updateListing = async (id, listingData) => {
  try {
    console.log('Updating listing with ID:', id, 'and data:', listingData);
    // 尝试使用真实API
    const response = await apiCall(`/listings/${id}`, 'PUT', listingData);

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for updating listing');
      // 更新一个模拟列表项
      const listing = getListingDetails(id);
      if (!listing) {
        throw new Error('列表项不存在');
      }

      const updatedListing = {
        ...listing,
        ...listingData,
        updatedAt: new Date().toISOString()
      };

      return updatedListing;
    }

    console.log('Listing updated successfully:', response);
    return response;
  } catch (error) {
    console.error('更新鞋子列表失败:', error);
    throw new Error(error.message || '更新鞋子列表失败');
  }
};

export const deleteListing = async (id) => {
  try {
    console.log('Deleting listing with ID:', id);
    // 尝试使用真实API
    const response = await apiCall(`/listings/${id}`, 'DELETE');

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for deleting listing');
      return { success: true, message: '列表项已成功删除（模拟）' };
    }

    console.log('Listing deleted successfully:', response);
    return response;
  } catch (error) {
    console.error('删除鞋子列表失败:', error);
    throw new Error(error.message || '删除鞋子列表失败');
  }
};

// Messages API
export const getConversations = async () => {
  try {
    console.log('Fetching conversations');
    // 尝试使用真实API
    const response = await apiCall('/messages/conversations', 'GET');

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for conversations');
      return mockConversations();
    }

    console.log('Conversations fetched successfully:', response);
    return response.conversations;
  } catch (error) {
    console.error('获取对话列表失败:', error);
    throw new Error(error.message || '获取对话列表失败');
  }
};

export const getMessages = async (conversationId) => {
  try {
    console.log('Fetching messages for conversation:', conversationId);
    // 尝试使用真实API
    const response = await apiCall(`/messages/conversations/${conversationId}`, 'GET');

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for messages');
      return mockMessages(conversationId);
    }

    console.log('Messages fetched successfully:', response);
    return response.messages;
  } catch (error) {
    console.error('获取消息失败:', error);
    throw new Error(error.message || '获取消息失败');
  }
};

export const sendMessage = async (conversationId, message) => {
  try {
    console.log('Sending message to conversation:', conversationId);
    // 尝试使用真实API
    const response = await apiCall(`/messages/conversations/${conversationId}`, 'POST', { message });

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for sending message');
      // 创建一个模拟消息
      const mockMessage = {
        id: 'mock-message-' + Math.random().toString(36).substring(2),
        conversationId,
        text: message,
        sender: 'current-user',
        createdAt: new Date().toISOString()
      };

      return mockMessage;
    }

    console.log('Message sent successfully:', response);
    return response.message;
  } catch (error) {
    console.error('发送消息失败:', error);
    throw new Error(error.message || '发送消息失败');
  }
};

export const startConversation = async (username, initialMessage) => {
  try {
    console.log('Starting conversation with user:', username);
    // 尝试使用真实API
    const response = await apiCall('/messages/conversations', 'POST', { username, message: initialMessage });

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for starting conversation');
      // 创建一个模拟对话
      const mockConversation = {
        id: 'mock-conversation-' + Math.random().toString(36).substring(2),
        otherUser: {
          username,
          displayName: username,
          avatar: null
        },
        lastMessage: {
          text: initialMessage,
          createdAt: new Date().toISOString(),
          sender: 'current-user'
        },
        unreadCount: 0,
        createdAt: new Date().toISOString()
      };

      return mockConversation;
    }

    console.log('Conversation started successfully:', response);
    return response.conversation;
  } catch (error) {
    console.error('开始对话失败:', error);
    throw new Error(error.message || '开始对话失败');
  }
};

// 消息API
export const fetchConversations = async (username) => {
  try {
    console.log('Fetching conversations for user:', username);
    // 尝试使用真实API
    const response = await apiCall(`/messages/conversations`, 'GET');

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for conversations');
      return mockConversations(username);
    }

    console.log('Conversations fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('获取会话列表失败:', error);
    // 回退到模拟数据
    return mockConversations(username);
  }
};

export const fetchMessages = async (conversationId) => {
  try {
    console.log('Fetching messages for conversation:', conversationId);
    // 尝试使用真实API
    const response = await apiCall(`/messages/${conversationId}`, 'GET');

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for messages');
      return mockMessages(conversationId);
    }

    console.log('Messages fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('获取消息失败:', error);
    // 回退到模拟数据
    return mockMessages(conversationId);
  }
};

export const sendNewMessage = async (conversationId, messageData) => {
  try {
    console.log('Sending message to conversation:', conversationId, messageData);
    // 尝试使用真实API
    const response = await apiCall(`/messages/${conversationId}`, 'POST', messageData);

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for sending message');
      // 创建一个模拟的消息响应
      return {
        id: `msg_${Date.now()}`,
        text: messageData.text,
        senderId: messageData.senderId,
        createdAt: new Date().toISOString(),
      };
    }

    console.log('Message sent successfully:', response);
    return response;
  } catch (error) {
    console.error('发送消息失败:', error);
    throw new Error(error.message || '发送消息失败');
  }
};

export const getListingsByUser = async (username) => {
  try {
    console.log('Fetching listings for user:', username);
    // 使用正确的 API 路径
    const response = await apiCall(`/listings/user/${username}`, 'GET');

    // 如果API调用失败，回退到模拟数据
    if (response === null) {
      console.log('Using mock data for user listings');
      return getMockListingsByUser(username);
    }

    console.log('User listings fetched successfully:', response);
    return response.listings || [];
  } catch (error) {
    console.error('Failed to fetch user listings:', error);
    throw new Error(error.message || 'Failed to fetch user listings');
  }
};

// 模拟数据函数
const getMockListingsByUser = (username) => {
  // 为测试生成一些模拟数据
  return [
    {
      id: 'mock-listing-1',
      title: 'Nike SB Dunk Low',
      brand: 'Nike',
      condition: 'Used - Excellent',
      size: '42',
      price: '120.00',
      image_url: 'https://via.placeholder.com/300?text=Nike+SB+Dunk'
    },
    {
      id: 'mock-listing-2',
      title: 'Adidas Superstar',
      brand: 'Adidas',
      condition: 'Used - Good',
      size: '43',
      price: '80.00',
      image_url: 'https://via.placeholder.com/300?text=Adidas+Superstar'
    }
  ];
};