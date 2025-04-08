
import React, { useState } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlySavingsData } from '@/hooks/useMonthlySavingsData';
import { MONTHS } from '@/constants/months';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import YearSelector from './YearSelector';
import MonthlySavingsChart from './MonthlySavingsChart';
import MonthlySavingsForm from './MonthlySavingsForm';
import MonthlyCard from './MonthlyCard';

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
  
  const {
    savings,
    isLoading,
    error,
    updateMonthAmount,
    saveSavings,
    fetchSavings
  } = useMonthlySavingsData(profile?.id, selectedYear);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setEditingMonth(null);
  };

  const handleEditMonth = (month: number) => {
    setEditingMonth(month);
  };

  const handleSaveAmount = (month: number, amount: number) => {
    updateMonthAmount(month, amount);
    setEditingMonth(null);
  };

  const handleSaveAll = async () => {
    const success = await saveSavings();
    
    if (success && onSave) {
      onSave({
        ...profile,
        monthlySavings: {
          id: profile.monthlySavings?.id || '',
          userId: profile.id,
          year: selectedYear,
          data: savings
        }
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
            disabled={isLoading || isSaving}
          />
          
          <Button
            onClick={handleSaveAll}
            disabled={isLoading || isSaving}
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
            onClick={fetchSavings}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>
      
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Loading savings data...</span>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MonthlySavingsChart 
              data={savings} 
              onSelectMonth={handleEditMonth} 
            />
          </div>
          
          {editingMonth !== null && (
            <MonthlySavingsForm
              month={editingMonth}
              amount={savings.find(item => item.month === editingMonth)?.amount || 0}
              onSave={handleSaveAmount}
              onCancel={() => setEditingMonth(null)}
            />
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savings.map(item => (
              <MonthlyCard
                key={item.month}
                item={item}
                monthName={MONTHS[item.month - 1]}
                onEdit={handleEditMonth}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlySavings;
