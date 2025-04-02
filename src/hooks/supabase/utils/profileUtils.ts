
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, RiskProfile } from '@/types/finance';

/**
 * Validates if a risk profile is of the correct type
 * @param profile Risk profile string
 * @returns A valid RiskProfile value
 */
export const validateRiskProfile = (profile: string | undefined): RiskProfile => {
  if (profile === 'conservative' || profile === 'moderate' || profile === 'aggressive') {
    return profile as RiskProfile;
  }
  return 'moderate'; // Default to moderate if invalid value
};

/**
 * Save basic profile and financial profile data
 * @param userId User ID
 * @param profile User profile data
 */
export const saveBasicProfile = async (userId: string, profile: UserProfile) => {
  // Upsert basic profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      name: profile.name,
      email: profile.email,
      age: profile.age
    }, { onConflict: 'id' });
      
  if (profileError) throw new Error(`Error updating profile: ${profileError.message}`);
  
  // Validate and ensure risk profile is correct
  const validRiskProfile = validateRiskProfile(profile.riskProfile);
  
  // Upsert financial profile
  const { error: financialProfileError } = await supabase
    .from('financial_profiles')
    .upsert({
      id: userId,
      monthly_income: profile.monthlyIncome,
      risk_profile: validRiskProfile,
      has_emergency_fund: profile.hasEmergencyFund,
      emergency_fund_months: profile.emergencyFundMonths || null,
      has_debts: profile.hasDebts
    }, { onConflict: 'id' });
        
  if (financialProfileError) throw new Error(`Error updating financial profile: ${financialProfileError.message}`);
};
