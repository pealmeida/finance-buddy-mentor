
import { UserProfile } from '@/types/finance';
import { fetchUserProfileFromSupabase } from '@/utils/auth/profileFetcher';

/**
 * Load user profile with validation and safety checks
 */
export const loadUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const profile = await fetchUserProfileFromSupabase(userId);
    
    if (!profile) {
      return null;
    }

    // Validate profile data
    if (!profile.id || typeof profile.id !== 'string') {
      console.error('Invalid profile ID');
      return null;
    }

    // Ensure required numeric fields have valid values
    const monthlyIncome = profile.monthlyIncome ?? 0;
    const age = profile.age ?? 0;

    // Return validated profile
    return {
      ...profile,
      monthlyIncome,
      age
    };
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
};

/**
 * Validate profile completeness
 */
export const validateProfileCompleteness = (profile: UserProfile): boolean => {
  return !!(
    profile.id &&
    profile.name &&
    profile.email &&
    typeof profile.monthlyIncome === 'number' &&
    typeof profile.age === 'number' &&
    profile.riskProfile
  );
};
