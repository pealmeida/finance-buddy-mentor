
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile, MonthlyAmount, MonthlyExpenses as MonthlyExpensesType } from '@/types/finance';
import { MONTHS } from '@/constants/months';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to provide handlers for monthly expenses UI interactions
 */
export const useMonthlyExpensesHandlers = (
  profile: UserProfile,
  selectedYear: number,
  expensesData: MonthlyAmount[],
  setExpensesData: (data: MonthlyAmount[]) => void,
  checkAndRefreshAuth: () => Promise<boolean>,
  onSave: (updatedProfile: UserProfile) => void,
) => {
  const { toast } = useToast();
  const { saveMonthlyExpenses } = useMonthlyExpenses();
  const [editingMonth, setEditingMonth] = useState<number | null>(null);

  const handleSaveAmount = useCallback((month: number, amount: number) => {
    // Create a new array rather than mutating the existing one
    const updatedData = expensesData.map(item => 
      item.month === month ? { ...item, amount } : item
    );
    
    setExpensesData(updatedData);
    setEditingMonth(null);
    
    toast({
      title: "Expenses Updated",
      description: `Your expenses for ${MONTHS[month - 1]} have been updated.`
    });
  }, [expensesData, setExpensesData, toast]);

  const handleEditMonth = useCallback((month: number) => {
    setEditingMonth(month);
  }, []);

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
      
      const updatedExpenses: MonthlyExpensesType = {
        id: monthlyExpensesId,
        userId: profile.id,
        year: selectedYear,
        data: expensesData
      };
      
      console.log("About to save monthly expenses:", updatedExpenses);
      
      // Save to Supabase
      const success = await saveMonthlyExpenses(updatedExpenses);
      
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
  }, [checkAndRefreshAuth, onSave, profile, saveMonthlyExpenses, expensesData, selectedYear, toast]);

  return {
    editingMonth,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    setEditingMonth
  };
};
