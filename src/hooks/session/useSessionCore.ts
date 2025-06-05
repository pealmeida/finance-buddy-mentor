import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/finance";
import { toast } from "@/components/ui/use-toast";
import { fetchUserProfileFromSupabase } from "@/utils/auth/profileFetcher";
import { loadFromLocalStorage } from "@/utils/session/localStorageLoader";

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
          console.log('Session found, fetching profile for user:', session.user.id);
          const profile = await fetchUserProfileFromSupabase(session.user.id);
          if (isMounted && profile) {
            const profileIsComplete = profile.monthlyIncome > 0 && profile.age > 0 && profile.riskProfile !== undefined;
            setIsProfileComplete(profileIsComplete);
            setUserProfile(profile);
            localStorage.setItem('userProfile', JSON.stringify(profile));
          }
        } else {
          console.log('No session, loading from localStorage for guest.');
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
          console.log('Session initialization complete. Loading state finished.');
        }
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          initializeSession(); // Re-initialize to fetch profile
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing profile.');
          setUserProfile(null);
          setIsProfileComplete(false);
          localStorage.removeItem('userProfile');
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUserProfile, setIsLoading, setIsProfileComplete, setAuthChecked]);
};
