
import React from 'react';
import { CircleDollarSign, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import YearSelector from '../YearSelector';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
          <CircleDollarSign className="text-finance-blue h-5 w-5 md:h-6 md:w-6" />
          {t('savings.monthlySavings')}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            disabled={disabled}
          />
          
          <div className="flex gap-2 sm:gap-3">
            <Button 
              onClick={onSaveAll}
              className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark flex-1 sm:flex-none text-sm"
              disabled={disabled || isSaving}
              size={isMobile ? "sm" : "default"}
            >
              {isSaving ? (
                <>{t('common.saving')}</>
              ) : (
                <>
                  <Save size={16} />
                  <span className="hidden sm:inline">{t('common.save')} {t('common.viewAll')}</span>
                  <span className="sm:hidden">{t('common.save')}</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={disabled}
              className="flex items-center gap-2 flex-1 sm:flex-none text-sm"
              size={isMobile ? "sm" : "default"}
            >
              <RefreshCw className={`h-4 w-4 ${disabled ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{disabled ? t('common.loading') : t('common.refresh')}</span>
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm md:text-base">
        {t('savings.trackMonthlySavings')}
      </p>
    </>
  );
};

export default MonthlySavingsHeader;
