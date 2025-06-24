import React, { useState, useEffect } from "react";
import { UserProfile, ExpenseItem } from "../../types/finance";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2 } from "lucide-react";
import MonthlyExpensesHeader from "./MonthlyExpensesHeader";
import MonthlyExpensesContent from "./MonthlyExpensesContent";
import { useMonthlyExpenses } from "../../hooks/supabase/useMonthlyExpenses";

interface MonthlyExpensesProps {
  profile: UserProfile;
  onUpdateProfile?: (updatedProfile: UserProfile) => void;
}

const MonthlyExpenses: React.FC<MonthlyExpensesProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    expensesData,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useMonthlyExpenses(profile.id, selectedYear);

  useEffect(() => {
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        monthlyExpenses: {
          userId: profile.id,
          year: selectedYear,
          data: expensesData,
        },
      });
    }
  }, [expensesData, onUpdateProfile, profile, selectedYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleAddItem = async (
    month: number,
    item: Omit<ExpenseItem, "id">
  ) => {
    if (!profile?.id) return;
    await addExpense(item);
  };

  const handleUpdateItem = async (month: number, item: ExpenseItem) => {
    if (!profile?.id) return;
    await updateExpense(item);
  };

  const handleDeleteItem = async (month: number, itemId: string) => {
    if (!profile?.id) return;
    await deleteExpense(itemId);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-finance-blue' />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>
          Error loading expenses data:{" "}
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-8'>
      <MonthlyExpensesHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        disabled={isLoading}
      />

      <MonthlyExpensesContent
        expensesData={expensesData}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        loadingData={isLoading}
        onAddItem={handleAddItem}
        error={error ? (error as Error).message : null}
      />
    </div>
  );
};

export default MonthlyExpenses;
