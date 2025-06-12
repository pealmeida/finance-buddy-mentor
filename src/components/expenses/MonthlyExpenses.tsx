import React, { useState, useEffect } from "react";
import { UserProfile, MonthlyAmount, ExpenseItem } from "../../types/finance";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2 } from "lucide-react";
import MonthlyExpensesHeader from "./MonthlyExpensesHeader";
import MonthlyExpensesContent from "./MonthlyExpensesContent";
import {
  initializeEmptyExpensesData,
  ensureCompleteExpensesData,
} from "../../lib/expensesUtils";
import { useToast } from "../ui/use-toast";
import { useExpenses } from "../../hooks/supabase/useExpenses";

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
  const [expensesData, setExpensesData] = useState<MonthlyAmount[]>(
    initializeEmptyExpensesData()
  );
  const { toast } = useToast();

  const {
    monthlyExpensesData,
    isLoading: expensesLoading,
    error: expensesError,
    getMonthlyExpensesSummary,
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    updateMonthlyExpensesSummary,
  } = useExpenses(profile.id, selectedYear);

  useEffect(() => {
    const loadDetailedExpenses = async () => {
      if (!profile?.id || !monthlyExpensesData) return;

      try {
        const detailedExpenses = await Promise.all(
          monthlyExpensesData.map(async (monthData) => {
            const items = await getExpenses(
              profile.id,
              monthData.month,
              selectedYear
            );
            return { ...monthData, items };
          })
        );

        setExpensesData(ensureCompleteExpensesData(detailedExpenses));
        console.log(
          "MonthlyExpenses: Successfully loaded and set expensesData:",
          ensureCompleteExpensesData(detailedExpenses)
        );
      } catch (err) {
        console.error("Error loading expenses data:", err);
        setExpensesData(initializeEmptyExpensesData());

        toast({
          title: "Data Loading Error",
          description:
            "Could not load your expenses data. Using empty values instead.",
          variant: "destructive",
        });
      }
    };

    if (!expensesLoading && !expensesError) {
      loadDetailedExpenses();
    }
  }, [
    profile?.id,
    selectedYear,
    getExpenses,
    toast,
    monthlyExpensesData,
    expensesLoading,
    expensesError,
  ]);

  useEffect(() => {
    if (onUpdateProfile) {
      console.log(
        "MonthlyExpenses: expensesData updated, calling onUpdateProfile.",
        expensesData
      );
      console.log("MonthlyExpenses: Checking individual monthly amounts:");
      expensesData.forEach((month) => {
        console.log(
          `Month ${month.month}: Amount: ${month.amount}, Items length: ${
            month.items?.length || 0
          }`
        );
      });
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

  const handleUpdateExpensesData = (updatedData: MonthlyAmount[]) => {
    setExpensesData(updatedData);
  };

  const handleAddItem = async (
    month: number,
    item: Omit<ExpenseItem, "id">
  ) => {
    if (!profile?.id) return;
    const newItem = await addExpense(item, profile.id);
    if (newItem) {
      const updatedData = expensesData.map((m) => {
        if (m.month === month) {
          return {
            ...m,
            items: [...(m.items || []), newItem],
            amount: m.amount + newItem.amount,
          };
        }
        return m;
      });
      setExpensesData(updatedData);
      await updateMonthlyExpensesSummary(profile.id, month, selectedYear);
    }
  };

  const handleUpdateItem = async (month: number, item: ExpenseItem) => {
    if (!profile?.id) return;
    const oldItem = expensesData
      .find((m) => m.month === month)
      ?.items?.find((i) => i.id === item.id);
    const updatedItem = await updateExpense(item);
    if (updatedItem && oldItem) {
      const updatedData = expensesData.map((m) => {
        if (m.month === month) {
          const newItems = (m.items || []).map((i) =>
            i.id === item.id ? updatedItem : i
          );
          const newAmount = m.amount - oldItem.amount + updatedItem.amount;
          return { ...m, items: newItems, amount: newAmount };
        }
        return m;
      });
      setExpensesData(updatedData);
      await updateMonthlyExpensesSummary(profile.id, month, selectedYear);
    }
  };

  const handleDeleteItem = async (month: number, itemId: string) => {
    if (!profile?.id) return;
    const itemToDelete = expensesData
      .find((m) => m.month === month)
      ?.items?.find((i) => i.id === itemId);
    if (itemToDelete) {
      const success = await deleteExpense(itemId);
      if (success) {
        const updatedData = expensesData.map((m) => {
          if (m.month === month) {
            const newItems = (m.items || []).filter((i) => i.id !== itemId);
            const newAmount = m.amount - itemToDelete.amount;
            return { ...m, items: newItems, amount: newAmount };
          }
          return m;
        });
        setExpensesData(updatedData);
        await updateMonthlyExpensesSummary(profile.id, month, selectedYear);
      }
    }
  };

  const handleRefresh = async () => {
    // React Query will handle refetching automatically based on query invalidation
    // If a manual refetch is needed, you can use queryClient.invalidateQueries(['monthlyExpensesSummary', profile.id, selectedYear]);
    // or use the refetch function from useGetMonthlyExpensesSummary if exposed.
  };

  if (expensesLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-finance-blue' />
      </div>
    );
  }

  if (expensesError) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>
          Error loading expenses data:{" "}
          {expensesError instanceof Error
            ? expensesError.message
            : expensesError || "An unknown error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-8'>
      <MonthlyExpensesHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        onAddItem={handleAddItem}
      />

      <MonthlyExpensesContent
        expensesData={expensesData}
        onUpdateExpensesData={handleUpdateExpensesData}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        loadingData={expensesLoading}
        onAddItem={handleAddItem}
      />
    </div>
  );
};

export default MonthlyExpenses;
