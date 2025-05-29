
import React, { useState, useEffect } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import MonthlyExpensesHeader from './MonthlyExpensesHeader';
import MonthlyExpensesContent from './MonthlyExpensesContent';
import { initializeEmptyExpensesData, ensureCompleteExpensesData } from '@/hooks/expenses/utils/expensesDataUtils';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface MonthlyExpensesProps {
  profile: UserProfile;
  onSave?: (updatedProfile: UserProfile) => void;
  isSaving?: boolean;
}

const MonthlyExpenses: React.FC<MonthlyExpensesProps> = ({
  profile,
  onSave,
  isSaving = false
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [expensesData, setExpensesData] = useState<MonthlyAmount[]>(initializeEmptyExpensesData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    expensesLoading,
    fetchMonthlyExpenses,
    saveMonthlyExpenses
  } = useMonthlyExpenses();

  // Fetch expenses data when component mounts or year changes
  useEffect(() => {
    const loadExpensesData = async () => {
      if (!profile?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching expenses data for user:", profile.id, "year:", selectedYear);
        const savedData = await fetchMonthlyExpenses(profile.id, selectedYear);
        
        if (savedData && savedData.data) {
          console.log("Setting expenses data from fetch:", savedData.data);
          // Ensure data is complete and in the right format
          const completeData = ensureCompleteExpensesData(savedData.data);
          setExpensesData(completeData);
        } else {
          console.log("No expenses data found, initializing empty data");
          setExpensesData(initializeEmptyExpensesData());
        }
      } catch (err) {
        console.error("Error loading expenses data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setExpensesData(initializeEmptyExpensesData());
        
        toast({
          title: "Data Loading Error",
          description: "Could not load your expenses data. Using empty values instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadExpensesData();
  }, [profile?.id, selectedYear, fetchMonthlyExpenses, toast]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleSaveAll = async () => {
    if (!profile?.id) {
      toast({
        title: "Cannot Save",
        description: "User profile is not available",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const monthlyExpensesId = profile.monthlyExpenses?.id || uuidv4();
      
      const success = await saveMonthlyExpenses({
        id: monthlyExpensesId,
        userId: profile.id,
        year: selectedYear,
        data: expensesData
      });
      
      if (success && onSave) {
        onSave({
          ...profile,
          monthlyExpenses: {
            id: monthlyExpensesId,
            userId: profile.id,
            year: selectedYear,
            data: expensesData
          }
        });
        
        toast({
          title: "Expenses Saved",
          description: `Your expenses data for ${selectedYear} has been saved successfully.`
        });
      } else if (!success) {
        toast({
          title: "Save Error",
          description: "Failed to save your expenses data. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error saving expenses data:", err);
      toast({
        title: "Save Error",
        description: "Could not save your expenses data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const savedData = await fetchMonthlyExpenses(profile.id, selectedYear);
      
      if (savedData && savedData.data) {
        const completeData = ensureCompleteExpensesData(savedData.data);
        setExpensesData(completeData);
        
        toast({
          title: "Data Refreshed",
          description: "Your expenses data has been refreshed successfully."
        });
      } else {
        setExpensesData(initializeEmptyExpensesData());
        toast({
          title: "No Data Found",
          description: "No expenses data was found for the selected year."
        });
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      toast({
        title: "Refresh Error",
        description: "Failed to refresh expenses data. Please try again.",
        variant: "destructive"
      });
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!profile || !profile.id) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          User profile is not available. Please log in to view your expenses data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <MonthlyExpensesHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        onSaveAll={handleSaveAll}
        disabled={loading || isSaving || expensesLoading}
        isSaving={isSaving}
      />
      
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <span className="ml-2">Loading expenses data...</span>
        </div>
      ) : (
        <MonthlyExpensesContent
          loadingData={loading}
          expensesData={expensesData}
          onRefresh={handleRefresh}
          error={error}
        />
      )}
    </div>
  );
};

export default MonthlyExpenses;
