
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import MonthlyCard from '../MonthlyCard';
import { MONTHS } from '@/constants/months';
import { Separator } from '@/components/ui/separator';

interface SavingsCardGridProps {
  data: MonthlyAmount[];
  onEditMonth: (month: number) => void;
}

const SavingsCardGrid: React.FC<SavingsCardGridProps> = ({ data, onEditMonth }) => {
  // Group data by quarters for better organization
  const quarters = [
    { name: 'Q1', months: [1, 2, 3] },
    { name: 'Q2', months: [4, 5, 6] },
    { name: 'Q3', months: [7, 8, 9] },
    { name: 'Q4', months: [10, 11, 12] }
  ];

  return (
    <div className="mt-6 space-y-8">
      {quarters.map((quarter, quarterIndex) => (
        <div key={quarter.name} className="space-y-4">
          {/* Quarter Header */}
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">{quarter.name}</h3>
            <Separator className="flex-1" />
          </div>
          
          {/* Quarter Months Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quarter.months.map((monthNum) => {
              const monthData = data.find(item => item.month === monthNum);
              if (!monthData) return null;
              
              return (
                <div key={monthNum} className="relative">
                  <MonthlyCard
                    item={monthData}
                    monthName={MONTHS[monthData.month - 1]}
                    onEdit={onEditMonth}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Separator between quarters (except last) */}
          {quarterIndex < quarters.length - 1 && (
            <div className="pt-4">
              <Separator />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SavingsCardGrid;
