import React from "react";
import { ExpenseItem } from "@/types/finance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import ExpenseItemActions from "./ExpenseItemActions";

interface ExpenseItemsTableProps {
  items: ExpenseItem[];
  onEdit: (expense: ExpenseItem) => void;
  onDelete: (id: string) => void;
}

const ExpenseItemsTable: React.FC<ExpenseItemsTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();

  const getCategoryBadgeColor = (category: ExpenseItem["category"]) => {
    const colors: Record<ExpenseItem["category"], string> = {
      housing: "bg-blue-100 text-blue-800",
      food: "bg-green-100 text-green-800",
      transportation: "bg-yellow-100 text-yellow-800",
      utilities: "bg-purple-100 text-purple-800",
      entertainment: "bg-pink-100 text-pink-800",
      healthcare: "bg-cyan-100 text-cyan-800",
      other: "bg-gray-100 text-gray-800",
    };

    return colors[category];
  };

  const getCategoryTranslation = (category: ExpenseItem["category"]) => {
    return t(`expenses.categories.${category}`, {
      defaultValue: t("expenses.categories.other"),
    });
  };

  if (items.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>
        <XCircle className='mx-auto h-10 w-10 mb-2 text-gray-400' />
        <p>
          {t(
            "expenses.noDetailedExpenses",
            "No detailed expenses recorded for this month."
          )}
        </p>
        <p className='text-sm mt-1'>
          {t("expenses.clickAddToStart", 'Click "Add Expense" to get started.')}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("expenses.table.date", "Date")}</TableHead>
          <TableHead>
            {t("expenses.table.description", "Description")}
          </TableHead>
          <TableHead>{t("expenses.table.category", "Category")}</TableHead>
          <TableHead className='text-right'>
            {t("expenses.table.amount", "Amount")}
          </TableHead>
          <TableHead className='text-right'>
            {t("common.actions", "Actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>
                {format(new Date(expense.date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className='font-medium'>
                {expense.description}
              </TableCell>
              <TableCell>
                <Badge className={getCategoryBadgeColor(expense.category)}>
                  {getCategoryTranslation(expense.category)}
                </Badge>
              </TableCell>
              <TableCell className='text-right font-medium'>
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell className='text-right'>
                <ExpenseItemActions
                  expense={expense}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default ExpenseItemsTable;
