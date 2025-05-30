
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import { useTranslatedMonths } from '@/constants/months';
import { useCurrency } from '@/context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MonthlySavingsChartProps {
  data: MonthlyAmount[];
  onSelectMonth: (month: number) => void;
}

const MonthlySavingsChart: React.FC<MonthlySavingsChartProps> = ({ 
  data, 
  onSelectMonth 
}) => {
  const { t } = useTranslation();
  const { getTranslatedMonthsShort } = useTranslatedMonths();
  const { currencyConfig } = useCurrency();
  const translatedMonthsShort = getTranslatedMonthsShort();
  
  // Transform data for the chart
  const chartData = data.map(item => ({
    name: translatedMonthsShort[item.month - 1],
    month: item.month,
    amount: typeof item.amount === 'number' ? item.amount : 0
  }));
  
  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload;
      onSelectMonth(clickedData.month);
    }
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={handleBarClick}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tickFormatter={(value) => `${currencyConfig.symbol}${value}`}
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            formatter={(value) => [`${currencyConfig.symbol}${value}`, t('common.amount')]}
            labelFormatter={(label) => `${t('common.month')}: ${label}`}
          />
          <Legend 
            formatter={() => t('savings.monthlySavings')}
          />
          <Bar 
            dataKey="amount" 
            name={t('savings.monthlySavings')} 
            fill="#4f46e5" 
            radius={[4, 4, 0, 0]}
            style={{ cursor: 'pointer' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(MonthlySavingsChart);
