
import React from 'react';
import { MonthlyAmount } from "@/types/finance";
import MonthlyCard from "./MonthlyCard";
import { MONTHS } from "@/constants/months";

interface MonthlyExpensesGridProps {
  data: MonthlyAmount[];
  onAmountClick: (month: number) => void;
}

const MonthlyExpensesGrid: React.FC<MonthlyExpensesGridProps> = ({
  data,
  onAmountClick
}) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
      {data.map((item) => (
        <MonthlyCard
          key={item.month}
          item={item}
          monthName={MONTHS[item.month - 1]}
          onAmountClick={() => onAmountClick(item.month)}
        />
      ))}
    </div>
  );
};

export default MonthlyExpensesGrid;
