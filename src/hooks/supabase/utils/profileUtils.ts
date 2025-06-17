
import { supabase } from '@/integrations/supabase/client';
import { RiskProfile } from '@/types/finance';

/**
 * Validate and convert risk profile string to RiskProfile type
 */
export const validateRiskProfile = (value: string | null | undefined): RiskProfile => {
  if (value === 'conservative' || value === 'moderate' || value === 'aggressive') {
    return value;
  }
  return 'moderate'; // default value
};

/**
 * Save basic profile information to Supabase
 */
export const saveBasicProfile = async (userId: string, profileData: {
  name: string;
  email: string;
  age: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([{
        id: userId,
        name: profileData.name,
        email: profileData.email,
        age: profileData.age
      }]);

    if (error) {
      throw new Error(`Error saving basic profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in saveBasicProfile:', error);
    throw error;
  }
};

/**
 * Save financial profile information to Supabase
 */
export const saveFinancialProfile = async (userId: string, financialData: {
  monthlyIncome: number;
  riskProfile: RiskProfile;
  hasEmergencyFund: boolean;
  emergencyFundMonths?: number;
  hasDebts: boolean;
}) => {
  try {
    const { data, error } = await supabase
      .from('financial_profiles')
      .upsert([{
        id: userId,
        monthly_income: financialData.monthlyIncome,
        risk_profile: financialData.riskProfile,
        has_emergency_fund: financialData.hasEmergencyFund,
        emergency_fund_months: financialData.emergencyFundMonths,
        has_debts: financialData.hasDebts
      }]);

    if (error) {
      throw new Error(`Error saving financial profile: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in saveFinancialProfile:', error);
    throw error;
  }
};

/**
 * Check if a user profile exists
 */
export const checkProfileExists = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking profile existence:', error);
    return false;
  }
};
