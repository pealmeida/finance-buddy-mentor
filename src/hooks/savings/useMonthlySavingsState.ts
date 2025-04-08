
import { useState, useCallback } from 'react';
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
  const { 
    loading,
    error: fetchError,
    fetchMonthlySavings,
    saveMonthlySavings,
  } = useMonthlySavings();
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>(initializeEmptySavingsData());
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load savings data when component mounts or year changes
  const loadSavingsData = useCallback(async () => {
    if (!profile?.id) {
      console.log("No profile ID available, cannot fetch savings data");
      setLoadingData(false);
      return;
    }
    
    setLoadingData(true);
    
    try {
      console.log(`Fetching monthly savings for user: ${profile.id}, year: ${selectedYear}`);
      const savedData = await fetchMonthlySavings(profile.id, selectedYear);
      
      if (savedData && savedData.data) {
        console.log("Setting savings data from fetch:", savedData.data);
        // Ensure data is complete and in the right format
        const completeData = ensureCompleteSavingsData(savedData.data);
        setSavingsData(completeData);
        console.log("Savings data set successfully:", completeData);
      } else {
        console.log("No saved data found, initializing empty data");
        setSavingsData(initializeEmptySavingsData());
      }
    } catch (err) {
      console.error("Error loading savings data:", err);
      setError(err instanceof Error ? err.message : "Failed to load savings data");
      toast({
        title: "Data Loading Error",
        description: "Could not load your savings data. Using empty values instead.",
        variant: "destructive"
      });
      setSavingsData(initializeEmptySavingsData());
    } finally {
      setLoadingData(false);
    }
  }, [fetchMonthlySavings, profile?.id, selectedYear, toast]);

  // Handle year change
  const handleYearChange = useCallback((year: number) => {
    console.log("Year changed to:", year);
    setSelectedYear(year);
    setEditingMonth(null);
    loadSavingsData();
  }, [loadSavingsData]);

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

  // Handle refreshing data
  const refreshData = useCallback(async () => {
    await loadSavingsData();
  }, [loadSavingsData]);

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

  return {
    selectedYear,
    savingsData,
    editingMonth,
    loadingData,
    savingsLoading: loading,
    error: error || fetchError,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    handleYearChange,
    refreshData,
    setEditingMonth
  };
};
