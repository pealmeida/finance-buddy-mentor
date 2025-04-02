
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const initialCheckDone = useRef<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>('Starting authentication check...');
  const { checkingAuth, error, setError, checkAndRefreshSession } = useAuthSessionCheck();
  
  // Initial auth check - using useCallback to prevent recreating this function on every render
  const initialAuthCheck = useCallback(async () => {
    if (initialCheckDone.current) {
      return;
    }
    
    try {
      setDebugInfo(`Performing initial auth check for user ${userProfile?.id || 'unknown'}`);
      const isAuthenticated = await checkAndRefreshSession(true);
      initialCheckDone.current = true;
      
      if (!isAuthenticated) {
        setDebugInfo('Authentication check failed, preparing to redirect');
        // Give the toast time to be seen before redirecting
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }
      
      // Check if profile is valid
      if (!userProfile || !userProfile.id) {
        setDebugInfo('User profile not available');
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
      setDebugInfo('Authentication check passed, loading content');
      setLoading(false);
    } catch (err) {
      console.error("Auth check error:", err);
      setDebugInfo(`Auth check error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setError("Authentication error occurred");
      setLoading(false);
    }
  }, [userProfile, navigate, toast, checkAndRefreshSession, setError]);
  
  // Run auth check only once on mount or when dependencies change
  useEffect(() => {
    // Only run if loading is true and we haven't done the initial check
    if (loading && !initialCheckDone.current) {
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
    setDebugInfo('Retrying authentication check...');
    initialCheckDone.current = false; // Reset the check flag
    
    // Allow a small delay before the check
    setTimeout(async () => {
      const isAuthenticated = await checkAndRefreshSession(true);
      
      if (isAuthenticated) {
        setLoading(false);
        setDebugInfo('Authentication check passed after retry');
      } else {
        setDebugInfo('Authentication check failed after retry, redirecting');
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    }, 500);
  }, [checkAndRefreshSession, navigate, setError]);

  // Show loading state
  if (loading || checkingAuth) {
    return <MonthlySavingsLoading debugInfo={debugInfo} />;
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
