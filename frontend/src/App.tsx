import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Matches from './pages/Matches';
import Messages from './pages/Messages';

function App() {
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {user && <Navbar />}
      
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Landing />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" /> : <Signup />} 
        />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feed" 
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/matches" 
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  );
}

export default App;
