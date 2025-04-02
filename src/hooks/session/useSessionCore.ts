
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/finance";
import { toast } from "@/components/ui/use-toast";

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

    const setupAuthListener = async () => {
      try {
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (event === 'SIGNED_IN' && session?.user) {
              // Defer profile fetch to prevent Supabase authentication deadlocks
              setTimeout(() => {
                import('@/utils/session/profileLoader').then(module => {
                  const { fetchProfile } = module;
                  fetchProfile(session.user.id, setUserProfile, setIsProfileComplete);
                });
              }, 0);
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
              // Handle token refresh by updating the profile data
              setTimeout(() => {
                import('@/utils/session/profileLoader').then(module => {
                  const { fetchProfile } = module;
                  fetchProfile(session.user.id, setUserProfile, setIsProfileComplete);
                });
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              console.log('User signed out, clearing profile');
              setUserProfile(null);
              setIsProfileComplete(false);
              localStorage.removeItem('userProfile');
            }
          }
        );
        
        return subscription;
      } catch (error) {
        console.error("Error setting up auth listener:", error);
        return { unsubscribe: () => {} };
      }
    };

    const checkExistingSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          console.log('Existing session found for user:', session.user.id);
          
          // Import and use profile loader
          const { fetchProfile } = await import('@/utils/session/profileLoader');
          await fetchProfile(session.user.id, setUserProfile, setIsProfileComplete);
        } else {
          // Load from localStorage if no active session
          import('@/utils/session/localStorageLoader').then(module => {
            const { loadFromLocalStorage } = module;
            loadFromLocalStorage(setUserProfile, setIsProfileComplete);
          });
        }
      } catch (e) {
        console.error("Error checking session:", e);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile. Please try logging in again.",
          variant: "destructive",
        });
      }
    };

    const init = async () => {
      setIsLoading(true);
      
      try {
        // Set up the auth state listener first
        const subscription = await setupAuthListener();
        
        // Then check for existing session
        await checkExistingSession();
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (e) {
        console.error("Session initialization error:", e);
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
