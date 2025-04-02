
import React, { useState, useEffect } from 'react';
import { UserProfile, MonthlySavings as MonthlySavingsType, MonthlyAmount } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import MonthlySavingsChart from './MonthlySavingsChart';
import MonthlySavingsForm from './MonthlySavingsForm';
import { v4 as uuidv4 } from 'uuid';
import { CircleDollarSign, Save } from 'lucide-react';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';

interface MonthlySavingsProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  isSaving?: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthlySavings: React.FC<MonthlySavingsProps> = ({
  profile,
  onSave,
  isSaving = false
}) => {
  const { toast } = useToast();
  const { fetchMonthlySavings, saveMonthlySavings, loading: savingsLoading } = useMonthlySavings();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>([]);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Initialize savings data from profile or create empty data
  useEffect(() => {
    const fetchData = async () => {
      // If user is not logged in or doesn't have an ID yet, initialize with empty data
      if (!profile.id) {
        initializeEmptyData();
        return;
      }
      
      setLoadingData(true);
      try {
        // Try to fetch data from Supabase
        const savedData = await fetchMonthlySavings(profile.id, selectedYear);
        
        if (savedData) {
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
          initializeEmptyData();
        }
      } catch (err) {
        console.error("Error fetching savings data:", err);
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
  }, [profile.id, selectedYear]);

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
      if (!profile.id) {
        toast({
          title: "Not Logged In",
          description: "Please log in to save your data.",
          variant: "destructive"
        });
        return;
      }
      
      const monthlySavingsId = profile.monthlySavings?.id || uuidv4();
      
      const updatedSavings: MonthlySavingsType = {
        id: monthlySavingsId,
        userId: profile.id,
        year: selectedYear,
        data: savingsData
      };
      
      // Save to Supabase
      const success = await saveMonthlySavings(updatedSavings);
      
      if (success) {
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
    
    // When changing year, data will be fetched in useEffect
    // This ensures we get fresh data from the server for the new year
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CircleDollarSign className="text-finance-blue" />
          Monthly Savings
        </h2>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleYearChange(selectedYear - 1)}
              disabled={isSaving || savingsLoading || loadingData}
            >
              Previous Year
            </Button>
            <div className="flex items-center justify-center bg-background border rounded-md px-4 font-medium">
              {selectedYear}
            </div>
            <Button 
              variant="outline" 
              onClick={() => handleYearChange(selectedYear + 1)}
              disabled={isSaving || savingsLoading || loadingData}
            >
              Next Year
            </Button>
          </div>
          
          <Button 
            onClick={handleSaveAll} 
            className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark"
            disabled={isSaving || savingsLoading || loadingData}
          >
            {isSaving || savingsLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save size={16} />
                Save All
              </>
            )}
          </Button>
        </div>
      </div>
      
      <p className="text-gray-600">
        Track your monthly savings to visualize your progress throughout the year.
      </p>
      
      {loadingData ? (
        <div className="p-4 bg-white rounded-lg shadow-md flex justify-center items-center h-64">
          <p>Loading savings data...</p>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <MonthlySavingsChart 
            data={savingsData} 
            onEditMonth={handleEditMonth} 
          />
        </div>
      )}
      
      {editingMonth !== null && (
        <MonthlySavingsForm
          month={editingMonth}
          initialAmount={savingsData.find(item => item.month === editingMonth)?.amount || 0}
          onSave={handleSaveAmount}
          onCancel={() => setEditingMonth(null)}
        />
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {savingsData.map((item) => (
          <div 
            key={item.month}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
            onClick={() => handleEditMonth(item.month)}
          >
            <div className="flex justify-between items-center">
              <div className="font-medium">{MONTHS[item.month - 1]}</div>
              <div className={`text-lg font-bold ${item.amount > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                ${item.amount.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlySavings;
