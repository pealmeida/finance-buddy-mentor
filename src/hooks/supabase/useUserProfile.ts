
import { useSupabaseBase } from './useSupabaseBase';
import { UserProfile, RiskProfile } from '@/types/finance';
import { v4 as uuidv4 } from 'uuid';

// Helper function to validate risk profile type
const validateRiskProfile = (profile: string | null): RiskProfile => {
  if (profile === 'conservative' || profile === 'moderate' || profile === 'aggressive') {
    return profile as RiskProfile;
  }
  return 'moderate'; // Default to moderate if invalid value
};

/**
 * Hook for fetching and managing user profile data
 */
export function useUserProfile() {
  const { loading, setLoading, handleError, supabase, toast } = useSupabaseBase();

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      setLoading(true);
      console.log('Fetching profile for user:', userId);
      
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
        toast({
          title: "Profile not found",
          description: "Creating a new profile for you",
        });
        
        // Create a minimal profile with the user ID
        const minimalProfile: UserProfile = {
          id: userId,
          email: 'user@example.com',
          name: 'User',
          age: 0,
          monthlyIncome: 0,
          riskProfile: 'moderate',
          hasEmergencyFund: false,
          hasDebts: false,
          financialGoals: [],
          investments: [],
          debtDetails: [],
        };
        
        return minimalProfile;
      }
      
      // Ensure riskProfile is a valid RiskProfile type
      const riskProfile = validateRiskProfile(financialProfileData?.risk_profile);
      
      // Combine data from both tables into a user profile object
      const userProfile: Partial<UserProfile> = {
        id: profileData.id || userId,
        email: profileData.email || 'user@example.com',
        name: profileData.name || 'User',
        age: profileData.age || 0,
        monthlyIncome: financialProfileData?.monthly_income || 0,
        riskProfile: riskProfile,
        hasEmergencyFund: financialProfileData?.has_emergency_fund || false,
        emergencyFundMonths: financialProfileData?.emergency_fund_months,
        hasDebts: financialProfileData?.has_debts || false,
      };
      
      // Now fetch the related data
      const financialGoals = await fetchFinancialGoals(userId);
      const investments = await fetchInvestments(userId);
      const debtDetails = await fetchDebtDetails(userId);
      
      console.log('Profile data fetched successfully:', {
        ...userProfile,
        financialGoals,
        investments,
        debtDetails
      });
      
      // Complete the user profile
      return {
        ...userProfile,
        financialGoals,
        investments,
        debtDetails,
      } as UserProfile;
      
    } catch (err) {
      return handleError(err, "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialGoals = async (userId: string) => {
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
      toast({
        title: "Warning",
        description: "Could not load your financial goals. Please try again later.",
        variant: "destructive"  // Changed from "warning" to "destructive"
      });
      return [];
    }
  };

  const fetchInvestments = async (userId: string) => {
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
      toast({
        title: "Warning",
        description: "Could not load your investments. Please try again later.",
        variant: "destructive"  // Changed from "warning" to "destructive"
      });
      return [];
    }
  };

  const fetchDebtDetails = async (userId: string) => {
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
        type: debt.type as 'creditCard' | 'personalLoan' | 'studentLoan' | 'other',
        name: debt.name,
        amount: debt.amount,
        interestRate: debt.interest_rate
      })) : [];
    } catch (err) {
      console.error("Error fetching debt details:", err);
      toast({
        title: "Warning",
        description: "Could not load your debt details. Please try again later.",
        variant: "destructive"  // Changed from "warning" to "destructive"
      });
      return [];
    }
  };

  return {
    loading,
    fetchUserProfile
  };
}
