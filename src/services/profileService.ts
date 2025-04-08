
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/finance';
import { saveBasicProfile } from '@/hooks/supabase/utils/profileUtils';
import { handleFinancialGoals } from '@/hooks/supabase/utils/financialGoalsUtils';
import { handleInvestments } from '@/hooks/supabase/utils/investmentsUtils';
import { handleDebtDetails } from '@/hooks/supabase/utils/debtDetailsUtils';

/**
 * Save a complete user profile to Supabase
 * @param profile The profile to save
 * @returns True if save was successful, false otherwise
 */
export const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
  try {
    const userId = profile.id;
    
    if (!userId) {
      console.error("Cannot save profile without a user ID");
      return false;
    }
    
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
    console.error("Error saving user profile:", err);
    throw err; // Rethrow to allow the calling code to handle the error
  }
};

/**
 * Get the current session user's ID
 * @returns The user ID or null if no session
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    console.error("Error getting current user or no active session:", error);
    return null;
  }
  
  return data.session.user.id;
};

/**
 * Refresh the current session
 * @returns True if successful, false otherwise
 */
export const refreshSession = async (): Promise<boolean> => {
  const { data, error } = await supabase.auth.refreshSession();
  
  if (error || !data.session) {
    console.error("Error refreshing session:", error);
    return false;
  }
  
  return true;
};
