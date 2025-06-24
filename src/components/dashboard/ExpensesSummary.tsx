import React, { useState, useMemo } from "react";
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
import { useTranslatedMonths } from "../../constants/months";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useMonthlyExpenses } from "../../hooks/supabase/useMonthlyExpenses";
import { useCurrency } from "../../context/CurrencyContext";
import { formatNumber } from "../../lib/utils";

interface ExpensesSummaryProps {
  userProfile: UserProfile;
  expensesRatio: number;
  savingsRatio?: number; // Optional: Compare with savings
}

const ExpensesSummary: React.FC<ExpensesSummaryProps> = ({
  userProfile,
  expensesRatio,
  savingsRatio,
}) => {
  const { t } = useTranslation();
  const { getTranslatedMonthsShort } = useTranslatedMonths();
  const { formatCurrency } = useCurrency();
  const currentYear = new Date().getFullYear();
  const {
    expensesData,
    isLoading: loading,
    error,
  } = useMonthlyExpenses(userProfile.id, currentYear);
  const [viewMode, setViewMode] = useState<"3months" | "yearly">("3months");

  const chartData = useMemo(() => {
    const allMonthsData = expensesData.map((item) => ({
      month: getTranslatedMonthsShort()[item.month - 1],
      amount: item.amount,
    }));

    if (viewMode === "yearly") {
      return allMonthsData;
    } else {
      const currentMonthIndex = new Date().getMonth();
      // Get last 3 months, including the current one.
      return allMonthsData.slice(
        Math.max(0, currentMonthIndex - 2),
        currentMonthIndex + 1
      );
    }
  }, [expensesData, viewMode, getTranslatedMonthsShort]);

  const hasExpenses = useMemo(
    () => expensesData.some((item) => item.amount > 0),
    [expensesData]
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
    <Card
      className='overflow-hidden'
      style={{ backgroundColor: "rgb(255, 255, 255)" }}>
      <CardHeader className='pb-4'>
        <CardTitle className='text-xl font-semibold'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-red-50 border border-red-100'>
              <Wallet className='h-5 w-5 text-red-500' />
            </div>
            {t("dashboard.expensesSummary")}
          </div>
        </CardTitle>

        <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
          <div className='flex items-center gap-3'>
            <Badge
              variant={status.color}
              className='text-sm py-1 px-3 font-medium'>
              {status.label}
            </Badge>
            <div className='flex items-center gap-1 text-gray-500'>
              <span className='text-lg font-semibold text-gray-700'>
                {Math.round(expensesRatio)}%
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className='h-4 w-4 cursor-help' />
                </TooltipTrigger>
                <TooltipContent>{t("expenses.ratioTooltip")}</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-500 uppercase tracking-wide font-medium'>
              {t("expenses.period")}
            </p>
            <p className='text-sm font-medium text-gray-700'>
              {viewMode === "3months"
                ? t("expenses.last3Months")
                : t("expenses.thisYear")}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='px-6 pb-6'>
        {loading ? (
          <div className='h-[220px] flex flex-col items-center justify-center gap-3'>
            <div className='animate-pulse flex flex-col items-center gap-2'>
              <Skeleton className='h-4 w-[180px]' />
              <Skeleton className='h-3 w-[120px]' />
            </div>
          </div>
        ) : error ? (
          <div className='h-[220px] flex flex-col items-center justify-center gap-4 text-center'>
            <div className='p-3 rounded-full bg-red-50'>
              <Wallet className='h-8 w-8 text-red-400' />
            </div>
            <div>
              <p className='text-red-600 font-medium mb-2'>{error.message}</p>
              <Button
                variant='outline'
                size='sm'
                onClick={() => window.location.reload()}
                className='text-red-600 border-red-200 hover:bg-red-50'>
                {t("common.retry")}
              </Button>
            </div>
          </div>
        ) : !hasExpenses ? (
          <div className='h-[220px] flex flex-col items-center justify-center gap-4 text-center'>
            <div className='p-4 rounded-full bg-gray-50'>
              <Wallet className='h-8 w-8 text-gray-300' />
            </div>
            <div>
              <p className='text-gray-600 font-medium mb-1'>
                {t("expenses.noData")}
              </p>
              <p className='text-sm text-gray-500 mb-4'>
                {t("expenses.startTracking")}
              </p>
              <Link to='/monthly-expenses'>
                <Button
                  variant='outline'
                  className='bg-gradient-to-r from-red-50 to-orange-50 border-red-200 text-red-600 hover:from-red-100 hover:to-orange-100 hover:border-red-300'>
                  {t("expenses.addExpenses")}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {chartData.length > 0 && (
              <div className='w-full h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient
                        id='redGradient'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'>
                        <stop offset='0%' stopColor='#ef4444' />
                        <stop
                          offset='100%'
                          stopColor='rgba(239, 68, 68, 0.3)'
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis
                      dataKey='month'
                      tick={{ fill: "#6b7280" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tick={{ fill: "#6b7280" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => [
                        `${formatCurrency(Number(value))
                          .split(",")[0]
                          .replace(" ", "")}`,
                        t("expenses.amount"),
                      ]}
                      labelFormatter={(label) =>
                        `${t("common.month")}: ${label}`
                      }
                      cursor={{ fill: "rgba(239, 68, 68, 0.1)" }}
                    />
                    <Bar
                      dataKey='amount'
                      fill='url(#redGradient)'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  setViewMode(viewMode === "3months" ? "yearly" : "3months")
                }
                className='text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg px-4 py-2'>
                {viewMode === "3months"
                  ? t("expenses.viewAnnual")
                  : t("expenses.view3Months")}
              </Button>

              <Link to='/monthly-expenses'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='group text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-4 py-2 font-medium'>
                  {t("expenses.viewDetailed")}
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesSummary;
