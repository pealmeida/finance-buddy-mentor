
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/finance";
import { toast } from "@/components/ui/use-toast";
import { fetchUserProfileFromSupabase } from "@/utils/auth/profileFetcher";

interface SessionCoreProps {
  setUserProfile: (profile: UserProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsProfileComplete: (complete: boolean) => void;
  setAuthChecked: (checked: boolean) => void;
}

/**
 * Core session handling hook that sets up auth listeners and manages session state
 */
export const useSessionCore = ({
  setUserProfile,
  setIsLoading,
  setIsProfileComplete,
  setAuthChecked
}: SessionCoreProps) => {
  useEffect(() => {
    let isMounted = true;

    // Function to fetch profile data
    const fetchProfile = async (userId: string) => {
      try {
        const profile = await fetchUserProfileFromSupabase(userId);
        
        if (profile && isMounted) {
          console.log('Profile loaded successfully');
          
          // Check if profile is complete with all required fields
          const profileIsComplete = 
            profile.monthlyIncome > 0 && 
            profile.age > 0 && 
            profile.riskProfile !== undefined;
          
          setIsProfileComplete(profileIsComplete);
          setUserProfile(profile);
          localStorage.setItem('userProfile', JSON.stringify(profile));
        } else if (isMounted) {
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
          console.log('Creating minimal profile');
          setIsProfileComplete(false);
          setUserProfile(minimalProfile);
          localStorage.setItem('userProfile', JSON.stringify(minimalProfile));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (isMounted) {
          toast({
            title: "Error loading profile",
            description: "There was a problem loading your profile data",
            variant: "destructive",
          });
        }
      }
    };

    // Function to load from localStorage
    const loadFromLocalStorage = () => {
      const savedProfile = localStorage.getItem('userProfile');
      
      if (savedProfile && isMounted) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          console.log('Using local profile (no auth)');
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
      } else if (isMounted) {
        console.log('No profile found, user needs to sign in');
        setUserProfile(null);
        setIsProfileComplete(false);
      }
    };

    const setupAuthListener = () => {
      // Set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (event === 'SIGNED_IN' && session?.user) {
            // Prevent potential Supabase authentication deadlocks by using setTimeout
            setTimeout(() => {
              if (isMounted) {
                fetchProfile(session.user.id);
              }
            }, 0);
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            // Handle token refresh by updating the profile data
            setTimeout(() => {
              if (isMounted) {
                fetchProfile(session.user.id);
              }
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out, clearing profile');
            if (isMounted) {
              setUserProfile(null);
              setIsProfileComplete(false);
              localStorage.removeItem('userProfile');
            }
          }
        }
      );
      
      return subscription;
    };

    const init = async () => {
      setIsLoading(true);
      
      try {
        // Set up the auth state listener first
        const subscription = setupAuthListener();
        
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          console.log('Existing session found for user:', session.user.id);
          // Use setTimeout to avoid Supabase auth deadlocks
          setTimeout(() => {
            if (isMounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          // Load from localStorage if no active session
          loadFromLocalStorage();
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (e) {
        console.error("Session initialization error:", e);
        // Load from localStorage as fallback
        loadFromLocalStorage();
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setAuthChecked(true);
        }
      }
    };
    
    init();
    
    return () => {
      isMounted = false;
    };
  }, [setUserProfile, setIsLoading, setIsProfileComplete, setAuthChecked]);
};
