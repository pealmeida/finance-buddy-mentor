
import { useState, useEffect } from 'react';
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
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize savings data from profile or create empty data
  useEffect(() => {
    const fetchData = async () => {
      // If user is not logged in or doesn't have an ID yet, initialize with empty data
      if (!profile || !profile.id) {
        console.log("No profile ID available, initializing empty data");
        initializeEmptyData();
        setError("Authentication required. Please log in.");
        return;
      }
      
      setLoadingData(true);
      setError(null);
      
      try {
        console.log(`Attempting to fetch monthly savings for user ${profile.id} and year ${selectedYear}`);
        // Try to fetch data from Supabase
        const savedData = await fetchMonthlySavings(profile.id, selectedYear);
        
        if (savedData) {
          console.log("Setting savings data from fetch:", savedData.data);
          setSavingsData(savedData.data);
          
          // Update profile with fetched data
          if (JSON.stringify(savedData.data) !== JSON.stringify(profile.monthlySavings?.data)) {
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
  }, [profile?.id, selectedYear]);

  const initializeEmptyData = () => {
    // Initialize empty data for all months
    const initialData: MonthlyAmount[] = MONTHS.map((_, index) => ({
      month: index + 1,
      amount: 0
    }));
    setSavingsData(initialData);
  };

  const handleSaveAmount = (month: number, amount: number) => {
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
  };

  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
    setEditingMonth(null);
  };

  return {
    selectedYear,
    savingsData,
    editingMonth,
    loadingData,
    savingsLoading,
    error,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    handleYearChange,
    setEditingMonth
  };
};
