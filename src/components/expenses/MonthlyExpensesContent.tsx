import React, { useState } from "react";
import { MonthlyAmount } from "@/types/finance";
import MonthlyExpensesChart from "./MonthlyExpensesChart";
import MonthlyExpensesForm from "./MonthlyExpensesForm";
import MonthlyCard from "./MonthlyCard";
import DetailedExpensesList from "./DetailedExpensesList";
import { MONTHS } from "@/constants/months";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
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
  error,
}) => {
  // State to track which month's detailed expenses to show
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Log the data to assist with debugging
  console.log("MonthlyExpensesContent received data:", expensesData);
  console.log("Loading state:", loadingData);

  // Handle updating a month's detailed expenses
  const handleUpdateMonthData = (updatedData: MonthlyAmount) => {
    // Create a new array with the updated month data
    const updatedExpensesData = expensesData.map((item) =>
      item.month === updatedData.month ? updatedData : item
    );

    // Update the parent component
    const originalMonth = expensesData.find(
      (item) => item.month === updatedData.month
    );
    if (originalMonth && originalMonth.amount !== updatedData.amount) {
      onSaveAmount(updatedData.month, updatedData.amount);
    }
  };

  // Handle selecting a month to view detailed expenses
  const handleSelectMonth = (month: number) => {
    setSelectedMonth(month);
  };

  if (loadingData) {
    return (
      <div className='p-8 bg-white rounded-lg shadow-md flex justify-center items-center h-64'>
        <div className='flex items-center gap-2 text-red-500'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <p>Loading expenses data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8 bg-white rounded-lg shadow-md space-y-4'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Error loading data: {error}</AlertDescription>
        </Alert>

        {onRefresh && (
          <div className='flex justify-center'>
            <Button
              onClick={onRefresh}
              variant='outline'
              className='flex items-center gap-2'>
              <RefreshCw className='h-4 w-4' />
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
      <div className='p-8 bg-white rounded-lg shadow-md flex flex-col justify-center items-center h-64 space-y-4'>
        <p className='text-gray-500'>
          No expenses data available for the selected year.
        </p>

        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant='outline'
            className='flex items-center gap-2'>
            <RefreshCw className='h-4 w-4' />
            Refresh
          </Button>
        )}
      </div>
    );
  }

  // Get the selected month data if applicable
  const selectedMonthData =
    selectedMonth !== null
      ? expensesData.find((item) => item.month === selectedMonth)
      : null;

  return (
    <>
      <div className='p-4 bg-white rounded-lg shadow-md'>
        <MonthlyExpensesChart
          data={expensesData}
          onSelectMonth={handleSelectMonth}
        />
      </div>

      {editingMonth !== null && (
        <MonthlyExpensesForm
          month={editingMonth}
          amount={
            expensesData.find((item) => item.month === editingMonth)?.amount ||
            0
          }
          onSave={onSaveAmount}
          onCancel={onCancelEdit}
        />
      )}

      {/* Detailed expenses view for selected month */}
      {selectedMonth !== null && selectedMonthData && (
        <div className='mt-6'>
          <DetailedExpensesList
            monthData={selectedMonthData}
            onUpdateMonthData={handleUpdateMonthData}
          />
          <div className='flex justify-end mt-4'>
            <Button variant='outline' onClick={() => setSelectedMonth(null)}>
              Back to All Months
            </Button>
          </div>
        </div>
      )}

      {/* Only show the grid of months when not viewing a specific month's details */}
      {selectedMonth === null && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
          {expensesData.map((item) => (
            <MonthlyCard
              key={item.month}
              item={item}
              monthName={MONTHS[item.month - 1]}
              onEdit={() => handleSelectMonth(item.month)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MonthlyExpensesContent;
