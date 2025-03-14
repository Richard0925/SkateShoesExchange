// src/components/messaging/MessageThread.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MessageForm from './MessageForm';

const MessageThread = ({ conversation, onSendMessage }) => {
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { id, recipient, messages } = conversation;

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      await onSendMessage(id, text);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};

    messages.forEach(message => {
      const date = formatMessageDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center dark:bg-gray-800 dark:border-gray-700">
        <Link to={`/profile/${recipient.username}`} className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 dark:bg-gray-600 dark:text-gray-300">
            {recipient.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="font-medium dark:text-white">{recipient.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {recipient.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {Object.keys(messageGroups).map(date => (
          <div key={date} className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {date}
              </div>
            </div>

            {messageGroups[date].map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${message.isSender ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isSender && (
                  <div className="mr-2 flex-shrink-0">
                    <Link to={`/profile/${recipient.username}`}>
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                        {recipient.username.charAt(0).toUpperCase()}
                      </div>
                    </Link>
                  </div>
                )}

                <div className={`max-w-[70%]`}>
                  <div
                    className={`p-3 rounded-lg ${message.isSender
                        ? 'bg-orange-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none dark:bg-gray-800 dark:text-white'
                      }`}
                  >
                    <p>{message.text}</p>
                  </div>
                  <p className={`text-xs mt-1 ${message.isSender ? 'text-right' : ''} text-gray-500`}>
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>

                {message.isSender && (
                  <div className="ml-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white">
                      ME
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Message form */}
      <div className="bg-white border-t p-4 dark:bg-gray-800 dark:border-gray-700">
        <MessageForm onSendMessage={handleSendMessage} isLoading={loading} />
      </div>
    </div>
  );
};

export default MessageThread;