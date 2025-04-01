
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile } from '@/types/finance';
import Dashboard from '@/pages/Dashboard';
import OnboardingPage from '@/pages/OnboardingPage';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';
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
          to onboarding if logged in but profile incomplete, 
          otherwise to login */}
      <Route 
        path="/" 
        element={
          userProfile 
            ? (isProfileComplete 
                ? <Navigate to="/dashboard" /> 
                : <Navigate to="/onboarding" />)
            : <Navigate to="/login" />
        } 
      />
      
      {/* Auth pages - accessible even when logged in */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Onboarding page - can be used for both initial setup and profile editing */}
      <Route 
        path="/onboarding" 
        element={
          <OnboardingPage 
            onProfileComplete={onProfileComplete}
            userProfile={userProfile || undefined}
          />
        } 
      />
      
      {/* Dashboard - protected route, redirect to onboarding if not onboarded */}
      <Route 
        path="/dashboard" 
        element={
          userProfile 
            ? (isProfileComplete 
                ? <Dashboard userProfile={userProfile} /> 
                : <Navigate to="/onboarding" />)
            : <Navigate to="/login" />
        } 
      />
      
      {/* Profile page - protected route, redirect to onboarding if not onboarded */}
      <Route 
        path="/profile" 
        element={
          userProfile 
            ? (isProfileComplete 
                ? <ProfilePage 
                    userProfile={userProfile} 
                    onProfileUpdate={onProfileUpdate}
                  /> 
                : <Navigate to="/onboarding" />)
            : <Navigate to="/login" />
        } 
      />
      
      {/* Catch-all for non-matching routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
