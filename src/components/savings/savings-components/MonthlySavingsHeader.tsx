
import React from 'react';
import { CircleDollarSign, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import YearSelector from '../YearSelector';
import { useTranslation } from 'react-i18next';

interface MonthlySavingsHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  onSaveAll: () => void;
  onRefresh: () => void;
  disabled: boolean;
  isSaving: boolean;
}

const MonthlySavingsHeader: React.FC<MonthlySavingsHeaderProps> = ({
  selectedYear,
  onYearChange,
  onSaveAll,
  onRefresh,
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
          
          <Button 
            onClick={onSaveAll}
            className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark"
            disabled={disabled || isSaving}
          >
            {isSaving ? (
              <>{t('common.saving')}</>
            ) : (
              <>
                <Save size={16} />
                {t('common.save')} {t('common.viewAll')}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${disabled ? 'animate-spin' : ''}`} />
            {disabled ? t('common.loading') : t('common.refresh')}
          </Button>
        </div>
      </div>
      
      <p className="text-gray-600">
        {t('savings.trackMonthlySavings')}
      </p>
    </>
  );
};

export default MonthlySavingsHeader;
