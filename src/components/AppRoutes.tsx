
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile } from '@/types/finance';
import Dashboard from '@/pages/Dashboard';
import FullProfilePage from '@/pages/FullProfilePage';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';
import GoalsPage from '@/pages/GoalsPage';
import NotFound from '@/pages/NotFound';

interface AppRoutesProps {
  userProfile: UserProfile | null;
  isProfileComplete: boolean;
  onProfileComplete: (profile: UserProfile) => void;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  userProfile,
  isProfileComplete,
  onProfileComplete,
  onProfileUpdate
}) => {
  return (
    <Routes>
      {/* Redirect root to dashboard if logged in and profile is complete, 
          to full profile if logged in but profile incomplete, 
          otherwise to login */}
      <Route 
        path="/" 
        element={
          userProfile 
            ? (isProfileComplete 
                ? <Navigate to="/dashboard" /> 
                : <Navigate to="/full-profile" />)
            : <Navigate to="/login" />
        } 
      />
      
      {/* Auth pages - accessible even when logged in */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Full Profile page - can be used for both initial setup and profile editing */}
      <Route 
        path="/full-profile" 
        element={
          <FullProfilePage 
            onProfileComplete={onProfileComplete}
            userProfile={userProfile || undefined}
          />
        } 
      />
      
      {/* Dashboard - protected route, redirect to full-profile if not onboarded */}
      <Route 
        path="/dashboard" 
        element={
          userProfile 
            ? (isProfileComplete 
                ? <Dashboard userProfile={userProfile} /> 
                : <Navigate to="/full-profile" />)
            : <Navigate to="/login" />
        } 
      />
      
      {/* Profile page - protected route, redirect to full-profile if not onboarded */}
      <Route 
        path="/profile" 
        element={
          userProfile 
            ? (isProfileComplete 
                ? <ProfilePage 
                    userProfile={userProfile} 
                    onProfileUpdate={onProfileUpdate}
                  /> 
                : <Navigate to="/full-profile" />)
            : <Navigate to="/login" />
        } 
      />
      
      {/* Financial Goals page - protected route */}
      <Route 
        path="/goals" 
        element={
          userProfile 
            ? (isProfileComplete 
                ? <GoalsPage 
                    userProfile={userProfile} 
                    onProfileUpdate={onProfileUpdate}
                  /> 
                : <Navigate to="/full-profile" />)
            : <Navigate to="/login" />
        } 
      />
      
      {/* Catch-all for non-matching routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
