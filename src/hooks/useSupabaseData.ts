
import { useUserProfile } from './supabase/useUserProfile';
import { useProfileSave } from './supabase/useProfileSave';
import { UserProfile } from '@/types/finance';
import { useState } from 'react';

/**
 * Main hook that combines all Supabase data operations
 * IMPORTANT: This hook must only be used inside React functional components
 */
export function useSupabaseData() {
  const { loading: profileLoading, fetchUserProfile } = useUserProfile();
  const { loading: saveLoading, saveUserProfile: saveProfile } = useProfileSave();
  const [error, setError] = useState<string | null>(null);

  const loading = profileLoading || saveLoading;
  
  // Wrapper for saveUserProfile to ensure we always have a complete UserProfile
  const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
    try {
      // Ensure the profile is complete with all required fields
      const completeProfile: UserProfile = {
        id: profile.id,
        email: profile.email || '',
        name: profile.name || 'User',
        age: profile.age || 0,
        monthlyIncome: profile.monthlyIncome || 0,
        riskProfile: profile.riskProfile || 'moderate',
        hasEmergencyFund: profile.hasEmergencyFund || false,
        hasDebts: profile.hasDebts || false,
        financialGoals: profile.financialGoals || [],
        investments: profile.investments || [],
        debtDetails: profile.debtDetails || []
      };
      return await saveProfile(completeProfile);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMsg);
      console.error("Error saving profile:", errorMsg);
      return false;
    }
  };

  return {
    loading,
    error,
    fetchUserProfile,
    saveUserProfile
  };
}
