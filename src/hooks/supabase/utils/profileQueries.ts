import { supabase } from '@/integrations/supabase/client';
import { FinancialGoal, Investment, DebtDetail, UserProfile, RiskProfile } from '@/types/finance';
import { validateRiskProfile } from './profileUtils';

/**
 * Fetch financial goals for a user
 * @param userId User ID
 * @returns Array of financial goals
 */
export const fetchFinancialGoals = async (userId: string): Promise<FinancialGoal[]> => {
  try {
    const { data: goalsData, error: goalsError } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId);

    if (goalsError) {
      throw new Error(`Error fetching financial goals: ${goalsError.message}`);
    }

    // Transform goals data to match our app's structure
    return goalsData ? goalsData.map((goal: any) => ({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      targetDate: new Date(goal.target_date),
      priority: goal.priority as 'low' | 'medium' | 'high'
    })) : [];
  } catch (err) {
    console.error("Error fetching financial goals:", err);
    return [];
  }
};

/**
 * Fetch investments for a user
 * @param userId User ID
 * @returns Array of investments
 */
export const fetchInvestments = async (userId: string): Promise<Investment[]> => {
  try {
    const { data: investmentsData, error: investmentsError } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId);

    if (investmentsError) {
      throw new Error(`Error fetching investments: ${investmentsError.message}`);
    }

    // Transform investments data
    return investmentsData ? investmentsData.map((investment: any) => ({
      id: investment.id,
      type: investment.type as 'stocks' | 'bonds' | 'realEstate' | 'cash' | 'crypto' | 'other',
      name: investment.name,
      value: investment.value,
      annualReturn: investment.annual_return
    })) : [];
  } catch (err) {
    console.error("Error fetching investments:", err);
    return [];
  }
};

/**
 * Fetch debt details for a user
 * @param userId User ID
 * @returns Array of debt details
 */
export const fetchDebtDetails = async (userId: string): Promise<DebtDetail[]> => {
  try {
    const { data: debtDetailsData, error: debtDetailsError } = await supabase
      .from('debt_details')
      .select('*')
      .eq('user_id', userId);

    if (debtDetailsError) {
      throw new Error(`Error fetching debt details: ${debtDetailsError.message}`);
    }

    // Transform debt details data
    return debtDetailsData ? debtDetailsData.map((debt: any) => ({
      id: debt.id,
      type: debt.type as 'credit_card' | 'loan' | 'mortgage' | 'other',
      amount: debt.amount,
      interestRate: debt.interest_rate,
      minimumPayment: debt.minimum_payment || 0 // Add default value for minimumPayment
    })) : [];
  } catch (err) {
    console.error("Error fetching debt details:", err);
    return [];
  }
};

/**
 * Create a new minimal profile with default values
 * @param userId User ID
 * @returns A minimal user profile
 */
export const createMinimalProfile = (userId: string): UserProfile => {
  return {
    id: userId,
    email: 'user@example.com',
    name: 'User',
    phone: '',
    phoneVerified: false,
    age: 0,
    monthlyIncome: 0,
    riskProfile: 'moderate',
    hasEmergencyFund: false,
    emergencyFundMonths: 0,
    hasDebts: false,
    financialGoals: [],
    investments: [],
    debtDetails: [],
  };
};

/**
 * Fetch basic profile and financial profile data
 * @param userId User ID
 * @returns Combined profile data or null if error
 */
export const fetchProfileData = async (userId: string): Promise<Partial<UserProfile> | null> => {
  try {
    // Fetch basic profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    // Fetch financial profile
    const { data: financialProfileData, error: financialProfileError } = await supabase
      .from('financial_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (financialProfileError && financialProfileError.code !== 'PGRST116') {
      throw new Error(`Error fetching financial profile: ${financialProfileError.message}`);
    }

    // Fetch user auth data to get phone information
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.warn(`Warning fetching user auth data: ${userError.message}`);
      // Continue even if there's an error, as we can still return the basic profile
    }

    // If no profile data found, return null
    if (!profileData) {
      return null;
    }

    // Ensure riskProfile is a valid RiskProfile type
    const riskProfile = validateRiskProfile(financialProfileData?.risk_profile);

    // Get phone data from user auth data
    const phone = userData?.user?.phone || '';
    const phoneVerified = userData?.user?.phone_confirmed_at ? true : false;

    // Combine data from both tables into a user profile object
    return {
      id: profileData.id || userId,
      email: profileData.email || 'user@example.com',
      name: profileData.name || 'User',
      phone,
      phoneVerified,
      age: profileData.age || 0,
      monthlyIncome: financialProfileData?.monthly_income || 0,
      riskProfile: riskProfile,
      hasEmergencyFund: financialProfileData?.has_emergency_fund || false,
      emergencyFundMonths: financialProfileData?.emergency_fund_months || 0, // Ensure it's not null
      hasDebts: financialProfileData?.has_debts || false,
    };
  } catch (err) {
    console.error("Error fetching profile data:", err);
    return null;
  }
};
