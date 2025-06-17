import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { ExpenseItem } from '../../types/finance';
import { useToast } from '../../components/ui/use-toast';

/**
 * Hook for CRUD operations on detailed expenses
 */
export function useExpensesCrud(userId: string, year: number) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Add new expense item
    const addExpenseItem = useMutation({
        mutationFn: async (expense: Omit<ExpenseItem, 'id'>): Promise<ExpenseItem> => {
            const { data, error } = await supabase
                .from('detailed_expenses')
                .insert({
                    user_id: userId,
                    date: expense.date,
                    amount: expense.amount,
                    category: expense.category,
                    description: expense.description || '',
                })
                .select()
                .single();

            if (error) {
                console.error('Error adding expense item:', error);
                throw error;
            }

            return {
                id: data.id,
                date: data.date,
                amount: data.amount,
                category: data.category as ExpenseItem['category'],
                description: data.description,
            };
        },
        onSuccess: () => {
            // Invalidate queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['detailedExpenses', userId, year] });
            queryClient.invalidateQueries({ queryKey: ['monthlyExpensesSummary', userId, year] });
            toast({
                title: "Success",
                description: "Expense added successfully",
            });
        },
        onError: (error) => {
            console.error('Failed to add expense:', error);
            toast({
                title: "Error",
                description: "Failed to add expense. Please try again.",
                variant: "destructive",
            });
        }
    });

    // Update expense item
    const updateExpenseItem = useMutation({
        mutationFn: async (expense: ExpenseItem): Promise<ExpenseItem> => {
            const { data, error } = await supabase
                .from('detailed_expenses')
                .update({
                    date: expense.date,
                    amount: expense.amount,
                    category: expense.category,
                    description: expense.description || '',
                })
                .eq('id', expense.id)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) {
                console.error('Error updating expense item:', error);
                throw error;
            }

            return {
                id: data.id,
                date: data.date,
                amount: data.amount,
                category: data.category as ExpenseItem['category'],
                description: data.description,
            };
        },
        onSuccess: () => {
            // Invalidate queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['detailedExpenses', userId, year] });
            queryClient.invalidateQueries({ queryKey: ['monthlyExpensesSummary', userId, year] });
            toast({
                title: "Success",
                description: "Expense updated successfully",
            });
        },
        onError: (error) => {
            console.error('Failed to update expense:', error);
            toast({
                title: "Error",
                description: "Failed to update expense. Please try again.",
                variant: "destructive",
            });
        }
    });

    // Delete expense item
    const deleteExpenseItem = useMutation({
        mutationFn: async (expenseId: string): Promise<void> => {
            const { error } = await supabase
                .from('detailed_expenses')
                .delete()
                .eq('id', expenseId)
                .eq('user_id', userId);

            if (error) {
                console.error('Error deleting expense item:', error);
                throw error;
            }
        },
        onSuccess: () => {
            // Invalidate queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['detailedExpenses', userId, year] });
            queryClient.invalidateQueries({ queryKey: ['monthlyExpensesSummary', userId, year] });
            toast({
                title: "Success",
                description: "Expense deleted successfully",
            });
        },
        onError: (error) => {
            console.error('Failed to delete expense:', error);
            toast({
                title: "Error",
                description: "Failed to delete expense. Please try again.",
                variant: "destructive",
            });
        }
    });

    return {
        addExpenseItem: addExpenseItem.mutateAsync,
        updateExpenseItem: updateExpenseItem.mutateAsync,
        deleteExpenseItem: deleteExpenseItem.mutateAsync,
        isAdding: addExpenseItem.isPending,
        isUpdating: updateExpenseItem.isPending,
        isDeleting: deleteExpenseItem.isPending,
    };
} 