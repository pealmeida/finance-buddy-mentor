import React from "react";
import { ExpenseItem } from "../../types/finance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";
import ExpenseItemActions from "./ExpenseItemActions";
import { useIsMobile } from "../../hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
  const isMobile = useIsMobile();

  const getCategoryBadgeColor = (category: ExpenseItem["category"]) => {
    const colors: Record<ExpenseItem["category"], string> = {
      housing: "bg-blue-200 text-blue-900",
      food: "bg-green-200 text-green-900",
      transportation: "bg-yellow-200 text-yellow-900",
      utilities: "bg-purple-200 text-purple-900",
      entertainment: "bg-pink-200 text-pink-900",
      healthcare: "bg-cyan-200 text-cyan-900",
      other: "bg-gray-200 text-gray-900",
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
    <>
      {isMobile ? (
        <div className='space-y-4'>
          {items
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((expense) => (
              <Card key={expense.id} className='w-full'>
                <CardHeader className='p-5 pb-1 flex-row items-center justify-between'>
                  <CardTitle className='text-base flex-grow'>
                    <span>{expense.description}</span>
                    <Badge
                      className={
                        getCategoryBadgeColor(expense.category) + " ml-1"
                      }>
                      {getCategoryTranslation(expense.category)}
                    </Badge>
                  </CardTitle>
                  <span className='font-medium text-right text-foreground text-base'>
                    {formatCurrency(expense.amount)}
                  </span>
                </CardHeader>
                <CardContent className='p-5 pt-0'>
                  <div className='flex justify-between items-center text-sm text-muted-foreground'>
                    <span>
                      {t("expenses.table.date", "Date")}:{" "}
                      {format(new Date(expense.date), "MMM dd, yyyy")}
                    </span>
                    <ExpenseItemActions
                      expense={expense}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
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
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
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
      )}
    </>
  );
};

export default ExpenseItemsTable;
