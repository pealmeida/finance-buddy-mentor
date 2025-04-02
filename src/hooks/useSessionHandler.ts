
import { useSessionCore } from "./session/useSessionCore";

/**
 * Main session handler hook that combines functionality from smaller modules
 */
export const useSessionHandler = ({
  setUserProfile,
  setIsLoading,
  setIsProfileComplete,
  setAuthChecked
}) => {
  // Use the core session hook for auth state changes and session management
  useSessionCore({
    setUserProfile,
    setIsLoading,
    setIsProfileComplete,
    setAuthChecked
  });
};
