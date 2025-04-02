
import { useSupabaseBase } from './useSupabaseBase';
import { UserProfile } from '@/types/finance';
import { handleFinancialGoals } from './utils/financialGoalsUtils';
import { handleInvestments } from './utils/investmentsUtils';
import { handleDebtDetails } from './utils/debtDetailsUtils';
import { saveBasicProfile } from './utils/profileUtils';

/**
 * Hook for saving user profile data
 */
export function useProfileSave() {
  const { loading, setLoading, handleError, supabase } = useSupabaseBase();

  const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
    try {
      setLoading(true);
      const userId = profile.id;
      
      if (!userId) throw new Error("User ID is required to save profile");
      
      console.log('Saving profile for user:', userId);
      
      // Validate profile data
      if (!profile.name) throw new Error("Name is required");
      if (!profile.email) throw new Error("Email is required");
      if (!profile.riskProfile) throw new Error("Risk profile is required");
      
      // Save basic profile and financial profile
      await saveBasicProfile(userId, profile);
      
      // Handle financial goals
      if (profile.financialGoals && profile.financialGoals.length > 0) {
        await handleFinancialGoals(userId, profile.financialGoals);
      }
      
      // Handle investments
      if (profile.investments && profile.investments.length > 0) {
        await handleInvestments(userId, profile.investments);
      }
      
      // Handle debt details
      if (profile.debtDetails && profile.debtDetails.length > 0) {
        await handleDebtDetails(userId, profile.debtDetails);
      }
      
      return true;
    } catch (err) {
      handleError(err, "Error saving profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveUserProfile
  };
}
