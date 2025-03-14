// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import StopPropagation from './components/layout/StopPropagation';

// Context providers
import { AuthProvider } from './contexts/AuthContext';
import { ListingsProvider } from './contexts/ListingsContext';
import { MessagesProvider } from './contexts/MessagesContext';

// Pages
import HomePage from './pages/HomePage';
import ListingDetailPage from './pages/ListingDetailPage';
import ProfilePage from './pages/ProfilePage';
import CreateListingPage from './pages/CreateListingPage';
import MessagesPage from './pages/MessagesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import EmailVerificationPage from './pages/EmailVerificationPage';

// Test component
import ApiTest from './components/ApiTest';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ListingsProvider>
          <MessagesProvider>
            <StopPropagation />
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/listings/:id" element={<ListingDetailPage />} />
                  <Route path="/profile/:username" element={<ProfilePage />} />
                  <Route path="/create-listing" element={<CreateListingPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/api-test" element={<ApiTest />} />
                  <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </MessagesProvider>
        </ListingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;