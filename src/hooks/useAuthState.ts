import { useState } from 'react';
import { UserProfile } from "@/types/finance";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook to manage authentication state and profile updates
 */
export const useAuthState = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const handleProfileComplete = (profile: UserProfile) => {
    // Save profile in state and localStorage
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    // Merge the updatedProfile with the current userProfile state
    setUserProfile(prevProfile => {
      const newProfile = {
        ...(prevProfile || {}), // Start with existing profile, or an empty object if null
        ...updatedProfile, // Merge in the updated properties
      };
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      return newProfile;
    });

    // Removed toast notification for profile update
    // toast({
    //   title: "Profile updated",
    //   description: "Your profile has been successfully updated.",
    // });
  };

  return {
    userProfile,
    setUserProfile,
    isLoading,
    setIsLoading,
    isProfileComplete,
    setIsProfileComplete,
    authChecked,
    setAuthChecked,
    handleProfileComplete,
    handleProfileUpdate
  };
};
