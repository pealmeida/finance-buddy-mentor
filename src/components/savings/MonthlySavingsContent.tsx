
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import MonthlySavingsChart from './MonthlySavingsChart';
import MonthlySavingsForm from './MonthlySavingsForm';
import MonthlyCard from './MonthlyCard';
import { MONTHS } from '@/constants/months';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MonthlySavingsContentProps {
  loadingData: boolean;
  savingsData: MonthlyAmount[];
  editingMonth: number | null;
  onEditMonth: (month: number) => void;
  onSaveAmount: (month: number, amount: number) => void;
  onCancelEdit: () => void;
  error?: string | null;
}

const MonthlySavingsContent: React.FC<MonthlySavingsContentProps> = ({
  loadingData,
  savingsData,
  editingMonth,
  onEditMonth,
  onSaveAmount,
  onCancelEdit,
  error
}) => {
  if (loadingData) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md flex justify-center items-center h-64">
        <div className="flex items-center gap-2 text-blue-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading savings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading data: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Make sure savingsData exists and has items
  if (!savingsData || savingsData.length === 0) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md flex justify-center items-center h-64">
        <p className="text-gray-500">No savings data available for the selected year.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <MonthlySavingsChart 
          data={savingsData} 
          onEditMonth={onEditMonth} 
        />
      </div>
      
      {editingMonth !== null && (
        <MonthlySavingsForm
          month={editingMonth}
          initialAmount={savingsData.find(item => item.month === editingMonth)?.amount || 0}
          onSave={onSaveAmount}
          onCancel={onCancelEdit}
        />
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {savingsData.map((item) => (
          <MonthlyCard
            key={item.month}
            item={item}
            monthName={MONTHS[item.month - 1]}
            onEditMonth={onEditMonth}
          />
        ))}
      </div>
    </>
  );
};

export default MonthlySavingsContent;
