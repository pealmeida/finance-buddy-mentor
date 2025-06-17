
import { useState } from 'react';
import { UserProfile } from "@/types/finance";
import { toast } from "@/components/ui/use-toast";
import { validateUserProfile } from '@/utils/validation/inputValidation';
import { secureSetItem, secureGetItem } from '@/utils/security/secureStorage';

/**
 * Hook to manage authentication state and profile updates with enhanced security
 */
export const useAuthState = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const handleProfileComplete = (profile: UserProfile) => {
    // Validate profile data before saving
    const validation = validateUserProfile(profile);
    
    if (!validation.isValid) {
      toast({
        title: "Profile Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Save profile in state and secure storage
    setUserProfile(profile);
    secureSetItem('userProfile', profile);
    
    toast({
      title: "Profile Completed",
      description: "Your profile has been successfully saved.",
    });
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    // Validate updated profile data
    const validation = validateUserProfile(updatedProfile);
    
    if (!validation.isValid) {
      toast({
        title: "Profile Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Merge the updatedProfile with the current userProfile state
    setUserProfile(prevProfile => {
      const newProfile = {
        ...(prevProfile || {}), // Start with existing profile, or an empty object if null
        ...updatedProfile, // Merge in the updated properties
      };
      
      // Store securely
      secureSetItem('userProfile', newProfile);
      return newProfile;
    });
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
