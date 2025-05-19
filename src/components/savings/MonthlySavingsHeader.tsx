
import React from 'react';
import { CircleDollarSign } from 'lucide-react';
import YearSelector from './YearSelector';
import SaveAllButton from './SaveAllButton';
import { useTranslation } from 'react-i18next';

interface MonthlySavingsHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  onSaveAll: () => void;
  disabled: boolean;
  isSaving: boolean;
}

const MonthlySavingsHeader: React.FC<MonthlySavingsHeaderProps> = ({
  selectedYear,
  onYearChange,
  onSaveAll,
  disabled,
  isSaving
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CircleDollarSign className="text-finance-blue" />
          {t('savings.monthlySavings')}
        </h2>
        <div className="flex gap-4 items-center">
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            disabled={disabled}
          />
          
          <SaveAllButton
            onSave={onSaveAll}
            disabled={disabled}
            isSaving={isSaving}
          />
        </div>
      </div>
      
      <p className="text-gray-600">
        {t('savings.trackMonthlySavings', 'Track your monthly savings to visualize your progress throughout the year.')}
      </p>
    </>
  );
};

export default MonthlySavingsHeader;
