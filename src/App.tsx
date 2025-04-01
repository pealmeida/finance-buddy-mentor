
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
import { toast } from "@/components/ui/use-toast";
import { supabase } from "./integrations/supabase/client";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user profile exists in localStorage on app init
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Error parsing stored profile", e);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your saved profile. Please log in again.",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
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
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-finance-blue border-r-finance-blue border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

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
            
            {/* Onboarding page - can be used for both initial setup and profile editing */}
            <Route 
              path="/onboarding" 
              element={
                <OnboardingPage 
                  onProfileComplete={handleProfileComplete}
                  userProfile={userProfile || undefined}
                />
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
}

export default App;
