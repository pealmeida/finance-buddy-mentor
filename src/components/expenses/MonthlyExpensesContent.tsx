
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import MonthlyExpensesChart from './MonthlyExpensesChart';
import MonthlyExpensesForm from './MonthlyExpensesForm';
import MonthlyCard from './MonthlyCard';
import { MONTHS } from '@/constants/months';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface MonthlyExpensesContentProps {
  loadingData: boolean;
  expensesData: MonthlyAmount[];
  editingMonth: number | null;
  onEditMonth: (month: number) => void;
  onSaveAmount: (month: number, amount: number) => void;
  onCancelEdit: () => void;
  onRefresh?: () => void;
  error?: string | null;
}

const MonthlyExpensesContent: React.FC<MonthlyExpensesContentProps> = ({
  loadingData,
  expensesData,
  editingMonth,
  onEditMonth,
  onSaveAmount,
  onCancelEdit,
  onRefresh,
  error
}) => {
  // Log the data to assist with debugging
  console.log("MonthlyExpensesContent received data:", expensesData);
  console.log("Loading state:", loadingData);
  
  if (loadingData) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md flex justify-center items-center h-64">
        <div className="flex items-center gap-2 text-red-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading expenses data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading data: {error}</AlertDescription>
        </Alert>
        
        {onRefresh && (
          <div className="flex justify-center">
            <Button 
              onClick={onRefresh} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Loading Data
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  // Validate data is in expected format
  const validData = Array.isArray(expensesData) && expensesData.length > 0;
  
  if (!validData) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md flex flex-col justify-center items-center h-64 space-y-4">
        <p className="text-gray-500">No expenses data available for the selected year.</p>
        
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <MonthlyExpensesChart 
          data={expensesData} 
          onSelectMonth={onEditMonth} 
        />
      </div>
      
      {editingMonth !== null && (
        <MonthlyExpensesForm
          month={editingMonth}
          amount={expensesData.find(item => item.month === editingMonth)?.amount || 0}
          onSave={onSaveAmount}
          onCancel={onCancelEdit}
        />
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {expensesData.map((item) => (
          <MonthlyCard
            key={item.month}
            item={item}
            monthName={MONTHS[item.month - 1]}
            onEdit={onEditMonth}
          />
        ))}
      </div>
    </>
  );
};

export default MonthlyExpensesContent;
