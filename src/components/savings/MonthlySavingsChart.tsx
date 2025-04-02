
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { MONTHS_SHORT } from '@/constants/months';

interface MonthlySavingsChartProps {
  data: MonthlyAmount[];
  onEditMonth: (month: number) => void;
}

const MonthlySavingsChart: React.FC<MonthlySavingsChartProps> = ({ data, onEditMonth }) => {
  const formattedData = data.map(item => ({
    name: MONTHS_SHORT[item.month - 1],
    month: item.month,
    amount: item.amount
  }));

  const chartConfig = {
    savings: {
      label: "Savings",
      color: "#4f46e5"
    }
  };

  const handleBarClick = (data: any) => {
    if (data && data.month) {
      onEditMonth(data.month);
    }
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-[4/2] w-full"
    >
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={80}
          tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) => `Month: ${label}`}
              formatter={(value) => [`$${value}`]}
            />
          }
        />
        <Legend />
        <Bar
          dataKey="amount"
          name="Savings"
          fill="var(--color-savings)"
          radius={[4, 4, 0, 0]}
          onClick={handleBarClick}
          style={{ cursor: 'pointer' }}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default MonthlySavingsChart;
