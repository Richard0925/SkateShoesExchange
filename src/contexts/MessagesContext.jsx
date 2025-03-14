import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { fetchConversations, fetchMessages, sendNewMessage } from '../utils/api';

// 创建初始状态
const initialState = {
  conversations: [],
  loading: false,
  error: '',
};

// 创建Context
export const MessagesContext = createContext({
  ...initialState,
  loadConversations: async () => { },
  loadMessages: async () => { },
  sendMessage: async () => { },
  createConversation: async () => { },
});

// 使用命名导出函数组件
export function MessagesProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);

  // 加载当前用户的会话
  const loadConversations = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');

      const userConversations = await fetchConversations(currentUser.username);
      setConversations(userConversations);

    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // 加载特定会话的消息
  const loadMessages = useCallback(async (conversationId) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');

      const messages = await fetchMessages(conversationId);

      // 使用加载的消息更新会话状态
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, messages, unread: false }
            : conv
        )
      );

      return messages;
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // 发送消息
  const sendMessage = useCallback(async (conversationId, text) => {
    if (!currentUser || !text.trim()) return;

    try {
      setLoading(true);
      setError('');

      // 在真实应用中，这会调用API
      const newMessage = await sendNewMessage(conversationId, {
        text,
        senderId: currentUser.username,
      });

      // 使用新消息更新会话状态
      setConversations(prevConversations =>
        prevConversations.map(conv => {
          if (conv.id === conversationId) {
            const updatedMessages = [...(conv.messages || []), newMessage];
            return {
              ...conv,
              messages: updatedMessages,
              lastMessage: text,
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        })
      );

      return newMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // 创建新会话
  const createConversation = useCallback(async (recipientUsername) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');

      // 在真实应用中，这会调用API
      // 现在，我们只创建一个模拟会话
      const newConversation = {
        id: `conv_${Date.now()}`,
        recipient: {
          username: recipientUsername,
          isOnline: Math.random() > 0.5,
        },
        messages: [],
        unread: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setConversations(prevConversations => [newConversation, ...prevConversations]);

      return newConversation;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create conversation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // 当用户变化时初始化会话
  useEffect(() => {
    if (currentUser) {
      loadConversations();
    } else {
      setConversations([]);
    }
  }, [currentUser, loadConversations]);

  // Context值
  const value = {
    conversations,
    loading,
    error,
    loadConversations,
    loadMessages,
    sendMessage,
    createConversation,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}