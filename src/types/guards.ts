import { ExpenseItem } from "./finance";

export const isExpenseCategory = (category: string): category is ExpenseItem['category'] => {
    const categories: ExpenseItem['category'][] = ['housing', 'food', 'transportation', 'utilities', 'entertainment', 'healthcare', 'other'];
    return categories.includes(category as ExpenseItem['category']);
} 