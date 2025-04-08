
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile, MonthlyAmount, MonthlyExpenses } from '@/types/finance';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { toast } from "@/components/ui/use-toast";
import { convertExpensesDataToJson } from './expensesDataUtils';

/**
 * Hook to handle saving expenses data
 */
export const useExpensesSaveHandler = (
  profile: UserProfile,
  selectedYear: number,
  expensesData: MonthlyAmount[],
  checkAndRefreshAuth: () => Promise<boolean>,
  onSave: (updatedProfile: UserProfile) => void
) => {
  const { saveMonthlyExpenses } = useMonthlyExpenses();

  // Handle saving all expenses data
  const handleSaveAll = useCallback(async () => {
    try {
      if (!profile || !profile.id) {
        toast({
          title: "Not Logged In",
          description: "Please log in to save your data.",
          variant: "destructive"
        });
        return;
      }
      
      // Refresh auth token before saving
      const isAuthenticated = await checkAndRefreshAuth();
      if (!isAuthenticated) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Starting save process for monthly expenses");
      // Use existing ID or generate a new one
      const monthlyExpensesId = profile.monthlyExpenses?.id || uuidv4();
      
      // Convert expenses data to JSON for Supabase
      const jsonData = convertExpensesDataToJson(expensesData);
      
      const updatedExpenses: MonthlyExpenses = {
        id: monthlyExpensesId,
        userId: profile.id,
        year: selectedYear,
        data: expensesData
      };
      
      console.log("About to save monthly expenses:", updatedExpenses);
      
      // Save to Supabase with properly converted data
      const success = await saveMonthlyExpenses({
        id: updatedExpenses.id,
        userId: updatedExpenses.userId,
        year: updatedExpenses.year,
        data: jsonData
      });
      
      if (success) {
        console.log("Monthly expenses saved successfully");
        
        // Update local state
        const updatedProfile = {
          ...profile,
          monthlyExpenses: updatedExpenses
        };
        
        onSave(updatedProfile);
        toast({
          title: "Expenses Saved",
          description: `Your expenses data for ${selectedYear} has been saved successfully.`
        });
      } else {
        throw new Error("Failed to save data");
      }
    } catch (err) {
      console.error("Error saving expenses data:", err);
      toast({
        title: "Error",
        description: "There was a problem saving your expenses data. Please try again.",
        variant: "destructive"
      });
    }
  }, [
    checkAndRefreshAuth, 
    onSave, 
    profile, 
    saveMonthlyExpenses, 
    expensesData, 
    selectedYear
  ]);

  return {
    handleSaveAll
  };
};
