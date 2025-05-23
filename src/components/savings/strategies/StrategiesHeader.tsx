
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface StrategiesHeaderProps {
  title: string;
}

const StrategiesHeader: React.FC<StrategiesHeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <Button 
        variant="outline" 
        className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white transition-all duration-300"
      >
        {t('common.viewAll', 'See All')}
      </Button>
    </div>
  );
};

export default StrategiesHeader;
