
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import MonthlySavingsForm from './MonthlySavingsForm';
import SavingsLoadingState from './content/SavingsLoadingState';
import SavingsErrorState from './content/SavingsErrorState';
import SavingsEmptyState from './content/SavingsEmptyState';
import SavingsChartSection from './content/SavingsChartSection';
import SavingsCardGrid from './content/SavingsCardGrid';

interface MonthlySavingsContentProps {
  loadingData: boolean;
  savingsData: MonthlyAmount[];
  editingMonth: number | null;
  onEditMonth: (month: number) => void;
  onSaveAmount: (month: number, amount: number) => void;
  onCancelEdit: () => void;
  onRefresh?: () => void;
  error?: string | null;
}

const MonthlySavingsContent: React.FC<MonthlySavingsContentProps> = ({
  loadingData,
  savingsData,
  editingMonth,
  onEditMonth,
  onSaveAmount,
  onCancelEdit,
  onRefresh,
  error
}) => {
  // Log data for debugging
  console.log("MonthlySavingsContent received data:", savingsData);
  console.log("Loading state:", loadingData);
  
  if (loadingData) {
    return <SavingsLoadingState />;
  }

  if (error) {
    return <SavingsErrorState error={error} onRefresh={onRefresh} />;
  }
  
  // Validate that savingsData exists and has items
  if (!Array.isArray(savingsData) || savingsData.length === 0) {
    return <SavingsEmptyState onRefresh={onRefresh} />;
  }
  
  return (
    <>
      <SavingsChartSection 
        data={savingsData} 
        onSelectMonth={onEditMonth} 
      />
      
      {editingMonth !== null && (
        <MonthlySavingsForm
          month={editingMonth}
          amount={savingsData.find(item => item.month === editingMonth)?.amount || 0}
          onSave={onSaveAmount}
          onCancel={onCancelEdit}
        />
      )}
      
      <SavingsCardGrid data={savingsData} onEditMonth={onEditMonth} />
    </>
  );
};

export default MonthlySavingsContent;
