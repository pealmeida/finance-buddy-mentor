import { useState, useCallback, useEffect } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { initializeEmptySavingsData, ensureCompleteSavingsData } from '@/hooks/supabase/utils/savingsUtils';

export const useMonthlySavingsState = (
  profile: UserProfile,
  onSave: (updatedProfile: UserProfile) => void,
  isSaving = false
) => {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    monthlySavingsData,
    error: fetchError,
    saveMonthlySavings,
  } = useMonthlySavings(profile.id, selectedYear);

  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>(
    monthlySavingsData ? ensureCompleteSavingsData(monthlySavingsData.data) : initializeEmptySavingsData()
  );

  // Handle year change
  const handleYearChange = useCallback((year: number) => {
    console.log("Year changed to:", year);
    setSelectedYear(year);
    setEditingMonth(null);
  }, []);

  // Handle editing a month
  const handleEditMonth = useCallback((month: number) => {
    setEditingMonth(month);
  }, []);

  // Handle saving a month's amount
  const handleSaveAmount = useCallback((month: number, amount: number) => {
    console.log("Saving amount for month:", month, "amount:", amount);
    setSavingsData(prev =>
      prev.map(item => item.month === month ? { ...item, amount } : item)
    );
    setEditingMonth(null);
  }, []);

  // Handle saving all data
  const handleSaveAll = useCallback(async () => {
    if (!profile?.id) {
      toast({
        title: "Cannot Save",
        description: "User profile is not available",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Saving all savings data for user:", profile.id, "year:", selectedYear);
      const monthlySavingsId = profile.monthlySavings?.id || uuidv4();

      const success = await saveMonthlySavings({
        id: monthlySavingsId,
        userId: profile.id,
        year: selectedYear,
        data: savingsData
      });

      if (success && onSave) {
        console.log("Savings data saved successfully");
        onSave({
          ...profile,
          monthlySavings: {
            id: monthlySavingsId,
            userId: profile.id,
            year: selectedYear,
            data: savingsData
          }
        });

        toast({
          title: "Savings Saved",
          description: `Your savings data for ${selectedYear} has been saved successfully.`
        });
      } else if (!success) {
        console.error("Failed to save savings data");
        toast({
          title: "Save Error",
          description: "Failed to save your savings data. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error saving savings data:", err);
      toast({
        title: "Save Error",
        description: "Could not save your savings data. Please try again.",
        variant: "destructive"
      });
    }
  }, [profile, selectedYear, savingsData, saveMonthlySavings, onSave, toast]);

  // useEffect to sync React Query data with local state
  useEffect(() => {
    if (monthlySavingsData) {
      setSavingsData(ensureCompleteSavingsData(monthlySavingsData.data));
    } else {
      setSavingsData(initializeEmptySavingsData());
    }
  }, [monthlySavingsData]);

  return {
    selectedYear,
    savingsData,
    editingMonth,
    error: fetchError,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    handleYearChange,
    setEditingMonth
  };
};
