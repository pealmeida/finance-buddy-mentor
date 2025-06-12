import React from "react";
import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

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
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4'>
        <h2 className='text-xl md:text-2xl font-semibold flex items-center gap-2'>
          <DollarSign className='text-red-500 h-5 w-5 md:h-6 md:w-6' />
          {t("expenses.monthlyExpenses")}
        </h2>

        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto'>
          <div className='flex'>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              disabled={disabled}
              className='px-3 py-2 border border-gray-300 rounded-md bg-white text-sm md:text-base min-w-0'>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className='text-gray-600 text-sm md:text-base'>
        {t(
          "expenses.trackMonthlyExpenses",
          "Track your monthly expenses to visualize your spending patterns throughout the year."
        )}
      </p>
    </>
  );
};

export default MonthlyExpensesHeader;
