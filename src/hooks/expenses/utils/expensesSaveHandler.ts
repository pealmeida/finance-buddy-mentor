
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile, MonthlyAmount, MonthlyExpenses } from '@/types/finance';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { toast } from "@/components/ui/use-toast";
import { initializeEmptyExpensesData, ensureCompleteExpensesData } from './expensesDataUtils';

/**
 * Hook to handle saving expenses data
 * Improved with better error handling and data validation
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
        console.error("Cannot save expenses: No user profile");
        toast({
          title: "Not Logged In",
          description: "Please log in to save your data.",
          variant: "destructive"
        });
        return;
      }
      
      // Refresh auth token before saving
      console.log("Checking authentication before saving expenses");
      const isAuthenticated = await checkAndRefreshAuth();
      if (!isAuthenticated) {
        console.error("Authentication failed during save attempt");
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
      
      // Ensure we have a complete data set with all 12 months
      let dataToSave = expensesData;
      
      // Validate the data before saving
      if (!Array.isArray(dataToSave) || dataToSave.length !== 12) {
        console.log("Incomplete expenses data, ensuring all months are included");
        dataToSave = ensureCompleteExpensesData(dataToSave);
      }
      
      // Validate each entry
      dataToSave = dataToSave.map(item => ({
        month: Number(item.month) || 0,
        amount: Number(item.amount) || 0
      }));
      
      // Double-check months and sort
      dataToSave = dataToSave
        .filter(item => item.month >= 1 && item.month <= 12)
        .sort((a, b) => a.month - b.month);
      
      // If we still don't have 12 months, start fresh
      if (dataToSave.length !== 12) {
        console.log("Data still incomplete after validation, creating complete data set");
        const completeData = initializeEmptyExpensesData();
        
        // Overlay any existing valid data
        dataToSave.forEach(item => {
          if (item.month >= 1 && item.month <= 12) {
            completeData[item.month - 1] = item;
          }
        });
        
        dataToSave = completeData;
      }
      
      // Create the updated expenses object
      const updatedExpenses: MonthlyExpenses = {
        id: monthlyExpensesId,
        userId: profile.id,
        year: selectedYear,
        data: dataToSave
      };

      console.log("About to save monthly expenses:", updatedExpenses);
      
      // Save to Supabase
      const success = await saveMonthlyExpenses({
        id: updatedExpenses.id,
        userId: updatedExpenses.userId,
        year: updatedExpenses.year,
        data: updatedExpenses.data
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
