import { useSessionCore } from "./session/useSessionCore";
import { UserProfile } from "../types/finance";

interface SessionHandlerProps {
  setUserProfile: (profile: UserProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsProfileComplete: (complete: boolean) => void;
  setAuthChecked: (checked: boolean) => void;
}

/**
 * Main session handler hook that combines functionality from smaller modules
 */
export const useSessionHandler = ({
  setUserProfile,
  setIsLoading,
  setIsProfileComplete,
  setAuthChecked
}: SessionHandlerProps) => {
  // Use the core session hook for auth state changes and session management
  useSessionCore({
    setUserProfile,
    setIsLoading,
    setIsProfileComplete,
    setAuthChecked
  });
};
