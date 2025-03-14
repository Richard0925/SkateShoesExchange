import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { MessagesContext } from '../contexts/MessagesContext';
import MessageThread from '../components/messaging/MessageThread';

const MessagesPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { conversations, loadConversations, sendMessage } = useContext(MessagesContext);
  const [searchParams] = useSearchParams();
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchConversations = async () => {
      try {
        setLoading(true);
        await loadConversations();

        // Check if we should open a specific conversation from URL params
        const userParam = searchParams.get('user');
        if (userParam && conversations.length > 0) {
          const conversation = conversations.find(c => c.recipient.username === userParam);
          if (conversation) {
            setActiveConversationId(conversation.id);
          } else {
            // If conversation with this user doesn't exist yet, it would create one in a real implementation
            // For now we'll just open the first conversation
            setActiveConversationId(conversations[0].id);
          }
        } else if (conversations.length > 0) {
          // Default to first conversation
          setActiveConversationId(conversations[0].id);
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser, navigate, loadConversations, searchParams, conversations.length]);

  const handleSendMessage = async (conversationId, text) => {
    await sendMessage(conversationId, text);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  if (!currentUser) {
    return null; // Return null while redirecting
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-orange-500" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Messages</h1>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center dark:bg-gray-800">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Messages</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You don't have any messages yet. Messages will appear here when you start communicating with other users.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[70vh] dark:bg-gray-800">
          {/* Conversation list */}
          <div className="border-r dark:border-gray-700">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-medium dark:text-white">Message List</h2>
            </div>
            <div className="overflow-y-auto h-[calc(70vh-57px)]">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveConversationId(conversation.id)}
                  className={`w-full flex items-center p-4 border-b hover:bg-gray-50 text-left dark:border-gray-700 dark:hover:bg-gray-700 ${conversation.id === activeConversationId ? 'bg-orange-50 dark:bg-gray-700' : ''
                    }`}
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                    {conversation.recipient.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className={`font-medium ${conversation.unread ? 'text-orange-500' : 'dark:text-white'}`}>
                      {conversation.recipient.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {conversation.lastMessage || 'Start conversation...'}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Message thread */}
          <div className="col-span-2 lg:col-span-3 flex flex-col">
            {activeConversation ? (
              <MessageThread
                conversation={activeConversation}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;