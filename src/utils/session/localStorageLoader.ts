
import { UserProfile } from '@/types/finance';

/**
 * Validate risk profile from a potentially invalid value 
 */
const validateRiskProfile = (profile: string | undefined) => {
  if (profile === 'conservative' || profile === 'moderate' || profile === 'aggressive') {
    return profile;
  }
  return 'moderate'; // Default to moderate if invalid value
};

/**
 * Loads user profile from localStorage when no active session exists
 */
export const loadFromLocalStorage = (
  setUserProfile: (profile: UserProfile | null) => void,
  setIsProfileComplete: (complete: boolean) => void
) => {
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
};
