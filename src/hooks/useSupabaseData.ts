
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  UserProfile, 
  FinancialGoal, 
  Investment, 
  DebtDetail,
  RiskProfile
} from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch profile data
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      setLoading(true);
      
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
      
      // Fetch financial goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', userId);
        
      if (goalsError) {
        throw new Error(`Error fetching financial goals: ${goalsError.message}`);
      }
      
      // Fetch investments
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId);
        
      if (investmentsError) {
        throw new Error(`Error fetching investments: ${investmentsError.message}`);
      }
      
      // Fetch debt details
      const { data: debtDetailsData, error: debtDetailsError } = await supabase
        .from('debt_details')
        .select('*')
        .eq('user_id', userId);
        
      if (debtDetailsError) {
        throw new Error(`Error fetching debt details: ${debtDetailsError.message}`);
      }
      
      if (!profileData) {
        return null;
      }
      
      // Transform goals data to match our app's structure
      const financialGoals: FinancialGoal[] = goalsData ? goalsData.map((goal: any) => ({
        id: goal.id,
        name: goal.name,
        targetAmount: goal.target_amount,
        currentAmount: goal.current_amount,
        targetDate: new Date(goal.target_date),
        priority: goal.priority as 'low' | 'medium' | 'high'
      })) : [];
      
      // Transform investments data to match our app's structure
      const investments: Investment[] = investmentsData ? investmentsData.map((investment: any) => ({
        id: investment.id,
        type: investment.type as 'stocks' | 'bonds' | 'realEstate' | 'cash' | 'crypto' | 'other',
        name: investment.name,
        value: investment.value,
        annualReturn: investment.annual_return
      })) : [];
      
      // Transform debt details data to match our app's structure
      const debtDetails: DebtDetail[] = debtDetailsData ? debtDetailsData.map((debt: any) => ({
        id: debt.id,
        type: debt.type as 'creditCard' | 'personalLoan' | 'studentLoan' | 'other',
        name: debt.name,
        amount: debt.amount,
        interestRate: debt.interest_rate
      })) : [];
      
      // Combine all data into a user profile object
      const userProfile: UserProfile = {
        id: profileData?.id || userId,
        email: profileData?.email || 'user@example.com',
        name: profileData?.name || 'User',
        age: profileData?.age || 0,
        monthlyIncome: financialProfileData?.monthly_income || 0,
        riskProfile: (financialProfileData?.risk_profile as RiskProfile) || 'moderate',
        hasEmergencyFund: financialProfileData?.has_emergency_fund || false,
        emergencyFundMonths: financialProfileData?.emergency_fund_months,
        hasDebts: financialProfileData?.has_debts || false,
        debtDetails: debtDetails,
        financialGoals: financialGoals,
        investments: investments
      };
      
      return userProfile;
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
      setError(err instanceof Error ? err.message : "Unknown error fetching user data");
      toast({
        title: "Error fetching profile",
        description: err instanceof Error ? err.message : "Failed to load your profile data",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
    try {
      setLoading(true);
      const userId = profile.id;
      
      if (!userId) throw new Error("User ID is required to save profile");
      
      // Upsert basic profile (insert if not exists, update if exists)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          name: profile.name,
          email: profile.email,
          age: profile.age
        });
        
      if (profileError) throw new Error(`Error updating profile: ${profileError.message}`);
      
      // Upsert financial profile
      const { error: financialProfileError } = await supabase
        .from('financial_profiles')
        .upsert({
          id: userId,
          monthly_income: profile.monthlyIncome,
          risk_profile: profile.riskProfile,
          has_emergency_fund: profile.hasEmergencyFund,
          emergency_fund_months: profile.emergencyFundMonths,
          has_debts: profile.hasDebts
        });
          
      if (financialProfileError) throw new Error(`Error updating financial profile: ${financialProfileError.message}`);
      
      // Handle financial goals (more complex with create/update/delete)
      if (profile.financialGoals && profile.financialGoals.length > 0) {
        // Get existing goals
        const { data: existingGoals, error: fetchGoalsError } = await supabase
          .from('financial_goals')
          .select('id')
          .eq('user_id', userId);
          
        if (fetchGoalsError) throw new Error(`Error fetching existing goals: ${fetchGoalsError.message}`);
        
        const existingGoalIds = existingGoals ? existingGoals.map((g: any) => g.id) : [];
        const newGoalIds = profile.financialGoals.map(g => g.id);
        
        // Find goals to delete (exist in DB but not in the updated profile)
        const goalsToDelete = existingGoalIds.filter(id => !newGoalIds.includes(id));
        
        // Delete removed goals
        if (goalsToDelete.length > 0) {
          const { error: deleteGoalsError } = await supabase
            .from('financial_goals')
            .delete()
            .in('id', goalsToDelete);
            
          if (deleteGoalsError) throw new Error(`Error deleting goals: ${deleteGoalsError.message}`);
        }
        
        // Upsert all current goals
        const goalsToUpsert = profile.financialGoals.map(goal => ({
          id: goal.id,
          user_id: userId,
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          target_date: goal.targetDate.toISOString().split('T')[0],
          priority: goal.priority
        }));
        
        const { error: upsertGoalsError } = await supabase
          .from('financial_goals')
          .upsert(goalsToUpsert);
          
        if (upsertGoalsError) throw new Error(`Error updating goals: ${upsertGoalsError.message}`);
      }
      
      // Handle investments (similar approach as goals)
      if (profile.investments && profile.investments.length > 0) {
        // Get existing investments
        const { data: existingInvestments, error: fetchInvestmentsError } = await supabase
          .from('investments')
          .select('id')
          .eq('user_id', userId);
          
        if (fetchInvestmentsError) throw new Error(`Error fetching existing investments: ${fetchInvestmentsError.message}`);
        
        const existingInvestmentIds = existingInvestments ? existingInvestments.map((i: any) => i.id) : [];
        const newInvestmentIds = profile.investments.map(i => i.id);
        
        // Find investments to delete
        const investmentsToDelete = existingInvestmentIds.filter(id => !newInvestmentIds.includes(id));
        
        // Delete removed investments
        if (investmentsToDelete.length > 0) {
          const { error: deleteInvestmentsError } = await supabase
            .from('investments')
            .delete()
            .in('id', investmentsToDelete);
            
          if (deleteInvestmentsError) throw new Error(`Error deleting investments: ${deleteInvestmentsError.message}`);
        }
        
        // Upsert all current investments
        const investmentsToUpsert = profile.investments.map(investment => ({
          id: investment.id,
          user_id: userId,
          type: investment.type,
          name: investment.name,
          value: investment.value,
          annual_return: investment.annualReturn
        }));
        
        const { error: upsertInvestmentsError } = await supabase
          .from('investments')
          .upsert(investmentsToUpsert);
          
        if (upsertInvestmentsError) throw new Error(`Error updating investments: ${upsertInvestmentsError.message}`);
      }
      
      // Handle debt details (similar approach)
      if (profile.debtDetails && profile.debtDetails.length > 0) {
        // Get existing debts
        const { data: existingDebts, error: fetchDebtsError } = await supabase
          .from('debt_details')
          .select('id')
          .eq('user_id', userId);
          
        if (fetchDebtsError) throw new Error(`Error fetching existing debts: ${fetchDebtsError.message}`);
        
        const existingDebtIds = existingDebts ? existingDebts.map((d: any) => d.id) : [];
        const newDebtIds = profile.debtDetails.map(d => d.id);
        
        // Find debts to delete
        const debtsToDelete = existingDebtIds.filter(id => !newDebtIds.includes(id));
        
        // Delete removed debts
        if (debtsToDelete.length > 0) {
          const { error: deleteDebtsError } = await supabase
            .from('debt_details')
            .delete()
            .in('id', debtsToDelete);
            
          if (deleteDebtsError) throw new Error(`Error deleting debts: ${deleteDebtsError.message}`);
        }
        
        // Upsert all current debts
        const debtsToUpsert = profile.debtDetails.map(debt => ({
          id: debt.id,
          user_id: userId,
          type: debt.type,
          name: debt.name,
          amount: debt.amount,
          interest_rate: debt.interestRate
        }));
        
        const { error: upsertDebtsError } = await supabase
          .from('debt_details')
          .upsert(debtsToUpsert);
          
        if (upsertDebtsError) throw new Error(`Error updating debts: ${upsertDebtsError.message}`);
      }
      
      return true;
    } catch (err) {
      console.error("Error in saveUserProfile:", err);
      setError(err instanceof Error ? err.message : "Unknown error saving user data");
      toast({
        title: "Error saving profile",
        description: err instanceof Error ? err.message : "Failed to save your profile data",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchUserProfile,
    saveUserProfile
  };
}
