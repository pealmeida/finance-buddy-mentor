import React, { useState, useCallback } from "react";
import { MonthlyAmount, ExpenseItem } from "../../types/finance";
import MonthlyExpensesChart from "./MonthlyExpensesChart";
import MonthlyExpensesGrid from "./MonthlyExpensesGrid";
import MonthlyExpensesModalDialog from "./MonthlyExpensesModalDialog";
import { LoadingState, EmptyState } from "./MonthlyExpensesLoadingStates";

export interface MonthlyExpensesContentProps {
  loadingData: boolean;
  expensesData: MonthlyAmount[];
  onRefresh?: () => void;
  error?: string | null;
  onAddItem: (month: number, item: Omit<ExpenseItem, "id">) => Promise<void>;
  onUpdateItem: (month: number, item: ExpenseItem) => Promise<void>;
  onDeleteItem: (month: number, itemId: string) => Promise<void>;
}

const MonthlyExpensesContent: React.FC<MonthlyExpensesContentProps> = ({
  loadingData,
  expensesData,
  onRefresh,
  error,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const handleAmountClick = (month: number) => {
    setSelectedMonth(month);
  };

  const handleCloseModal = () => {
    setSelectedMonth(null);
  };

  // Handle loading state
  if (loadingData || error) {
    return (
      <LoadingState loading={loadingData} error={error} onRefresh={onRefresh} />
    );
  }

  // Handle empty data state
  const validData = Array.isArray(expensesData) && expensesData.length > 0;
  if (!validData) {
    return <EmptyState onRefresh={onRefresh} />;
  }

  const selectedMonthData =
    selectedMonth !== null
      ? expensesData.find((item) => item.month === selectedMonth) || null
      : null;

  return (
    <>
      {/* Chart Section */}
      <div className='p-4 bg-white rounded-lg shadow-md'>
        <MonthlyExpensesChart
          key={`expenses-chart-${expensesData.length}-${JSON.stringify(
            expensesData.map((d) => d.amount)
          )}`}
          data={expensesData}
          onSelectMonth={handleAmountClick}
        />
      </div>

      {/* Grid of monthly cards */}
      <MonthlyExpensesGrid
        data={expensesData}
        onAmountClick={handleAmountClick}
      />

      {/* Detailed expenses modal */}
      <MonthlyExpensesModalDialog
        isOpen={selectedMonth !== null}
        onClose={handleCloseModal}
        selectedMonthData={selectedMonthData}
        onAddItem={onAddItem}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
      />
    </>
  );
};

export default MonthlyExpensesContent;
