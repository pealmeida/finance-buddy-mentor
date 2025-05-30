
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ExpenseItem } from "@/types/finance";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";

// Define expense categories
const EXPENSE_CATEGORIES = [
  { value: "housing", key: "expenses.categories.housing" },
  { value: "food", key: "expenses.categories.food" },
  { value: "transportation", key: "expenses.categories.transportation" },
  { value: "utilities", key: "expenses.categories.utilities" },
  { value: "entertainment", key: "expenses.categories.entertainment" },
  { value: "healthcare", key: "expenses.categories.healthcare" },
  { value: "other", key: "expenses.categories.other" },
] as const;

// Create a schema for form validation
const formSchema = z.object({
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters" })
    .max(100),
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  category: z.enum([
    "housing",
    "food",
    "transportation",
    "utilities",
    "entertainment",
    "healthcare",
    "other",
  ]),
  date: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

// Define the type expected by onSubmit to match ExpenseItem structure
type ExpenseFormSubmission = Omit<ExpenseItem, "id">;

interface ExpenseItemFormProps {
  onSubmit: (expense: ExpenseFormSubmission | ExpenseItem) => void;
  defaultMonth: number;
  expense?: ExpenseItem;
  isEditing?: boolean;
}

const ExpenseItemForm: React.FC<ExpenseItemFormProps> = ({
  onSubmit,
  defaultMonth,
  expense,
  isEditing = false,
}) => {
  const { t } = useTranslation();
  const { currencyConfig } = useCurrency();

  // Get the current date for the selected month
  const getCurrentMonthDate = () => {
    const now = new Date();
    // If we're working with a different month, update the date
    if (defaultMonth) {
      now.setMonth(defaultMonth - 1); // JavaScript months are 0-indexed
    }
    return format(now, "yyyy-MM-dd");
  };

  // Set default values for the form
  const defaultValues: FormValues = {
    description: expense?.description || "",
    amount: expense?.amount || 0,
    category: expense?.category || "other",
    date: expense?.date || getCurrentMonthDate(),
  };

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    // The values from the form have the correct types thanks to zod validation
    const submissionData: ExpenseFormSubmission = {
      description: values.description,
      amount: values.amount,
      category: values.category,
      date: values.date,
    };

    if (isEditing && expense) {
      onSubmit({
        ...submissionData,
        id: expense.id,
      });
    } else {
      onSubmit(submissionData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.table.description', 'Description')}</FormLabel>
              <FormControl>
                <Input placeholder={t('expenses.descriptionPlaceholder', 'Rent, Groceries, etc.')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.table.amount', 'Amount')} ({currencyConfig.symbol})</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='0.00'
                  step='0.01'
                  min='0'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('expenses.enterAmountDescription', 'Enter the expense amount')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.table.category', 'Category')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('expenses.selectCategory', 'Select a category')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {t(category.key, category.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.table.date', 'Date')}</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='submit'>
            {isEditing ? t('expenses.updateExpense', 'Update') : t('expenses.addExpense', 'Add')} {t('expenses.expense', 'Expense')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseItemForm;
