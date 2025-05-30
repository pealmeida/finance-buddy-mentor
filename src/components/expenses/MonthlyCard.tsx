
import React from 'react';
import { MonthlyAmount } from '@/types/finance';

interface MonthlyCardProps {
  item: MonthlyAmount;
  monthName: string;
  onAmountClick: () => void;
}

const MonthlyCard: React.FC<MonthlyCardProps> = ({
  item,
  monthName,
  onAmountClick
}) => {
  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
      onClick={onAmountClick}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium text-gray-900">{monthName}</div>
        <div className="text-lg font-bold text-red-600">
          ${item.amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default MonthlyCard;
