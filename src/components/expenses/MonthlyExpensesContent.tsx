
import React, { useState } from "react";
import { MonthlyAmount } from "@/types/finance";
import MonthlyExpensesChart from "./MonthlyExpensesChart";
import MonthlyCard from "./MonthlyCard";
import DetailedExpensesList from "./DetailedExpensesList";
import { MONTHS } from "@/constants/months";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from 'uuid';

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

  // Function to adjust expense items to match the monthly total
  const adjustExpenseItemsToTotal = (items: any[], targetTotal: number) => {
    if (!items || items.length === 0) return items;
    
    const currentTotal = items.reduce((sum, item) => sum + item.amount, 0);
    
    if (currentTotal === 0 || currentTotal === targetTotal) return items;
    
    const adjustmentFactor = targetTotal / currentTotal;
    
    return items.map((item, index) => {
      if (index === items.length - 1) {
        // For the last item, calculate the exact amount to reach the target total
        const adjustedTotal = items.slice(0, -1).reduce((sum, adjustedItem, i) => 
          sum + Math.round(items[i].amount * adjustmentFactor * 100) / 100, 0);
        return {
          ...item,
          amount: Math.round((targetTotal - adjustedTotal) * 100) / 100
        };
      } else {
        return {
          ...item,
          amount: Math.round(item.amount * adjustmentFactor * 100) / 100
        };
      }
    });
  };

  // Add sample detailed expenses for the first three months
  const enhanceDataWithSampleExpenses = (data: MonthlyAmount[]) => {
    return data.map((item) => {
      if (item.month === 1 && item.amount > 0 && (!item.items || item.items.length === 0)) {
        // January expenses
        const sampleItems = [
          {
            id: uuidv4(),
            description: "Rent",
            amount: 1200,
            category: "housing" as const,
            date: "2024-01-01"
          },
          {
            id: uuidv4(),
            description: "Groceries",
            amount: 450,
            category: "food" as const,
            date: "2024-01-15"
          },
          {
            id: uuidv4(),
            description: "Gas Bill",
            amount: 89,
            category: "utilities" as const,
            date: "2024-01-05"
          },
          {
            id: uuidv4(),
            description: "Car Payment",
            amount: 350,
            category: "transportation" as const,
            date: "2024-01-01"
          },
          {
            id: uuidv4(),
            description: "Internet",
            amount: 65,
            category: "utilities" as const,
            date: "2024-01-10"
          },
          {
            id: uuidv4(),
            description: "Dining Out",
            amount: 180,
            category: "food" as const,
            date: "2024-01-20"
          },
          {
            id: uuidv4(),
            description: "Movie Tickets",
            amount: 25,
            category: "entertainment" as const,
            date: "2024-01-25"
          },
          {
            id: uuidv4(),
            description: "Doctor Visit",
            amount: 120,
            category: "healthcare" as const,
            date: "2024-01-18"
          }
        ];
        
        return {
          ...item,
          items: adjustExpenseItemsToTotal(sampleItems, item.amount)
        };
      } else if (item.month === 2 && item.amount > 0 && (!item.items || item.items.length === 0)) {
        // February expenses
        const sampleItems = [
          {
            id: uuidv4(),
            description: "Rent",
            amount: 1200,
            category: "housing" as const,
            date: "2024-02-01"
          },
          {
            id: uuidv4(),
            description: "Groceries",
            amount: 380,
            category: "food" as const,
            date: "2024-02-15"
          },
          {
            id: uuidv4(),
            description: "Electric Bill",
            amount: 110,
            category: "utilities" as const,
            date: "2024-02-05"
          },
          {
            id: uuidv4(),
            description: "Car Payment",
            amount: 350,
            category: "transportation" as const,
            date: "2024-02-01"
          },
          {
            id: uuidv4(),
            description: "Internet",
            amount: 65,
            category: "utilities" as const,
            date: "2024-02-10"
          },
          {
            id: uuidv4(),
            description: "Valentine's Dinner",
            amount: 95,
            category: "food" as const,
            date: "2024-02-14"
          },
          {
            id: uuidv4(),
            description: "Gym Membership",
            amount: 45,
            category: "healthcare" as const,
            date: "2024-02-01"
          },
          {
            id: uuidv4(),
            description: "Coffee Shops",
            amount: 75,
            category: "food" as const,
            date: "2024-02-20"
          }
        ];
        
        return {
          ...item,
          items: adjustExpenseItemsToTotal(sampleItems, item.amount)
        };
      } else if (item.month === 3 && item.amount > 0 && (!item.items || item.items.length === 0)) {
        // March expenses
        const sampleItems = [
          {
            id: uuidv4(),
            description: "Rent",
            amount: 1200,
            category: "housing" as const,
            date: "2024-03-01"
          },
          {
            id: uuidv4(),
            description: "Groceries",
            amount: 420,
            category: "food" as const,
            date: "2024-03-15"
          },
          {
            id: uuidv4(),
            description: "Water Bill",
            amount: 45,
            category: "utilities" as const,
            date: "2024-03-05"
          },
          {
            id: uuidv4(),
            description: "Car Payment",
            amount: 350,
            category: "transportation" as const,
            date: "2024-03-01"
          },
          {
            id: uuidv4(),
            description: "Internet",
            amount: 65,
            category: "utilities" as const,
            date: "2024-03-10"
          },
          {
            id: uuidv4(),
            description: "Spring Clothes",
            amount: 150,
            category: "other" as const,
            date: "2024-03-20"
          },
          {
            id: uuidv4(),
            description: "Concert Tickets",
            amount: 80,
            category: "entertainment" as const,
            date: "2024-03-25"
          },
          {
            id: uuidv4(),
            description: "Gas",
            amount: 85,
            category: "transportation" as const,
            date: "2024-03-12"
          },
          {
            id: uuidv4(),
            description: "Phone Bill",
            amount: 55,
            category: "utilities" as const,
            date: "2024-03-15"
          }
        ];
        
        return {
          ...item,
          items: adjustExpenseItemsToTotal(sampleItems, item.amount)
        };
      }
      return item;
    });
  };

  // Enhance the expenses data with sample expenses
  const enhancedExpensesData = enhanceDataWithSampleExpenses(expensesData);

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

  const validData = Array.isArray(enhancedExpensesData) && enhancedExpensesData.length > 0;

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
      ? enhancedExpensesData.find((item) => item.month === selectedMonth)
      : null;

  return (
    <>
      <div className='p-4 bg-white rounded-lg shadow-md'>
        <MonthlyExpensesChart 
          data={enhancedExpensesData} 
          onSelectMonth={handleAmountClick}
        />
      </div>

      {/* Grid of monthly cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
        {enhancedExpensesData.map((item) => (
          <MonthlyCard
            key={item.month}
            item={item}
            monthName={MONTHS[item.month - 1]}
            onAmountClick={() => handleAmountClick(item.month)}
          />
        ))}
      </div>

      {/* Detailed expenses modal */}
      <Dialog open={selectedMonth !== null} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMonthData ? `${MONTHS[selectedMonthData.month - 1]} Expenses` : 'Monthly Expenses'}
            </DialogTitle>
          </DialogHeader>
          {selectedMonthData && (
            <DetailedExpensesList
              monthData={selectedMonthData}
              onUpdateMonthData={handleUpdateMonthData}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthlyExpensesContent;
