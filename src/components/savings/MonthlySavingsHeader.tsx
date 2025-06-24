import React from "react";
import { CircleDollarSign } from "lucide-react";
import YearSelector from "./YearSelector";
import { useTranslation } from "react-i18next";

interface MonthlySavingsHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  disabled: boolean;
}

const MonthlySavingsHeader: React.FC<MonthlySavingsHeaderProps> = ({
  selectedYear,
  onYearChange,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <div className='flex justify-between items-center gap-4 mb-4'>
      <p className='text-gray-600'>
        {t(
          "savings.trackMonthlySavings",
          "Track your monthly savings to visualize your progress throughout the year."
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

export default MonthlySavingsHeader;
