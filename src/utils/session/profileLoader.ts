
import { UserProfile } from "@/types/finance";
import { fetchUserProfileFromSupabase } from "@/utils/auth/profileFetcher";

/**
 * Fetches user profile from Supabase and updates state
 */
export const fetchProfile = async (
  userId: string,
  setUserProfile: (profile: UserProfile | null) => void,
  setIsProfileComplete: (complete: boolean) => void
) => {
  try {
    const profile = await fetchUserProfileFromSupabase(userId);
    
    if (profile) {
      // Check if profile is complete enough to skip onboarding
      const profileIsComplete = 
        profile.monthlyIncome > 0 && 
        profile.age > 0 && 
        profile.riskProfile !== undefined;
      
      setIsProfileComplete(profileIsComplete);
      setUserProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
    } else {
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
      setIsProfileComplete(false);
      setUserProfile(minimalProfile);
      localStorage.setItem('userProfile', JSON.stringify(minimalProfile));
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
};
