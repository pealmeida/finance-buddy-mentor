import React from "react";
import { MonthlyAmount } from "../../types/finance";
import { useTranslatedMonths } from "../../constants/months";
import { useCurrency } from "../../context/CurrencyContext";

interface MonthlyCardProps {
  item: MonthlyAmount;
  monthName: string;
  onEdit: (month: number) => void;
}

const MonthlyCard: React.FC<MonthlyCardProps> = ({
  item,
  monthName,
  onEdit,
}) => {
  const { getTranslatedMonths } = useTranslatedMonths();
  const { formatCurrency } = useCurrency();
  const translatedMonths = getTranslatedMonths();
  const translatedMonthName = translatedMonths[item.month - 1] || monthName;

  return (
    <div
      className='bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border'
      onClick={() => onEdit(item.month)}>
      <div className='flex justify-between items-center'>
        <div className='text-lg font-medium text-gray-900'>
          {translatedMonthName}
        </div>
        <div
          className={`text-lg font-bold ${
            item.amount > 0 ? "text-green-600" : "text-gray-500"
          }`}>
          {formatCurrency(item.amount)}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MonthlyCard);
