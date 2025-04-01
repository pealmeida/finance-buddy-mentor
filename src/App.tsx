
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
import { useSupabaseData } from "./hooks/useSupabaseData";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check if user is authenticated and load their profile
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (event === 'SIGNED_IN' && session?.user) {
              try {
                // Allow a small delay to ensure the database has been updated
                setTimeout(async () => {
                  const { fetchUserProfile } = useSupabaseData();
                  const profile = await fetchUserProfile(session.user.id);
                  
                  if (profile) {
                    console.log('Profile loaded after sign in:', profile);
                    setUserProfile(profile);
                    localStorage.setItem('userProfile', JSON.stringify(profile));
                  } else {
                    // If no profile exists yet, create a minimal one with auth data
                    const minimalProfile: UserProfile = {
                      id: session.user.id,
                      email: session.user.email || 'user@example.com',
                      name: session.user.user_metadata?.name || 'User',
                      age: 0,
                      monthlyIncome: 0,
                      riskProfile: 'moderate',
                      hasEmergencyFund: false,
                      hasDebts: false,
                      financialGoals: [],
                      investments: [],
                      debtDetails: [],
                    };
                    console.log('Creating minimal profile:', minimalProfile);
                    setUserProfile(minimalProfile);
                    localStorage.setItem('userProfile', JSON.stringify(minimalProfile));
                  }
                }, 500);
              } catch (error) {
                console.error('Error loading profile after auth change:', error);
              }
            } else if (event === 'SIGNED_OUT') {
              console.log('User signed out, clearing profile');
              setUserProfile(null);
              localStorage.removeItem('userProfile');
            }
          }
        );
        
        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          console.log('Existing session found for user:', session.user.id);
          
          // Try to get their profile from Supabase
          const { fetchUserProfile } = useSupabaseData();
          const profile = await fetchUserProfile(session.user.id);
          
          if (profile) {
            console.log('Existing profile loaded:', profile);
            setUserProfile(profile);
            localStorage.setItem('userProfile', JSON.stringify(profile));
          } else {
            // No profile in Supabase, check localStorage as fallback
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
              try {
                const parsedProfile = JSON.parse(savedProfile);
                // Ensure the profile has the user's ID
                parsedProfile.id = session.user.id;
                console.log('Using local profile:', parsedProfile);
                setUserProfile(parsedProfile);
              } catch (e) {
                console.error("Error parsing stored profile", e);
                toast({
                  title: "Error loading profile",
                  description: "There was a problem loading your saved profile. Please complete your profile again.",
                  variant: "destructive",
                });
              }
            } else {
              // Create a minimal profile with auth data
              const minimalProfile: UserProfile = {
                id: session.user.id,
                email: session.user.email || 'user@example.com',
                name: session.user.user_metadata?.name || 'User',
                age: 0,
                monthlyIncome: 0,
                riskProfile: 'moderate',
                hasEmergencyFund: false,
                hasDebts: false,
                financialGoals: [],
                investments: [],
                debtDetails: [],
              };
              console.log('Creating minimal profile from session:', minimalProfile);
              setUserProfile(minimalProfile);
              localStorage.setItem('userProfile', JSON.stringify(minimalProfile));
            }
          }
        } else {
          // No authenticated user, check for localStorage fallback
          const savedProfile = localStorage.getItem('userProfile');
          if (savedProfile) {
            try {
              const parsedProfile = JSON.parse(savedProfile);
              console.log('Using local profile (no auth):', parsedProfile);
              setUserProfile(parsedProfile);
            } catch (e) {
              console.error("Error parsing stored profile", e);
              setUserProfile(null);
            }
          } else {
            console.log('No profile found, user needs to sign in');
            setUserProfile(null);
          }
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (e) {
        console.error("Error checking auth or loading profile:", e);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile. Please try logging in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };
    
    checkAuth();
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
            
            {/* Auth pages - accessible even when logged in */}
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
