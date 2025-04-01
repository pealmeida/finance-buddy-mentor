
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserProfile } from "./types/finance";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Check if user profile exists in localStorage on app init
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Error parsing stored profile", e);
      }
    }
  }, []);

  const handleProfileComplete = (profile: UserProfile) => {
    // Save profile in state and localStorage
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    // Update profile in state and localStorage
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to dashboard if logged in, otherwise to login */}
            <Route 
              path="/" 
              element={userProfile ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
            
            {/* Auth pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Onboarding page - redirect to dashboard if already onboarded */}
            <Route 
              path="/onboarding" 
              element={
                userProfile ? 
                  <Navigate to="/dashboard" /> : 
                  <OnboardingPage onProfileComplete={handleProfileComplete} />
              } 
            />
            
            {/* Dashboard - protected route, redirect to onboarding if not onboarded */}
            <Route 
              path="/dashboard" 
              element={
                userProfile ? 
                  <Dashboard userProfile={userProfile} /> : 
                  <Navigate to="/onboarding" />
              } 
            />
            
            {/* Profile page - protected route, redirect to onboarding if not onboarded */}
            <Route 
              path="/profile" 
              element={
                userProfile ? 
                  <ProfilePage 
                    userProfile={userProfile} 
                    onProfileUpdate={handleProfileUpdate}
                  /> : 
                  <Navigate to="/onboarding" />
              } 
            />
            
            {/* Catch-all for non-matching routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
