
import React, { useState } from "react";
import { MonthlyAmount } from "@/types/finance";
import MonthlyExpensesChart from "./MonthlyExpensesChart";
import MonthlyCard from "./MonthlyCard";
import DetailedExpensesList from "./DetailedExpensesList";
import { MONTHS } from "@/constants/months";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  console.log("MonthlyExpensesContent received data:", expensesData);
  console.log("Loading state:", loadingData);

  const handleUpdateMonthData = (updatedData: MonthlyAmount) => {
    const updatedExpensesData = expensesData.map((item) =>
      item.month === updatedData.month ? updatedData : item
    );

    if (onUpdateExpensesData) {
      onUpdateExpensesData(updatedExpensesData);
    }
  };

  const handleAmountClick = (month: number) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  if (loadingData) {
    return (
      <div className='p-8 bg-white rounded-lg shadow-md flex justify-center items-center h-64'>
        <div className='flex items-center gap-2 text-red-500'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <p>{t('expenses.loadingExpenses')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8 bg-white rounded-lg shadow-md space-y-4'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{t('expenses.errorLoadingData')} {error}</AlertDescription>
        </Alert>

        {onRefresh && (
          <div className='flex justify-center'>
            <Button
              onClick={onRefresh}
              variant='outline'
              className='flex items-center gap-2'>
              <RefreshCw className='h-4 w-4' />
              {t('common.refresh')}
            </Button>
          </div>
        )}
      </div>
    );
  }

  const validData = Array.isArray(expensesData) && expensesData.length > 0;

  if (!validData) {
    return (
      <div className='p-8 bg-white rounded-lg shadow-md flex flex-col justify-center items-center h-64 space-y-4'>
        <p className='text-gray-500'>
          {t('expenses.noExpensesData')}
        </p>

        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant='outline'
            className='flex items-center gap-2'>
            <RefreshCw className='h-4 w-4' />
            {t('common.refresh')}
          </Button>
        )}
      </div>
    );
  }

  const selectedMonthData =
    selectedMonth !== null
      ? expensesData.find((item) => item.month === selectedMonth)
      : null;

  return (
    <>
      <div className='p-4 bg-white rounded-lg shadow-md'>
        <MonthlyExpensesChart data={expensesData} />
      </div>

      {/* Detailed expenses view for selected month */}
      {selectedMonth !== null && selectedMonthData && (
        <div className='mt-6'>
          <DetailedExpensesList
            monthData={selectedMonthData}
            onUpdateMonthData={handleUpdateMonthData}
          />
          <div className='flex justify-end mt-4'>
            <Button variant='outline' onClick={() => setSelectedMonth(null)}>
              {t('common.backToOverview', 'Back to Overview')}
            </Button>
          </div>
        </div>
      )}

      {/* Grid of monthly cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
        {expensesData.map((item) => (
          <MonthlyCard
            key={item.month}
            item={item}
            monthName={MONTHS[item.month - 1]}
            onAmountClick={() => handleAmountClick(item.month)}
          />
        ))}
      </div>
    </>
  );
};

export default MonthlyExpensesContent;
