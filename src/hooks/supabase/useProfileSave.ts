
import { useSupabaseBase } from './useSupabaseBase';
import { UserProfile } from '@/types/finance';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for saving user profile data
 */
export function useProfileSave() {
  const { loading, setLoading, handleError, supabase, toast } = useSupabaseBase();

  const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
    try {
      setLoading(true);
      const userId = profile.id;
      
      if (!userId) throw new Error("User ID is required to save profile");
      
      console.log('Saving profile for user:', userId);
      console.log('Profile data:', profile);
      
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
      
      // Upsert financial profile
      const { error: financialProfileError } = await supabase
        .from('financial_profiles')
        .upsert({
          id: userId,
          monthly_income: profile.monthlyIncome,
          risk_profile: profile.riskProfile,
          has_emergency_fund: profile.hasEmergencyFund,
          emergency_fund_months: profile.emergencyFundMonths || null,
          has_debts: profile.hasDebts
        }, { onConflict: 'id' });
          
      if (financialProfileError) throw new Error(`Error updating financial profile: ${financialProfileError.message}`);
      
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
      
      toast({
        title: "Profile saved successfully",
        description: "Your profile has been updated in our database",
      });
      
      return true;
    } catch (err) {
      handleError(err, "Error saving profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFinancialGoals = async (userId: string, financialGoals: any[]) => {
    try {
      // Get existing goals
      const { data: existingGoals, error: fetchGoalsError } = await supabase
        .from('financial_goals')
        .select('id')
        .eq('user_id', userId);
        
      if (fetchGoalsError) throw new Error(`Error fetching existing goals: ${fetchGoalsError.message}`);
      
      const existingGoalIds = existingGoals ? existingGoals.map((g: any) => g.id) : [];
      const newGoalIds = financialGoals.map(g => g.id);
      
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
      
      // Upsert all current goals - ensure each goal has a valid ID
      const goalsToUpsert = financialGoals.map(goal => ({
        id: goal.id || uuidv4(),
        user_id: userId,
        name: goal.name,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        target_date: goal.targetDate instanceof Date 
          ? goal.targetDate.toISOString().split('T')[0] 
          : (typeof goal.targetDate === 'string' ? goal.targetDate : new Date().toISOString().split('T')[0]),
        priority: goal.priority
      }));
      
      const { error: upsertGoalsError } = await supabase
        .from('financial_goals')
        .upsert(goalsToUpsert, { onConflict: 'id' });
        
      if (upsertGoalsError) throw new Error(`Error updating goals: ${upsertGoalsError.message}`);
      
    } catch (err) {
      console.error("Error handling financial goals:", err);
      throw err;
    }
  };

  const handleInvestments = async (userId: string, investments: any[]) => {
    try {
      // Get existing investments
      const { data: existingInvestments, error: fetchInvestmentsError } = await supabase
        .from('investments')
        .select('id')
        .eq('user_id', userId);
        
      if (fetchInvestmentsError) throw new Error(`Error fetching existing investments: ${fetchInvestmentsError.message}`);
      
      const existingInvestmentIds = existingInvestments ? existingInvestments.map((i: any) => i.id) : [];
      const newInvestmentIds = investments.map(i => i.id);
      
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
      
      // Upsert all current investments - ensure each investment has a valid ID
      const investmentsToUpsert = investments.map(investment => ({
        id: investment.id || uuidv4(),
        user_id: userId,
        type: investment.type,
        name: investment.name,
        value: investment.value,
        annual_return: investment.annualReturn || null
      }));
      
      const { error: upsertInvestmentsError } = await supabase
        .from('investments')
        .upsert(investmentsToUpsert, { onConflict: 'id' });
        
      if (upsertInvestmentsError) throw new Error(`Error updating investments: ${upsertInvestmentsError.message}`);
      
    } catch (err) {
      console.error("Error handling investments:", err);
      throw err;
    }
  };

  const handleDebtDetails = async (userId: string, debtDetails: any[]) => {
    try {
      // Get existing debts
      const { data: existingDebts, error: fetchDebtsError } = await supabase
        .from('debt_details')
        .select('id')
        .eq('user_id', userId);
        
      if (fetchDebtsError) throw new Error(`Error fetching existing debts: ${fetchDebtsError.message}`);
      
      const existingDebtIds = existingDebts ? existingDebts.map((d: any) => d.id) : [];
      const newDebtIds = debtDetails.map(d => d.id);
      
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
      
      // Upsert all current debts - ensure each debt has a valid ID
      const debtsToUpsert = debtDetails.map(debt => ({
        id: debt.id || uuidv4(),
        user_id: userId,
        type: debt.type,
        name: debt.name,
        amount: debt.amount,
        interest_rate: debt.interestRate
      }));
      
      const { error: upsertDebtsError } = await supabase
        .from('debt_details')
        .upsert(debtsToUpsert, { onConflict: 'id' });
        
      if (upsertDebtsError) throw new Error(`Error updating debts: ${upsertDebtsError.message}`);
      
    } catch (err) {
      console.error("Error handling debt details:", err);
      throw err;
    }
  };

  return {
    loading,
    saveUserProfile
  };
}
