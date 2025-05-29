
import { useCallback } from 'react';
import { MonthlyAmount, ExpenseItem } from '@/types/finance';

/**
 * Hook to handle automatic calculation of monthly totals from detailed expense items
 */
export const useDetailedExpensesCalculation = () => {
  
  // Calculate total amount from expense items
  const calculateTotalFromItems = useCallback((items: ExpenseItem[]): number => {
    if (!items || items.length === 0) return 0;
    
    return items.reduce((total, item) => {
      const amount = typeof item.amount === 'number' ? item.amount : 0;
      return total + amount;
    }, 0);
  }, []);

  // Update a month's data with new items and recalculated total
  const updateMonthWithItems = useCallback((
    monthData: MonthlyAmount, 
    newItems: ExpenseItem[]
  ): MonthlyAmount => {
    const calculatedTotal = calculateTotalFromItems(newItems);
    
    return {
      ...monthData,
      amount: calculatedTotal,
      items: newItems
    };
  }, [calculateTotalFromItems]);

  // Add a new expense item to a month and recalculate total
  const addExpenseItem = useCallback((
    monthData: MonthlyAmount,
    newItem: ExpenseItem
  ): MonthlyAmount => {
    const currentItems = monthData.items || [];
    const updatedItems = [...currentItems, newItem];
    
    return updateMonthWithItems(monthData, updatedItems);
  }, [updateMonthWithItems]);

  // Update an existing expense item and recalculate total
  const updateExpenseItem = useCallback((
    monthData: MonthlyAmount,
    updatedItem: ExpenseItem
  ): MonthlyAmount => {
    const currentItems = monthData.items || [];
    const updatedItems = currentItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    return updateMonthWithItems(monthData, updatedItems);
  }, [updateMonthWithItems]);

  // Remove an expense item and recalculate total
  const removeExpenseItem = useCallback((
    monthData: MonthlyAmount,
    itemId: string
  ): MonthlyAmount => {
    const currentItems = monthData.items || [];
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    
    return updateMonthWithItems(monthData, updatedItems);
  }, [updateMonthWithItems]);

  return {
    calculateTotalFromItems,
    updateMonthWithItems,
    addExpenseItem,
    updateExpenseItem,
    removeExpenseItem
  };
};
