
import React from 'react';
import YearSelector from '@/components/savings/YearSelector';
import { useTranslation } from 'react-i18next';

interface SavingsAnalysisHeaderProps {
  selectedYear: number;
  handleYearChange: (year: number) => void;
  loadingData: boolean;
}

const SavingsAnalysisHeader: React.FC<SavingsAnalysisHeaderProps> = ({
  selectedYear,
  handleYearChange,
  loadingData
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">{t('savings.analysis.title')}</h1>
        <p className="text-gray-600 mt-1">
          {t('savings.analysis.subtitle')}
        </p>
      </div>
      
      <div className="mt-4 sm:mt-0">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          disabled={loadingData}
        />
      </div>
    </div>
  );
};

export default SavingsAnalysisHeader;
