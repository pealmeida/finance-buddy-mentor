
import React, { useState } from "react";
import { MonthlyAmount } from "@/types/finance";
import MonthlyExpensesChart from "./MonthlyExpensesChart";
import MonthlyExpensesGrid from "./MonthlyExpensesGrid";
import MonthlyExpensesModalDialog from "./MonthlyExpensesModalDialog";
import { LoadingState, EmptyState } from "./MonthlyExpensesLoadingStates";
import { MonthlyExpensesDataEnhancer } from "./MonthlyExpensesDataEnhancer";

interface MonthlyExpensesContentProps {
  loadingData: boolean;
  expensesData: MonthlyAmount[];
  onRefresh?: () => void;
  error?: string | null;
  onUpdateExpensesData?: (updatedData: MonthlyAmount[]) => void;
}

const MonthlyExpensesContent: React.FC<MonthlyExpensesContentProps> = ({
  loadingData,
  expensesData,
  onRefresh,
  error,
  onUpdateExpensesData,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  console.log("MonthlyExpensesContent received data:", expensesData);
  console.log("Loading state:", loadingData);

  // Enhance the expenses data with sample expenses
  const enhancedExpensesData = MonthlyExpensesDataEnhancer.enhanceDataWithSampleExpenses(expensesData);

  const handleUpdateMonthData = (updatedData: MonthlyAmount) => {
    const updatedExpensesData = enhancedExpensesData.map((item) =>
      item.month === updatedData.month ? updatedData : item
    );

    if (onUpdateExpensesData) {
      onUpdateExpensesData(updatedExpensesData);
    }
  };

  const handleAmountClick = (month: number) => {
    setSelectedMonth(month);
  };

  const handleCloseModal = () => {
    setSelectedMonth(null);
  };

  // Handle loading state
  if (loadingData || error) {
    return <LoadingState loading={loadingData} error={error} onRefresh={onRefresh} />;
  }

  // Handle empty data state
  const validData = Array.isArray(enhancedExpensesData) && enhancedExpensesData.length > 0;
  if (!validData) {
    return <EmptyState onRefresh={onRefresh} />;
  }

  const selectedMonthData =
    selectedMonth !== null
      ? enhancedExpensesData.find((item) => item.month === selectedMonth)
      : null;

  return (
    <>
      {/* Chart Section */}
      <div className='p-4 bg-white rounded-lg shadow-md'>
        <MonthlyExpensesChart 
          data={enhancedExpensesData} 
          onSelectMonth={handleAmountClick}
        />
      </div>

      {/* Grid of monthly cards */}
      <MonthlyExpensesGrid
        data={enhancedExpensesData}
        onAmountClick={handleAmountClick}
      />

      {/* Detailed expenses modal */}
      <MonthlyExpensesModalDialog
        isOpen={selectedMonth !== null}
        onClose={handleCloseModal}
        selectedMonthData={selectedMonthData}
        onUpdateMonthData={handleUpdateMonthData}
      />
    </>
  );
};

export default MonthlyExpensesContent;
