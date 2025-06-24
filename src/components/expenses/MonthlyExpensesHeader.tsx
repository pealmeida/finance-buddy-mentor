import React from "react";
import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import YearSelector from "../savings/YearSelector";

interface MonthlyExpensesHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  disabled: boolean;
}

const MonthlyExpensesHeader: React.FC<MonthlyExpensesHeaderProps> = ({
  selectedYear,
  onYearChange,
  disabled,
}) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className='flex justify-between items-center gap-4 mb-4'>
      <p className='text-gray-600'>
        {t(
          "expenses.trackMonthlyExpenses",
          "Track your monthly expenses to visualize your spending patterns throughout the year."
        )}
      </p>
      <YearSelector
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        disabled={disabled}
      />
    </div>
  );
};

export default MonthlyExpensesHeader;
