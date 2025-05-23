
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const ActionButton: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Button className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2">
      {t('investments.getDetailedPlan', 'Get Detailed Plan')}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
};

export default ActionButton;
