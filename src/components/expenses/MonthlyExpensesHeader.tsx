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
    <>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-semibold flex items-center gap-2'>
          <DollarSign className='text-red-500' />
          {t("expenses.monthlyExpenses")}
        </h2>

        <div className='flex gap-4 items-center'>
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            disabled={disabled}
          />
        </div>
      </div>

      <p className='text-gray-600'>
        {t(
          "expenses.trackMonthlyExpenses",
          "Track your monthly expenses to visualize your spending patterns throughout the year."
        )}
      </p>
    </>
  );
};

export default MonthlyExpensesHeader;
