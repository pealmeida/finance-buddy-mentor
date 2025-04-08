
import React, { useState, useEffect } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import YearSelector from './YearSelector';
import MonthlySavingsContent from './MonthlySavingsContent';
import MonthlySavingsForm from './MonthlySavingsForm';
import { v4 as uuidv4 } from 'uuid';
import { initializeEmptySavingsData, ensureCompleteSavingsData } from '@/hooks/supabase/utils/savingsUtils';

interface MonthlySavingsProps {
  profile: UserProfile;
  onSave?: (updatedProfile: UserProfile) => void;
  isSaving?: boolean;
}

const MonthlySavings: React.FC<MonthlySavingsProps> = ({
  profile,
  onSave,
  isSaving = false
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>(initializeEmptySavingsData());
  const { toast } = useToast();
  
  const {
    loading,
    error,
    fetchMonthlySavings,
    saveMonthlySavings
  } = useMonthlySavings();

  // Fetch savings data when component mounts or year changes
  useEffect(() => {
    const loadSavingsData = async () => {
      if (!profile?.id) return;
      
      try {
        const savedData = await fetchMonthlySavings(profile.id, selectedYear);
        
        if (savedData && savedData.data) {
          console.log("Setting savings data from fetch:", savedData.data);
          // Ensure data is complete and in the right format
          const completeData = ensureCompleteSavingsData(savedData.data);
          setSavingsData(completeData);
        } else {
          console.log("No saved data found, initializing empty data");
          setSavingsData(initializeEmptySavingsData());
        }
      } catch (err) {
        console.error("Error loading savings data:", err);
        toast({
          title: "Error",
          description: "Failed to load savings data. Please try refreshing.",
          variant: "destructive"
        });
        setSavingsData(initializeEmptySavingsData());
      }
    };
    
    loadSavingsData();
  }, [profile?.id, selectedYear, fetchMonthlySavings, toast]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setEditingMonth(null);
  };

  const handleEditMonth = (month: number) => {
    setEditingMonth(month);
  };

  const handleSaveAmount = (month: number, amount: number) => {
    setSavingsData(prev => 
      prev.map(item => item.month === month ? { ...item, amount } : item)
    );
    setEditingMonth(null);
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
      const monthlySavingsId = profile.monthlySavings?.id || uuidv4();
      
      const success = await saveMonthlySavings({
        id: monthlySavingsId,
        userId: profile.id,
        year: selectedYear,
        data: savingsData
      });
      
      if (success && onSave) {
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
  };

  const handleRefresh = async () => {
    if (!profile?.id) return;
    
    try {
      const savedData = await fetchMonthlySavings(profile.id, selectedYear);
      
      if (savedData && savedData.data) {
        const completeData = ensureCompleteSavingsData(savedData.data);
        setSavingsData(completeData);
        
        toast({
          title: "Data Refreshed",
          description: "Your savings data has been refreshed successfully."
        });
      } else {
        setSavingsData(initializeEmptySavingsData());
        toast({
          title: "No Data Found",
          description: "No savings data was found for the selected year."
        });
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      toast({
        title: "Refresh Error",
        description: "Failed to refresh savings data. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!profile || !profile.id) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          User profile is not available. Please log in to view your savings data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Monthly Savings</h2>
          <p className="text-gray-600">
            Track your monthly savings to visualize your progress throughout the year.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            disabled={loading || isSaving}
          />
          
          <Button
            onClick={handleSaveAll}
            disabled={loading || isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save All
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>
      
      <MonthlySavingsContent
        loadingData={loading}
        savingsData={savingsData}
        editingMonth={editingMonth}
        onEditMonth={handleEditMonth}
        onSaveAmount={handleSaveAmount}
        onCancelEdit={() => setEditingMonth(null)}
        onRefresh={handleRefresh}
        error={error}
      />
    </div>
  );
};

export default MonthlySavings;
