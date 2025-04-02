
import { useState, useEffect, useCallback } from 'react';
import { UserProfile, MonthlyAmount, MonthlySavings as MonthlySavingsType } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { MONTHS } from '@/constants/months';

export const useMonthlySavingsState = (
  profile: UserProfile,
  onSave: (updatedProfile: UserProfile) => void,
  isSaving = false
) => {
  const { toast } = useToast();
  const { fetchMonthlySavings, saveMonthlySavings, loading: savingsLoading } = useMonthlySavings();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>([]);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Initialize savings data from profile or create empty data
  const initializeEmptyData = useCallback(() => {
    // Initialize empty data for all months
    const initialData: MonthlyAmount[] = MONTHS.map((_, index) => ({
      month: index + 1,
      amount: 0
    }));
    setSavingsData(initialData);
  }, []);

  // Authentication check
  useEffect(() => {
    if (!profile?.id) {
      setError("Authentication required. Please log in.");
      setAuthChecked(true);
      setLoadingData(false);
      initializeEmptyData();
    } else {
      setAuthChecked(true);
    }
  }, [profile?.id, initializeEmptyData]);

  // Fetch data when year changes or auth is confirmed
  useEffect(() => {
    if (!authChecked || !profile?.id) return;

    const fetchData = async () => {
      // Reset state at the beginning of the fetch
      setLoadingData(true);
      setError(null);
      
      try {
        console.log(`Fetching monthly savings for user ${profile.id} and year ${selectedYear}`);
        // Try to fetch data from Supabase
        const savedData = await fetchMonthlySavings(profile.id, selectedYear);
        
        if (savedData && savedData.data) {
          console.log("Setting savings data from fetch:", savedData.data);
          setSavingsData(savedData.data);
          
          // Update profile with fetched data if needed
          const existingData = profile.monthlySavings?.data || [];
          if (JSON.stringify(savedData.data) !== JSON.stringify(existingData)) {
            const updatedMonthlySavings: MonthlySavingsType = {
              id: savedData.id,
              userId: profile.id,
              year: selectedYear,
              data: savedData.data
            };
            
            const updatedProfile = {
              ...profile,
              monthlySavings: updatedMonthlySavings
            };
            
            onSave(updatedProfile);
          }
        } else {
          console.log("No saved data found, initializing empty data");
          initializeEmptyData();
        }
      } catch (err) {
        console.error("Error fetching savings data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast({
          title: "Error",
          description: "Failed to load savings data. Please try again.",
          variant: "destructive"
        });
        initializeEmptyData();
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [profile?.id, selectedYear, authChecked, fetchMonthlySavings, initializeEmptyData, onSave, profile, toast]);

  const handleSaveAmount = (month: number, amount: number) => {
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
  };

  const handleEditMonth = (month: number) => {
    setEditingMonth(month);
  };

  const handleSaveAll = async () => {
    try {
      if (!profile || !profile.id) {
        toast({
          title: "Not Logged In",
          description: "Please log in to save your data.",
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
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast({
        title: "Error",
        description: "There was a problem saving your savings data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setEditingMonth(null);
    // The data fetching will be triggered by the useEffect
  };

  return {
    selectedYear,
    savingsData,
    editingMonth,
    loadingData,
    savingsLoading,
    error,
    authChecked,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    handleYearChange,
    setEditingMonth
  };
};
