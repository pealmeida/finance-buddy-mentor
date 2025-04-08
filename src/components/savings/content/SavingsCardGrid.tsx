
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import MonthlyCard from '../MonthlyCard';
import { MONTHS } from '@/constants/months';

interface SavingsCardGridProps {
  data: MonthlyAmount[];
  onEditMonth: (month: number) => void;
}

const SavingsCardGrid: React.FC<SavingsCardGridProps> = ({ data, onEditMonth }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {data.map((item) => (
        <MonthlyCard
          key={item.month}
          item={item}
          monthName={MONTHS[item.month - 1]}
          onEdit={onEditMonth}
        />
      ))}
    </div>
  );
};

export default SavingsCardGrid;
