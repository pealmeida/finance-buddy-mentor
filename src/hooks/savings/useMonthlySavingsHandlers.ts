
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile, MonthlyAmount, MonthlySavings as MonthlySavingsType } from '@/types/finance';
import { MONTHS } from '@/constants/months';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to provide handlers for monthly savings UI interactions
 */
export const useMonthlySavingsHandlers = (
  profile: UserProfile,
  selectedYear: number,
  savingsData: MonthlyAmount[],
  setSavingsData: (data: MonthlyAmount[]) => void,
  checkAndRefreshAuth: () => Promise<boolean>,
  onSave: (updatedProfile: UserProfile) => void,
) => {
  const { toast } = useToast();
  const { saveMonthlySavings } = useMonthlySavings();
  const [editingMonth, setEditingMonth] = useState<number | null>(null);

  const handleSaveAmount = useCallback((month: number, amount: number) => {
    // Create a new array rather than mutating the existing one
    const updatedData = savingsData.map(item => 
      item.month === month ? { ...item, amount } : item
    );
    
    setSavingsData(updatedData);
    setEditingMonth(null);
    
    toast({
      title: "Savings Updated",
      description: `Your savings for ${MONTHS[month - 1]} have been updated.`
    });
  }, [savingsData, setSavingsData, toast]);

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
      
      console.log("Starting save process for monthly savings");
      // Use existing ID or generate a new one
      const monthlySavingsId = profile.monthlySavings?.id || uuidv4();
      
      const updatedSavings: MonthlySavingsType = {
        id: monthlySavingsId,
        userId: profile.id,
        year: selectedYear,
        data: savingsData
      };
      
      console.log("About to save monthly savings:", updatedSavings);
      
      // Save to Supabase
      const success = await saveMonthlySavings(updatedSavings);
      
      if (success) {
        console.log("Monthly savings saved successfully");
        
        // Update local state
        const updatedProfile = {
          ...profile,
          monthlySavings: updatedSavings
        };
        
        onSave(updatedProfile);
        
        toast({
          title: "Savings Saved",
          description: `Your savings data for ${selectedYear} has been saved successfully.`
        });
      } else {
        throw new Error("Failed to save data");
      }
    } catch (err) {
      console.error("Error saving savings data:", err);
      toast({
        title: "Error",
        description: "There was a problem saving your savings data. Please try again.",
        variant: "destructive"
      });
    }
  }, [checkAndRefreshAuth, onSave, profile, saveMonthlySavings, savingsData, selectedYear, toast]);

  return {
    editingMonth,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    setEditingMonth
  };
};
