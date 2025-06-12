import React, { useState, useEffect, useCallback } from "react";
import { UserProfile, MonthlyAmount } from "../../types/finance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Wallet, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { MONTHS } from "../../constants/months";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useExpenses } from "../../hooks/supabase/useExpenses";

interface ExpensesSummaryProps {
  userProfile: UserProfile;
  expensesRatio: number;
  savingsRatio?: number; // Optional: Compare with savings
}

interface ExpensesDataPoint extends MonthlyAmount {
  monthName: string;
}

const ExpensesSummary: React.FC<ExpensesSummaryProps> = ({
  userProfile,
  expensesRatio,
  savingsRatio,
}) => {
  const { t } = useTranslation();
  const { getExpenses } = useExpenses(userProfile.id, new Date().getFullYear());
  const [expensesData, setExpensesData] = useState<ExpensesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"3months" | "yearly">("3months");

  const fetchAndProcessExpenses = useCallback(async () => {
    if (!userProfile?.id) {
      console.log("User profile ID is missing.", userProfile);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      let dataToFetch: { month: number; year: number }[];

      if (viewMode === "yearly") {
        dataToFetch = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          year: currentYear,
        }));
      } else {
        const months: { month: number; year: number }[] = [];
        for (let i = 0; i < 3; i++) {
          const d = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
          );
          months.push({
            month: d.getMonth() + 1,
            year: d.getFullYear(),
          } as { month: number; year: number });
        }
        dataToFetch = months.reverse();
      }

      console.log("Data to fetch (months/years):", dataToFetch);

      const expensesPromises = dataToFetch.map(async ({ month, year }) => {
        console.log(`Fetching expenses for month: ${month}, year: ${year}`);
        const items = await getExpenses(userProfile.id, month, year);
        console.log(`Received items for ${month}/${year}:`, items);
        const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);
        console.log(`Total amount for ${month}/${year}:`, totalAmount);

        return {
          month,
          amount: totalAmount,
          monthName: MONTHS[month - 1],
        };
      });

      const finalData = await Promise.all(expensesPromises);
      console.log(
        "Final processed data for chart (before setting state):",
        finalData
      );
      setExpensesData(finalData);
      console.log("Expenses data set to state.");
    } catch (err: unknown) {
      setError(t("errors.expensesFetchFailed"));
      console.error("Error fetching expenses data:", err);
    } finally {
      setLoading(false);
    }
  }, [userProfile?.id, viewMode, getExpenses, t]);

  useEffect(() => {
    fetchAndProcessExpenses();
  }, [fetchAndProcessExpenses]);

  const chartData = expensesData.map((item) => ({
    month: item.monthName.substring(0, 3),
    amount: item.amount,
  }));

  console.log("Current expensesData state:", expensesData);
  console.log("Chart data prepared for Recharts:", chartData);

  const hasExpenses = expensesData.some((item) => item.amount > 0);

  console.log(
    "Does expensesData contain any items with amount > 0?",
    hasExpenses
  );

  const getStatusInfo = () => {
    if (expensesRatio > 70) {
      return {
        label: t("expenses.highSpending"),
        color: "destructive" as const,
      };
    } else if (expensesRatio > 50) {
      return {
        label: t("expenses.moderateSpending"),
        color: "secondary" as const,
      };
    } else {
      return {
        label: t("expenses.lowSpending"),
        color: "outline" as const,
      };
    }
  };

  const status = getStatusInfo();

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-lg font-medium'>
          <div className='flex items-center gap-2'>
            <Wallet className='h-5 w-5 text-red-500' />
            {t("dashboard.expensesSummary")}
          </div>
        </CardTitle>
        <div className='flex items-center gap-2'>
          <Badge variant={status.color}>
            {status.label} ({Math.round(expensesRatio)}%)
          </Badge>
          <Tooltip>
            <TooltipTrigger>
              <Info className='h-4 w-4 text-gray-500' />
            </TooltipTrigger>
            <TooltipContent>
              {t(
                "expenses.ratioTooltip",
                "Percentage of income spent on expenses"
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='h-[200px] flex flex-col items-center justify-center gap-2'>
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='h-4 w-[150px]' />
          </div>
        ) : error ? (
          <div className='h-[200px] flex flex-col items-center justify-center gap-2 text-red-500'>
            <p>{error}</p>
            <Button
              variant='outline'
              size='sm'
              onClick={() => window.location.reload()}>
              {t("common.retry")}
            </Button>
          </div>
        ) : hasExpenses ? (
          <>
            <div className='h-[200px] mt-2'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(value) => [`$${value}`, t("common.amount")]}
                    labelFormatter={(label) => `${t("common.month")}: ${label}`}
                  />
                  <Bar dataKey='amount' fill='#ef4444' radius={[4, 4, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#expensesGradient)`}
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient
                      id='expensesGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'>
                      <stop offset='5%' stopColor='#ef4444' stopOpacity={0.8} />
                      <stop
                        offset='95%'
                        stopColor='#ef4444'
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {savingsRatio && (
              <div className='mt-4 text-sm text-gray-600'>
                {t(
                  "expenses.savingsComparison",
                  "Savings: {{savingsRatio}}% of income",
                  {
                    savingsRatio: Math.round(savingsRatio),
                  }
                )}
              </div>
            )}
            <div className='mt-4 flex justify-between items-center'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  setViewMode(viewMode === "3months" ? "yearly" : "3months")
                }>
                {viewMode === "3months"
                  ? t("expenses.viewYearly")
                  : t("expenses.viewLast3Months")}
              </Button>
              <Link
                to='/monthly-expenses'
                className='inline-flex items-center text-sm text-blue-600 hover:text-blue-800'>
                {t("expenses.viewDetailed")}{" "}
                <ArrowRight className='ml-1 h-4 w-4' />
              </Link>
            </div>
          </>
        ) : (
          <div className='h-[200px] flex flex-col items-center justify-center gap-2 text-center'>
            <p className='text-gray-500'>
              {t("expenses.noData", "No expense data for this period.")}
            </p>
            <p className='text-sm text-gray-400'>
              {t(
                "expenses.noDataHint",
                "Get started by adding your first expense entry."
              )}
            </p>
            <Button asChild variant='secondary' size='sm' className='mt-2'>
              <Link to='/expenses/add'>
                {t("expenses.addFirstExpense", "Add Expense")}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesSummary;
