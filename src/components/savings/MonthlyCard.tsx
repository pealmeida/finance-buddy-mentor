
import React from 'react';
import { MonthlyAmount } from '@/types/finance';

interface MonthlyCardProps {
  item: MonthlyAmount;
  monthName: string;
  onEditMonth: (month: number) => void;
}

const MonthlyCard: React.FC<MonthlyCardProps> = ({
  item,
  monthName,
  onEditMonth
}) => {
  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
      onClick={() => onEditMonth(item.month)}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium">{monthName}</div>
        <div className={`text-lg font-bold ${item.amount > 0 ? 'text-green-600' : 'text-gray-500'}`}>
          ${item.amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default MonthlyCard;
