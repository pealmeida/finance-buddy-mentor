import React, { useState } from "react";
import { MonthlyAmount } from "@/types/finance";
import { useTranslatedMonths } from "@/constants/months";
import { useCurrency } from "@/context/CurrencyContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../hooks/use-mobile";

interface MonthlyExpensesChartProps {
  data: MonthlyAmount[];
  onSelectMonth: (month: number) => void;
}

const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({
  data,
  onSelectMonth,
}) => {
  const { t } = useTranslation();
  const { getTranslatedMonthsShort } = useTranslatedMonths();
  const { formatCurrency } = useCurrency();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const translatedMonthsShort = getTranslatedMonthsShort();
  const isMobile = useIsMobile();

  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
  const currentYear = new Date().getFullYear();

  const getFilteredChartData = () => {
    if (isMobile) {
      const lastThreeMonths: MonthlyAmount[] = [];
      for (let i = 0; i < 3; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month <= 0) {
          month += 12;
          year -= 1;
        }
        const monthData = data.find(
          (item) => item.month === month && item.year === year
        );
        if (monthData) {
          lastThreeMonths.unshift(monthData); // Add to the beginning to maintain chronological order
        } else {
          // If no data for the month, add a placeholder
          lastThreeMonths.unshift({
            month,
            year,
            amount: 0,
            items: [],
          });
        }
      }
      return lastThreeMonths.map((item) => ({
        name: translatedMonthsShort[item.month - 1],
        month: item.month,
        amount: item.amount,
        hasDetails: Array.isArray(item.items) && item.items.length > 0,
      }));
    }
    return data.map((item) => ({
      name: translatedMonthsShort[item.month - 1],
      month: item.month,
      amount: item.amount,
      hasDetails: Array.isArray(item.items) && item.items.length > 0,
    }));
  };

  const chartData = getFilteredChartData();

  // Define a type for the chart click event data
  type ChartClickEvent = {
    activePayload?: Array<{
      payload: {
        month: number;
        name: string;
        amount: number;
        hasDetails?: boolean;
      };
    }>;
  };

  const handleBarClick = (data: ChartClickEvent) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload;
      onSelectMonth(clickedData.month);
    }
  };

  const handleMouseEnter = (_data: unknown, index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-medium text-lg'>{t("expenses.monthlyExpenses")}</h3>
        <div className='flex items-center gap-1 text-sm text-gray-500'>
          <Info className='h-4 w-4' />
          {t("expenses.clickBarInfo")}
        </div>
      </div>

      <div className='w-full h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={handleBarClick}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='name'
              tick={{ fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              formatter={(value) => [
                formatCurrency(Number(value)),
                t("common.amount"),
              ]}
              labelFormatter={(label) => `${t("common.month")}: ${label}`}
              cursor={{ fill: "rgba(239, 68, 68, 0.1)" }}
            />
            <Legend formatter={() => t("expenses.monthlyExpenses")} />
            <Bar
              dataKey='amount'
              name={t("expenses.monthlyExpenses")}
              fill='#ef4444'
              radius={[4, 4, 0, 0]}
              style={{ cursor: "pointer" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hoverIndex === index ? "#dc2626" : "#ef4444"}
                  style={{
                    filter: entry.hasDetails
                      ? "drop-shadow(0 0 4px rgba(220, 38, 38, 0.3))"
                      : "none",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(MonthlyExpensesChart);
