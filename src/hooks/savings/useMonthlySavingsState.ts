import { useState, useCallback, useEffect } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { initializeEmptySavingsData, ensureCompleteSavingsData } from '@/hooks/supabase/utils/savingsUtils';

export const useMonthlySavingsState = (
  profile: UserProfile,
  onSave: (updatedProfile: UserProfile) => void,
  isSaving = false
) => {
  const { toast } = useToast();
  const { t } = useTranslation();
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

  // Function to automatically calculate savings for a specific month
  const calculateSavingsForMonth = useCallback((month: number, monthlyExpenses: MonthlyAmount[]): number => {
    if (!profile.monthlyIncome || profile.monthlyIncome <= 0) {
      return 0; // No income data, return 0
    }

    // Find expenses for the specific month
    const monthExpenses = monthlyExpenses.find(expense => expense.month === month);
    const monthExpenseAmount = monthExpenses?.amount || 0;

    // Calculate savings: income - expenses (ensure non-negative)
    return Math.max(0, profile.monthlyIncome - monthExpenseAmount);
  }, [profile.monthlyIncome]);

  // Function to auto-calculate savings for a specific month when it has detailed expenses
  const autoCalculateMonthSavings = useCallback(async (month: number, monthlyExpenses: MonthlyAmount[]) => {
    if (!profile.monthlyIncome || profile.monthlyIncome <= 0) {
      console.log("No monthly income available for auto-calculation");
      return;
    }

    // Find the specific month data
    const monthData = monthlyExpenses.find(expense => expense.month === month);

    // Only auto-calculate if the month has at least one detailed expense item
    if (!monthData || !monthData.items || monthData.items.length === 0) {
      console.log(`Month ${month} has no detailed expenses, skipping auto-calculation`);
      return;
    }

    console.log(`Auto-calculating savings for month ${month} with ${monthData.items.length} expense items`);

    const calculatedAmount = calculateSavingsForMonth(month, monthlyExpenses);

    // Update only this specific month's savings
    const updatedSavingsData = savingsData.map(savingsMonth => {
      if (savingsMonth.month === month) {
        return {
          ...savingsMonth,
          amount: calculatedAmount
        };
      }
      return savingsMonth;
    });

    setSavingsData(updatedSavingsData);

    // Save the updated data
    const monthlySavingsId = profile.monthlySavings?.id || uuidv4();

    const success = await saveMonthlySavings({
      id: monthlySavingsId,
      userId: profile.id,
      year: selectedYear,
      data: updatedSavingsData
    });

    if (success && onSave) {
      onSave({
        ...profile,
        monthlySavings: {
          id: monthlySavingsId,
          userId: profile.id,
          year: selectedYear,
          data: updatedSavingsData
        }
      });

      toast({
        title: t("common.success", "Success"),
        description: t("savings.autoCalculatedSuccess", "Monthly savings auto-calculated and updated!"),
      });
    }
  }, [profile, selectedYear, savingsData, calculateSavingsForMonth, saveMonthlySavings, onSave, toast, t]);

  // Function to get months that have detailed expenses
  const getMonthsWithDetailedExpenses = useCallback((monthlyExpenses: MonthlyAmount[]): number[] => {
    return monthlyExpenses
      .filter(monthData => monthData.items && monthData.items.length > 0)
      .map(monthData => monthData.month);
  }, []);

  // Handle saving a month's amount
  const handleSaveAmount = useCallback(async (month: number, amount: number) => {
    let updatedSavingsData: MonthlyAmount[] = [];
    setSavingsData(prev => {
      const newState = prev.map(item => item.month === month ? { ...item, amount } : item);
      updatedSavingsData = newState;
      return newState;
    });
    setEditingMonth(null);

    if (!profile?.id) {
      toast({
        title: "Error",
        description: "User profile not found. Unable to save.",
        variant: "destructive",
      });
      return;
    }
    const monthlySavingsId = profile.monthlySavings?.id || uuidv4();
    console.log("savingsData before sending to saveMonthlySavings:", JSON.stringify(updatedSavingsData, null, 2));

    const success = await saveMonthlySavings({
      id: monthlySavingsId,
      userId: profile.id,
      year: selectedYear,
      data: updatedSavingsData
    });
    if (success && onSave) {
      onSave({
        ...profile,
        monthlySavings: {
          id: monthlySavingsId,
          userId: profile.id,
          year: selectedYear,
          data: updatedSavingsData
        }
      });

      toast({
        title: "Success",
        description: "Monthly savings updated successfully!",
      });
    }
  }, [profile, selectedYear, saveMonthlySavings, onSave, toast]);

  // Handle year change
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    setEditingMonth(null);
  }, []);

  // Handle editing a month
  const handleEditMonth = useCallback((month: number) => {
    setEditingMonth(month);
  }, []);

  // useEffect to sync React Query data with local state
  useEffect(() => {
    if (monthlySavingsData) {
      setSavingsData(ensureCompleteSavingsData(monthlySavingsData.data));
    } else {
      setSavingsData(initializeEmptySavingsData());
    }
  }, [monthlySavingsData]);

  // Auto-calculate savings for specific months when they have detailed expenses
  useEffect(() => {
    const monthlyExpenses = profile.monthlyExpenses?.data;

    if (monthlyExpenses && monthlyExpenses.length > 0 && profile.monthlyIncome && profile.monthlyIncome > 0) {
      // Get months that have detailed expenses
      const monthsWithExpenses = getMonthsWithDetailedExpenses(monthlyExpenses);

      if (monthsWithExpenses.length > 0) {
        console.log(`Months with detailed expenses detected: ${monthsWithExpenses.join(', ')}`);

        // Auto-calculate for each month that has detailed expenses
        monthsWithExpenses.forEach(month => {
          autoCalculateMonthSavings(month, monthlyExpenses);
        });
      }
    }
  }, [profile.monthlyExpenses?.data, profile.monthlyIncome, autoCalculateMonthSavings, getMonthsWithDetailedExpenses]);

  return {
    selectedYear,
    savingsData,
    editingMonth,
    error: fetchError,
    handleSaveAmount,
    handleEditMonth,
    handleYearChange,
    setEditingMonth,
    autoCalculateMonthSavings
  };
};
