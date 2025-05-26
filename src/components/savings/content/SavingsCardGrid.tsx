
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
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((monthData) => (
          <div key={monthData.month} className="relative">
            <MonthlyCard
              item={monthData}
              monthName={MONTHS[monthData.month - 1]}
              onEdit={onEditMonth}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsCardGrid;
