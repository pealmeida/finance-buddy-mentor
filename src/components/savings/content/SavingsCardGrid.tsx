
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import MonthlyCard from '../MonthlyCard';
import { MONTHS } from '@/constants/months';
import ResponsiveGrid from '@/components/ui/responsive-grid';

interface SavingsCardGridProps {
  data: MonthlyAmount[];
  onEditMonth: (month: number) => void;
}

const SavingsCardGrid: React.FC<SavingsCardGridProps> = ({ data, onEditMonth }) => {
  return (
    <div className="mt-6">
      <ResponsiveGrid
        cols={{
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          '2xl': 6
        }}
        gap={{
          xs: 3,
          sm: 4,
          md: 4,
          lg: 4,
          xl: 4,
          '2xl': 4
        }}
      >
        {data.map((item) => (
          <MonthlyCard
            key={item.month}
            item={item}
            monthName={MONTHS[item.month - 1]}
            onEdit={onEditMonth}
          />
        ))}
      </ResponsiveGrid>
    </div>
  );
};

export default SavingsCardGrid;
