
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/finance";
import { toast } from "@/components/ui/use-toast";
import { fetchUserProfileFromSupabase } from "@/utils/auth/profileFetcher";
import { validateRiskProfile } from "@/utils/auth/profileValidation";

interface SessionHandlerProps {
  setUserProfile: (profile: UserProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsProfileComplete: (complete: boolean) => void;
  setAuthChecked: (checked: boolean) => void;
}

/**
 * Hook to handle auth session state and changes
 */
export const useSessionHandler = ({
  setUserProfile,
  setIsLoading,
  setIsProfileComplete,
  setAuthChecked
}: SessionHandlerProps) => {
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const profile = await fetchUserProfileFromSupabase(userId);
        
        if (!isMounted) return;
        
        if (profile) {
          console.log('Profile loaded:', profile);
          // Check if profile is complete enough to skip onboarding
          const profileIsComplete = 
            profile.monthlyIncome > 0 && 
            profile.age > 0 && 
            profile.riskProfile !== undefined;
          
          setIsProfileComplete(profileIsComplete);
          setUserProfile(profile);
          localStorage.setItem('userProfile', JSON.stringify(profile));
        } else {
          // If no profile exists yet, create a minimal one with auth data
          const minimalProfile: UserProfile = {
            id: userId,
            email: '',
            name: '',
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
          setIsProfileComplete(false);
          setUserProfile(minimalProfile);
          localStorage.setItem('userProfile', JSON.stringify(minimalProfile));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (event === 'SIGNED_IN' && session?.user) {
              // Defer profile fetch to prevent Supabase authentication deadlocks
              setTimeout(() => fetchProfile(session.user.id), 0);
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
              // Handle token refresh by updating the profile data
              setTimeout(() => fetchProfile(session.user.id), 0);
            } else if (event === 'SIGNED_OUT') {
              console.log('User signed out, clearing profile');
              setUserProfile(null);
              setIsProfileComplete(false);
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
          await fetchProfile(session.user.id);
        } else {
          // No authenticated user, check for localStorage fallback
          const savedProfile = localStorage.getItem('userProfile');
          if (savedProfile) {
            try {
              const parsedProfile = JSON.parse(savedProfile);
              
              // Validate the riskProfile
              parsedProfile.riskProfile = validateRiskProfile(parsedProfile.riskProfile);
              
              console.log('Using local profile (no auth):', parsedProfile);
              setUserProfile(parsedProfile);
              
              // Check if profile is complete
              const profileIsComplete = 
                parsedProfile.monthlyIncome > 0 && 
                parsedProfile.age > 0 && 
                parsedProfile.riskProfile !== undefined;
              
              setIsProfileComplete(profileIsComplete);
            } catch (e) {
              console.error("Error parsing stored profile", e);
              setUserProfile(null);
              setIsProfileComplete(false);
            }
          } else {
            console.log('No profile found, user needs to sign in');
            setUserProfile(null);
            setIsProfileComplete(false);
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
        if (isMounted) {
          setIsLoading(false);
          setAuthChecked(true);
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [setUserProfile, setIsLoading, setIsProfileComplete, setAuthChecked]);
};
