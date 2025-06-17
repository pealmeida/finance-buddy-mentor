
import { useState } from 'react';
import { UserProfile, DebtDetail } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useProfileSaving = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveProfile = async (profile: UserProfile): Promise<boolean> => {
    try {
      setIsSaving(true);

      // Save basic profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          name: profile.name || 'User',
          email: profile.email || 'user@example.com',
          age: profile.age || 0
        });

      if (profileError) {
        throw new Error(`Profile save error: ${profileError.message}`);
      }

      // Save financial profile information
      const { error: financialError } = await supabase
        .from('financial_profiles')
        .upsert({
          id: profile.id,
          monthly_income: profile.monthlyIncome || 0,
          risk_profile: profile.riskProfile || 'moderate',
          has_emergency_fund: profile.hasEmergencyFund || false,
          emergency_fund_months: profile.emergencyFundMonths,
          has_debts: profile.hasDebts || false
        });

      if (financialError) {
        throw new Error(`Financial profile save error: ${financialError.message}`);
      }

      // Save debt details if they exist
      if (profile.debtDetails && profile.debtDetails.length > 0) {
        // First delete existing debt details
        await supabase
          .from('debt_details')
          .delete()
          .eq('user_id', profile.id);

        // Then insert new debt details
        const debtDetailsToInsert = profile.debtDetails.map((debt: DebtDetail) => ({
          user_id: profile.id,
          type: debt.type,
          amount: debt.amount,
          interest_rate: debt.interestRate,
          minimum_payment: debt.minimumPayment
        }));

        const { error: debtError } = await supabase
          .from('debt_details')
          .insert(debtDetailsToInsert);

        if (debtError) {
          throw new Error(`Debt details save error: ${debtError.message}`);
        }
      }

      toast({
        title: "Profile Saved",
        description: "Your profile has been successfully updated.",
      });

      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save Error",
        description: error instanceof Error ? error.message : "Failed to save profile",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveProfile,
    isSaving
  };
};
