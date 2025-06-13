import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExpenseItem, MonthlyAmount } from '@/types/finance';
import { isExpenseCategory } from '@/types/guards';
import { useGetMonthlyExpensesSummary } from './useGetMonthlyExpensesSummary';
import { Json } from '@/integrations/supabase/types';

export const useExpenses = (userId: string, year: number) => {
    const { data: monthlyExpensesData, isLoading: fetchLoading, error: fetchError, getMonthlyExpensesSummary } = useGetMonthlyExpensesSummary(userId, year);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getExpenses = useCallback(async (userId: string, month: number, year: number): Promise<ExpenseItem[]> => {
        try {
            setLoading(true);
            setError(null);

            const startDate = new Date(year, month - 1, 1).toISOString();
            const endDate = new Date(year, month, 0).toISOString();

            const { data, error } = await supabase
                .from('detailed_expenses')
                .select('*')
                .eq('user_id', userId)
                .gte('date', startDate)
                .lte('date', endDate);

            if (error) {
                throw error;
            }

            return (data || []).map(item => ({
                ...item,
                category: isExpenseCategory(item.category) ? item.category : 'other'
            }));
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMonthlyExpensesSummary = useCallback(async (userId: string, month: number, year: number) => {
        try {
            setLoading(true);
            // Calculate total amount for the month from detailed_expenses
            const { data: detailedExpenses, error: detailedError } = await supabase
                .from('detailed_expenses')
                .select('amount')
                .eq('user_id', userId)
                .gte('date', new Date(year, month - 1, 1).toISOString())
                .lte('date', new Date(year, month, 0).toISOString());

            if (detailedError) throw detailedError;

            const totalAmount = (detailedExpenses || []).reduce((sum, item) => sum + item.amount, 0);

            // Fetch existing monthly summary or initialize it
            const { data: existingSummary, error: summaryError } = await supabase
                .from('monthly_expenses')
                .select('data')
                .eq('user_id', userId)
                .eq('year', year)
                .single();

            if (summaryError && summaryError.code !== 'PGRST116') { // PGRST116 means no rows found
                throw summaryError;
            }

            let monthlyData: MonthlyAmount[] = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, amount: 0 }));

            if (existingSummary && existingSummary.data) {
                monthlyData = existingSummary.data as unknown as MonthlyAmount[];
            }

            // Update the amount for the specific month
            monthlyData = monthlyData.map(item =>
                item.month === month ? { ...item, amount: totalAmount } : item
            );

            // Upsert the updated monthly summary
            const { error: upsertError } = await supabase
                .from('monthly_expenses')
                .upsert(
                    { user_id: userId, year: year, data: monthlyData as unknown as Json },
                    { onConflict: 'user_id,year' }
                );

            if (upsertError) throw upsertError;

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const addExpense = useCallback(async (expense: Omit<ExpenseItem, 'id'>, userId: string): Promise<ExpenseItem | null> => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('detailed_expenses')
                .insert([{ ...expense, user_id: userId, description: expense.description || '' }])
                .select()
                .single();

            if (error) {
                throw error;
            }

            if (data && isExpenseCategory(data.category)) {
                return {
                    ...data,
                    category: data.category
                };
            }
            return null;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExpense = useCallback(async (expense: ExpenseItem): Promise<ExpenseItem | null> => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('detailed_expenses')
                .update({ ...expense, description: expense.description || '' })
                .eq('id', expense.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            if (data && isExpenseCategory(data.category)) {
                return {
                    ...data,
                    category: data.category
                };
            }
            return null;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExpense = useCallback(async (expenseId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase
                .from('detailed_expenses')
                .delete()
                .eq('id', expenseId);

            if (error) {
                throw error;
            }

            return true;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        monthlyExpensesData,
        isLoading: fetchLoading || loading, // Combine loading states
        error: fetchError || error, // Combine error states
        getExpenses,
        getMonthlyExpensesSummary,
        addExpense,
        updateExpense,
        deleteExpense,
        updateMonthlyExpensesSummary,
    };
}; 