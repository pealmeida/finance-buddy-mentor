
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InvestmentHeaderProps {
  onAddClick: () => void;
  onRefreshClick: () => void;
  isLoading: boolean;
  isSaving: boolean;
}

const InvestmentHeader: React.FC<InvestmentHeaderProps> = ({
  onAddClick,
  onRefreshClick,
  isLoading,
  isSaving
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-semibold">{t('investments.portfolioTitle', 'Investment Portfolio')}</h2>
        <p className="text-gray-600">
          {t('investments.portfolioDescription', 'Manage your investments and track their performance.')}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          onClick={onAddClick}
          disabled={isLoading || isSaving}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('investments.addInvestment', 'Add Investment')}
        </Button>
        
        <Button
          variant="outline"
          onClick={onRefreshClick}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? t('common.loading', 'Loading...') : t('common.refresh', 'Refresh')}
        </Button>
      </div>
    </div>
  );
};

export default InvestmentHeader;
