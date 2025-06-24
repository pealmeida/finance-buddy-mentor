import React from "react";
import { MonthlyAmount } from "../../types/finance";
import { useTranslatedMonths } from "../../constants/months";
import { useCurrency } from "../../context/CurrencyContext";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Info } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { formatNumber } from "../../lib/utils";

interface MonthlySavingsChartProps {
  data: MonthlyAmount[];
  onSelectMonth: (month: number) => void;
}

const MonthlySavingsChart: React.FC<MonthlySavingsChartProps> = ({
  data,
  onSelectMonth,
}) => {
  const { t } = useTranslation();
  const { getTranslatedMonthsShort } = useTranslatedMonths();
  const { currencyConfig } = useCurrency();
  const translatedMonthsShort = getTranslatedMonthsShort();
  const isMobile = useIsMobile();

  // Transform data for the chart
  const chartData = data.map((item) => ({
    name: translatedMonthsShort[item.month - 1],
    month: item.month,
    amount: typeof item.amount === "number" ? item.amount : 0,
  }));

  // Determine the current month
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

  // Filter data for mobile: show the current month and the two preceding months
  const displayedChartData = isMobile
    ? chartData
        .filter((item) => {
          const monthsToShow: number[] = [];
          for (let i = 0; i < 3; i++) {
            let month = currentMonth - i;
            if (month >= 1) {
              monthsToShow.push(month);
            }
          }
          return monthsToShow.includes(item.month);
        })
        .sort((a, b) => a.month - b.month) // Ensure the data is sorted by month for display
    : chartData;

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload;
      onSelectMonth(clickedData.month);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-medium text-lg'>{t("savings.monthlySavings")}</h3>
        <div className='flex items-center gap-1 text-sm text-gray-500'>
          <Info className='h-4 w-4' />
          {t("common.chart.clickOnBars", "Click on bars to view details")}
        </div>
      </div>
      <div className='w-full h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={displayedChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={handleBarClick}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='name'
              tick={{ fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tickFormatter={(value) =>
                `${currencyConfig.symbol}${formatNumber(value, 0)}`
              }
              tick={{ fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              formatter={(value) => [
                `${currencyConfig.symbol}${formatNumber(Number(value), 0)}`,
                t("common.amount"),
              ]}
              labelFormatter={(label) => `${t("common.month")}: ${label}`}
            />
            <Legend formatter={() => t("savings.monthlySavings")} />
            <Bar
              dataKey='amount'
              name={t("savings.monthlySavings")}
              fill='#4f46e5'
              radius={[4, 4, 0, 0]}
              style={{ cursor: "pointer" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(MonthlySavingsChart);
