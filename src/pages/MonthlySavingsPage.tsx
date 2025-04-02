
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { useNavigate } from 'react-router-dom';
import { useAuthSessionCheck } from '@/hooks/savings/useAuthSessionCheck';
import MonthlySavingsLoading from '@/components/savings/page/MonthlySavingsLoading';
import MonthlySavingsError from '@/components/savings/page/MonthlySavingsError';
import MonthlySavingsContent from '@/components/savings/page/MonthlySavingsContent';
import { useToast } from '@/components/ui/use-toast';

interface MonthlySavingsPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const MonthlySavingsPage: React.FC<MonthlySavingsPageProps> = ({
  userProfile,
  onProfileUpdate
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleProfileComplete, isSubmitting } = useProfileCompletion(onProfileUpdate);
  const [loading, setLoading] = useState(true);
  const { checkingAuth, error, setError, checkAndRefreshSession } = useAuthSessionCheck();
  
  // Initial auth check - using useCallback to prevent recreating this function on every render
  const initialAuthCheck = useCallback(async () => {
    try {
      const isAuthenticated = await checkAndRefreshSession();
      
      if (!isAuthenticated) {
        // Give the toast time to be seen before redirecting
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }
      
      // Check if profile is valid
      if (!userProfile || !userProfile.id) {
        setError("User profile not available");
        toast({
          title: "Profile Error",
          description: "Unable to load your profile. Please try logging in again.",
          variant: "destructive"
        });
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }
      
      // Set loading to false after we've confirmed the user is authenticated
      setLoading(false);
    } catch (err) {
      console.error("Auth check error:", err);
      setError("Authentication error occurred");
      setLoading(false);
    }
  }, [userProfile, navigate, toast, checkAndRefreshSession, setError]);
  
  // Run auth check only once on mount or when dependencies change
  useEffect(() => {
    // Only run if loading is true to prevent multiple checks
    if (loading) {
      initialAuthCheck();
    }
  }, [initialAuthCheck, loading]);
  
  const handleSave = useCallback((updatedProfile: UserProfile) => {
    try {
      if (!updatedProfile || !updatedProfile.id) {
        throw new Error("Cannot save: Profile is not valid");
      }
      
      handleProfileComplete(updatedProfile);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile data");
      toast({
        title: "Save Error",
        description: "Failed to save your profile data. Please try again.",
        variant: "destructive"
      });
    }
  }, [handleProfileComplete, setError, toast]);

  const handleRetry = useCallback(async () => {
    setError(null);
    setLoading(true);
    
    const isAuthenticated = await checkAndRefreshSession();
    
    if (isAuthenticated) {
      setLoading(false);
    } else {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [checkAndRefreshSession, navigate, setError]);

  // Show loading state
  if (loading || checkingAuth) {
    return <MonthlySavingsLoading />;
  }

  // Show error state
  if (error) {
    return (
      <>
        <Header onboardingComplete={true} />
        <MonthlySavingsError error={error} onRetry={handleRetry} />
      </>
    );
  }

  return (
    <>
      <Header onboardingComplete={true} />
      <MonthlySavingsContent 
        userProfile={userProfile} 
        onProfileUpdate={handleSave}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default MonthlySavingsPage;
