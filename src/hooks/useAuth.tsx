<<<<<<< HEAD
// Optimized auth hooks with better state management
=======
import { useAuthState } from "./useAuthState.ts";
import { useSessionHandler } from "./useSessionHandler.ts";

/**
 * Main authentication hook that combines state management and session handling
 */
export const useAuth = () => {
  const {
    userProfile,
    setUserProfile,
    isLoading,
    setIsLoading,
    isProfileComplete,
    setIsProfileComplete,
    authChecked,
    setAuthChecked,
    handleProfileComplete,
    handleProfileUpdate,
  } = useAuthState();

  // Handle auth session state changes
  useSessionHandler({
    setUserProfile,
    setIsLoading,
    setIsProfileComplete,
    setAuthChecked,
  });

  return {
    userProfile,
    isLoading,
    isProfileComplete,
    authChecked,
    handleProfileComplete,
    handleProfileUpdate,
  };
};
>>>>>>> combined-features
