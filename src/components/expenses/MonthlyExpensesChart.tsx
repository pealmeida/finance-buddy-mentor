
import React, { useState } from "react";
import { MonthlyAmount } from "@/types/finance";
import { MONTHS_SHORT } from "@/constants/months";
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
import { useTranslation } from "react-i18next";

interface MonthlyExpensesChartProps {
  data: MonthlyAmount[];
}

const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({
  data,
}) => {
  const { t } = useTranslation();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const chartData = data.map((item) => ({
    name: MONTHS_SHORT[item.month - 1],
    month: item.month,
    amount: item.amount,
  }));

  const handleMouseEnter = (_data: unknown, index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-medium text-lg'>{t('expenses.monthlyExpenses')}</h3>
      </div>

      <div className='w-full h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='name'
              tick={{ fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              formatter={(value) => [`$${value}`, t('common.amount')]}
              labelFormatter={(label) => `${t('common.month')}: ${label}`}
              cursor={{ fill: "rgba(239, 68, 68, 0.1)" }}
            />
            <Legend
              formatter={(value) => (
                <span className='text-gray-700'>{t('expenses.monthlyExpenses')}</span>
              )}
            />
            <Bar
              dataKey='amount'
              name={t('expenses.monthlyExpenses')}
              fill='#ef4444'
              radius={[4, 4, 0, 0]}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hoverIndex === index ? "#dc2626" : "#ef4444"}
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
