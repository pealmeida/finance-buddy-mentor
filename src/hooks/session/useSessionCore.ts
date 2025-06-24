import { useEffect } from "react";
import { supabase } from "../../integrations/supabase/client";
import { UserProfile } from "../../types/finance";
import { toast } from "../../components/ui/use-toast";
import { fetchUserProfileFromSupabase } from "../../utils/auth/profileFetcher";
import { loadFromLocalStorage } from "../../utils/session/localStorageLoader";
import { isProfileComplete } from "../../utils/profileCompletion";

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

    const initializeSession = async () => {
      if (!isMounted) return;
      setIsLoading(true);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }

        if (session?.user) {
          const profile = await fetchUserProfileFromSupabase(session.user.id);
          if (isMounted && profile) {
            const profileIsComplete = isProfileComplete(profile);
            setIsProfileComplete(profileIsComplete);
            setUserProfile(profile);
            localStorage.setItem('userProfile', JSON.stringify(profile));
          }
        } else {
          loadFromLocalStorage(setUserProfile, setIsProfileComplete);
        }
      } catch (e) {
        console.error("Failed to initialize session:", e);
        if (isMounted) {
          loadFromLocalStorage(setUserProfile, setIsProfileComplete);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setAuthChecked(true);
        }
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          initializeSession(); // Re-initialize to fetch profile
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          setIsProfileComplete(false);
          localStorage.removeItem('userProfile');
        }
        // Don't re-initialize on token refresh, just ignore it
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUserProfile, setIsLoading, setIsProfileComplete, setAuthChecked]);
};
