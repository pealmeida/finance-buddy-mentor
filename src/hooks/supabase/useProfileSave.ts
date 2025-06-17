
import { useSupabaseBase } from './useSupabaseBase';
import { UserProfile } from '@/types/finance';
import { handleFinancialGoals } from './utils/financialGoalsUtils';
import { handleInvestments } from './utils/investmentsUtils';
import { saveDebtDetails } from './utils/debtDetailsUtils';
import { saveBasicProfile, saveFinancialProfile } from './utils/profileUtils';

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
      
      // Validate profile data and provide defaults
      const name = profile.name || 'User';
      const email = profile.email || 'user@example.com';
      const age = profile.age || 0;
      
      if (!profile.riskProfile) throw new Error("Risk profile is required");
      
      // Save basic profile
      await saveBasicProfile(userId, { name, email, age });
      
      // Save financial profile
      await saveFinancialProfile(userId, {
        monthlyIncome: profile.monthlyIncome || 0,
        riskProfile: profile.riskProfile,
        hasEmergencyFund: profile.hasEmergencyFund || false,
        emergencyFundMonths: profile.emergencyFundMonths,
        hasDebts: profile.hasDebts || false
      });
      
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
        await saveDebtDetails(userId, profile.debtDetails);
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
