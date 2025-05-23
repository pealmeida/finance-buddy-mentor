
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MonthlyExpensesHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  onSaveAll: () => void;
  disabled: boolean;
  isSaving: boolean;
}

const MonthlyExpensesHeader: React.FC<MonthlyExpensesHeaderProps> = ({
  selectedYear,
  onYearChange,
  onSaveAll,
  disabled,
  isSaving
}) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <DollarSign className="text-red-500" />
          {t('expenses.monthlyExpenses')}
        </h2>
        <div className="flex gap-4 items-center">
          <div className="flex">
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              disabled={disabled}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={onSaveAll}
            disabled={disabled}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t('common.save')} {t('common.viewAll')}
              </>
            )}
          </Button>
        </div>
      </div>
      
      <p className="text-gray-600">
        {t('expenses.trackMonthlyExpenses', 'Track your monthly expenses to visualize your spending patterns throughout the year.')}
      </p>
    </>
  );
};

export default MonthlyExpensesHeader;
