import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { loginUser, registerUser, fetchUserProfile } from '../utils/api';

// 创建初始状态
const initialState = {
  currentUser: null,
  loading: true,
  error: '',
};

// 创建Context
export const AuthContext = createContext({
  ...initialState,
  login: async () => { },
  register: async () => { },
  logout: () => { },
  getUserProfile: async () => { },
  updateProfile: async () => { },
  refreshUserProfile: async () => { },
});

// 创建useAuth钩子函数
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 为与React Fast Refresh兼容，使用命名函数组件
// 注意：不要使用默认导出，而是使用命名导出
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 检查用户是否已从localStorage登录
  useEffect(() => {
    const storedUser = localStorage.getItem('skateswap_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user data', err);
        localStorage.removeItem('skateswap_user');
      }
    }
    setLoading(false);
  }, []);

  // 登录函数
  const login = useCallback(async (email, password) => {
    try {
      setError('');
      console.log('AuthContext: Attempting login with email:', email);

      // 获取基本认证数据
      const authData = await loginUser(email, password);
      console.log('AuthContext: Login successful, auth data:', authData);

      // 获取完整的用户资料
      console.log('AuthContext: Fetching complete user profile for:', authData.username);
      try {
        const userProfile = await fetchUserProfile(authData.username);
        console.log('AuthContext: User profile fetched:', userProfile);

        // 合并认证数据和用户资料
        const completeUserData = {
          ...authData,
          ...userProfile,
          // 确保token从authData保留
          token: authData.token
        };

        console.log('AuthContext: Setting complete user data:', completeUserData);
        setCurrentUser(completeUserData);
        localStorage.setItem('skateswap_user', JSON.stringify(completeUserData));
        return completeUserData;
      } catch (profileError) {
        console.error('AuthContext: Error fetching user profile:', profileError);
        // 即使获取资料失败，也返回基本认证数据
        setCurrentUser(authData);
        localStorage.setItem('skateswap_user', JSON.stringify(authData));
        return authData;
      }
    } catch (err) {
      console.error('AuthContext: Login failed:', err);
      setError(err.message || 'Login failed');
      throw err;
    }
  }, []);

  // 注册函数
  const register = useCallback(async (userData) => {
    try {
      setError('');
      const newUser = await registerUser(userData);
      setCurrentUser(newUser);
      localStorage.setItem('skateswap_user', JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  }, []);

  // 登出函数
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('skateswap_user');
  }, []);

  // 获取用户资料
  const getUserProfile = useCallback(async (username) => {
    try {
      setError('');
      return await fetchUserProfile(username);
    } catch (err) {
      setError(err.message || 'Failed to get user profile');
      throw err;
    }
  }, []);

  // 更新用户资料
  const updateProfile = useCallback(async (userData) => {
    try {
      setError('');
      // 在真实应用中，这会调用API
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('skateswap_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  }, [currentUser]);

  // 刷新当前用户资料
  const refreshUserProfile = useCallback(async () => {
    if (!currentUser) {
      console.log('AuthContext: Cannot refresh profile, no current user');
      return null;
    }

    try {
      console.log('AuthContext: Refreshing profile for user:', currentUser.username);
      const profile = await fetchUserProfile(currentUser.username);

      // 更新当前用户信息，同时保留token
      const updatedUser = {
        ...currentUser,
        ...profile
      };

      console.log('AuthContext: Profile refreshed, updated user:', updatedUser);
      setCurrentUser(updatedUser);
      localStorage.setItem('skateswap_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('AuthContext: Failed to refresh profile:', err);
      setError(err.message || 'Failed to refresh user profile');
      throw err;
    }
  }, [currentUser]);

  // Context值
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    getUserProfile,
    updateProfile,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}