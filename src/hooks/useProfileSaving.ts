
import { useState } from 'react';
import { UserProfile, RiskProfile } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Helper function to validate risk profile type
const validateRiskProfile = (profile: string | undefined): RiskProfile => {
  if (profile === 'conservative' || profile === 'moderate' || profile === 'aggressive') {
    return profile as RiskProfile;
  }
  return 'moderate'; // Default to moderate if invalid value
};

export function useProfileSaving() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const saveProfileToSupabase = async (profile: UserProfile): Promise<boolean> => {
    try {
      const { id: userId, email, name, age } = profile;
      
      if (!userId) {
        throw new Error("Profile must have a valid ID");
      }
      
      console.log('Saving profile for user:', userId);
      console.log('Profile data:', profile);
      
      // Validate important profile data
      if (!name) throw new Error("Name is required");
      if (!email) throw new Error("Email is required");
      if (!profile.riskProfile) throw new Error("Risk profile is required");
      
      // Ensure riskProfile is a valid RiskProfile type
      const validRiskProfile = validateRiskProfile(profile.riskProfile);
      
      // Upsert basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          name, 
          email,
          age: age || 0
        }, {
          onConflict: 'id'
        });
      
      if (profileError) throw new Error(`Error saving profile: ${profileError.message}`);
      console.log('Basic profile saved successfully');
      
      // Upsert financial profile
      const { error: financialProfileError } = await supabase
        .from('financial_profiles')
        .upsert({
          id: userId,
          monthly_income: profile.monthlyIncome || 0,
          risk_profile: validRiskProfile,
          has_emergency_fund: profile.hasEmergencyFund,
          emergency_fund_months: profile.emergencyFundMonths,
          has_debts: profile.hasDebts
        }, {
          onConflict: 'id'
        });
      
      if (financialProfileError) throw new Error(`Error saving financial profile: ${financialProfileError.message}`);
      console.log('Financial profile saved successfully');
      
      // Handle financial goals
      if (profile.financialGoals && profile.financialGoals.length > 0) {
        // First delete existing goals to avoid duplications
        const { error: deleteGoalsError } = await supabase
          .from('financial_goals')
          .delete()
          .eq('user_id', userId);
        
        if (deleteGoalsError) throw new Error(`Error clearing existing goals: ${deleteGoalsError.message}`);
        
        // Now insert new goals
        const goalsToInsert = profile.financialGoals.map(goal => ({
          id: goal.id,
          user_id: userId,
          name: goal.name,
          priority: goal.priority,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          target_date: goal.targetDate instanceof Date 
            ? goal.targetDate.toISOString().split('T')[0] 
            : new Date(goal.targetDate).toISOString().split('T')[0]
        }));
        
        const { error: goalsError } = await supabase
          .from('financial_goals')
          .insert(goalsToInsert);
        
        if (goalsError) throw new Error(`Error saving financial goals: ${goalsError.message}`);
        console.log('Financial goals saved successfully');
      }
      
      // Handle investments
      if (profile.investments && profile.investments.length > 0) {
        // First delete existing investments
        const { error: deleteInvestmentsError } = await supabase
          .from('investments')
          .delete()
          .eq('user_id', userId);
        
        if (deleteInvestmentsError) throw new Error(`Error clearing existing investments: ${deleteInvestmentsError.message}`);
        
        // Now insert new investments
        const investmentsToInsert = profile.investments.map(investment => ({
          id: investment.id,
          user_id: userId,
          type: investment.type,
          name: investment.name,
          value: investment.value,
          annual_return: investment.annualReturn
        }));
        
        const { error: investmentsError } = await supabase
          .from('investments')
          .insert(investmentsToInsert);
        
        if (investmentsError) throw new Error(`Error saving investments: ${investmentsError.message}`);
        console.log('Investments saved successfully');
      }
      
      // Handle debt details
      if (profile.debtDetails && profile.debtDetails.length > 0) {
        // First delete existing debt details
        const { error: deleteDebtDetailsError } = await supabase
          .from('debt_details')
          .delete()
          .eq('user_id', userId);
        
        if (deleteDebtDetailsError) throw new Error(`Error clearing existing debt details: ${deleteDebtDetailsError.message}`);
        
        // Now insert new debt details
        const debtDetailsToInsert = profile.debtDetails.map(debt => ({
          id: debt.id,
          user_id: userId,
          type: debt.type,
          name: debt.name,
          amount: debt.amount,
          interest_rate: debt.interestRate
        }));
        
        const { error: debtDetailsError } = await supabase
          .from('debt_details')
          .insert(debtDetailsToInsert);
        
        if (debtDetailsError) throw new Error(`Error saving debt details: ${debtDetailsError.message}`);
        console.log('Debt details saved successfully');
      }
      
      return true;
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw error;
    }
  };

  const saveProfile = async (profile: UserProfile): Promise<boolean> => {
    setIsSaving(true);
    try {
      return await saveProfileToSupabase(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving profile",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveProfile, isSaving };
}
