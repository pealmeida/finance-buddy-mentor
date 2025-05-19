
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const InvestmentLoading: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="ml-2">{t('investments.loadingData', 'Loading investments data...')}</span>
    </div>
  );
};

export default InvestmentLoading;
