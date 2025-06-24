import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExpenseItem, MonthlyAmount } from '@/types/finance';
import { isExpenseCategory } from '@/types/guards';
import { useToast } from '@/components/ui/use-toast';

// 1. Fetcher function
const fetchMonthlyExpenses = async (userId: string, year: number): Promise<MonthlyAmount[]> => {
    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year, 11, 31).toISOString();

    const { data, error } = await supabase
        .from('detailed_expenses')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    // Process the flat list of expenses into monthly buckets
    const monthlyData: MonthlyAmount[] = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        amount: 0,
        items: [],
        year: year
    }));

    data.forEach(item => {
        const itemDate = new Date(item.date);
        const month = itemDate.getMonth() + 1;
        const itemYear = itemDate.getFullYear();
        const monthIndex = month - 1;

        // Extra validation: only include expenses from the exact target year
        if (itemYear !== year) {
            return;
        }

        if (month < 1 || month > 12) {
            return;
        }

        const expenseItem: ExpenseItem = {
            ...item,
            category: isExpenseCategory(item.category) ? item.category : 'other'
        };

        monthlyData[monthIndex].amount += item.amount;
        if (monthlyData[monthIndex].items) {
            monthlyData[monthIndex].items.push(expenseItem);
        } else {
            monthlyData[monthIndex].items = [expenseItem];
        }
    });

    return monthlyData;
};

// 2. Add Expense Mutation
const addExpense = async (expense: Omit<ExpenseItem, 'id'> & { user_id: string }): Promise<ExpenseItem> => {
    const { data, error } = await supabase
        .from('detailed_expenses')
        .insert([{ ...expense, description: expense.description || '' }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Failed to add expense, no data returned.");

    return {
        ...data,
        category: isExpenseCategory(data.category) ? data.category : 'other'
    };
};

// 3. Update Expense Mutation
const updateExpense = async (expense: ExpenseItem): Promise<ExpenseItem> => {
    const { data, error } = await supabase
        .from('detailed_expenses')
        .update({ ...expense, description: expense.description || '' })
        .eq('id', expense.id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Failed to update expense, no data returned.");

    return {
        ...data,
        category: isExpenseCategory(data.category) ? data.category : 'other'
    };
};

// 4. Delete Expense Mutation
const deleteExpense = async (expenseId: string): Promise<string> => {
    const { error } = await supabase
        .from('detailed_expenses')
        .delete()
        .eq('id', expenseId);

    if (error) throw new Error(error.message);
    return expenseId;
};


export const useMonthlyExpenses = (userId: string, year: number) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const queryKey = ['monthlyExpenses', userId, year];

    const { data: expensesData, isLoading, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => fetchMonthlyExpenses(userId, year),
        enabled: !!userId,
    });

    // Add Mutation
    const { mutateAsync: addExpenseItem, isPending: isAdding } = useMutation({
        mutationFn: (expense: Omit<ExpenseItem, 'id'>) => addExpense({ ...expense, user_id: userId }),
        onSuccess: () => {
            toast({ title: "Success", description: "Expense added successfully." });
            return queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            toast({ title: "Error", description: `Failed to add expense: ${err.message}`, variant: 'destructive' });
        }
    });

    // Update Mutation
    const { mutateAsync: updateExpenseItem, isPending: isUpdating } = useMutation({
        mutationFn: updateExpense,
        onSuccess: () => {
            toast({ title: "Success", description: "Expense updated successfully." });
            return queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            toast({ title: "Error", description: `Failed to update expense: ${err.message}`, variant: 'destructive' });
        }
    });

    // Delete Mutation
    const { mutateAsync: deleteExpenseItem, isPending: isDeleting } = useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            toast({ title: "Success", description: "Expense deleted successfully." });
            return queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            toast({ title: "Error", description: `Failed to delete expense: ${err.message}`, variant: 'destructive' });
        }
    });

    const isProcessing = isAdding || isUpdating || isDeleting;

    return {
        expensesData: expensesData || Array.from({ length: 12 }, (_, i) => ({ month: i + 1, amount: 0, items: [], year: year })),
        isLoading: isLoading || isProcessing,
        error: error,
        addExpense: addExpenseItem,
        updateExpense: updateExpenseItem,
        deleteExpense: deleteExpenseItem
    };
}; 