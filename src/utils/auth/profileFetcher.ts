
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, RiskProfile } from "@/types/finance";
import { validateRiskProfile } from "./profileValidation";

/**
 * Fetches user profile data from Supabase
 */
export const fetchUserProfileFromSupabase = async (userId: string): Promise<UserProfile | null> => {
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
    
    // Create a new profile if it doesn't exist
    if (!profileData) {
      return null;
    }
    
    // Fetch the related data
    const { data: goalsData } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId);
      
    const { data: investmentsData } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId);
      
    const { data: debtDetailsData } = await supabase
      .from('debt_details')
      .select('*')
      .eq('user_id', userId);
    
    // Transform goals data
    const financialGoals = goalsData ? goalsData.map((goal: any) => ({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      targetDate: new Date(goal.target_date),
      priority: goal.priority as 'low' | 'medium' | 'high'
    })) : [];
    
    // Transform investments data
    const investments = investmentsData ? investmentsData.map((investment: any) => ({
      id: investment.id,
      type: investment.type as 'stocks' | 'bonds' | 'realEstate' | 'cash' | 'crypto' | 'other',
      name: investment.name,
      value: investment.value,
      annualReturn: investment.annual_return
    })) : [];
    
    // Transform debt details data
    const debtDetails = debtDetailsData ? debtDetailsData.map((debt: any) => ({
      id: debt.id,
      type: debt.type as 'creditCard' | 'personalLoan' | 'studentLoan' | 'other',
      name: debt.name,
      amount: debt.amount,
      interestRate: debt.interest_rate
    })) : [];
    
    // Ensure riskProfile is a valid RiskProfile type
    const riskProfile = validateRiskProfile(financialProfileData?.risk_profile);
    
    // Combine data from both tables into a user profile object
    return {
      id: profileData.id || userId,
      email: profileData.email || 'user@example.com',
      name: profileData.name || 'User',
      age: profileData.age || 0,
      monthlyIncome: financialProfileData?.monthly_income || 0,
      riskProfile: riskProfile,
      hasEmergencyFund: financialProfileData?.has_emergency_fund || false,
      emergencyFundMonths: financialProfileData?.emergency_fund_months,
      hasDebts: financialProfileData?.has_debts || false,
      financialGoals,
      investments,
      debtDetails,
    };
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
};
