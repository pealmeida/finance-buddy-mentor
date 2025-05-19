
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyInvestmentsProps {
  onAddClick: () => void;
}

const EmptyInvestments: React.FC<EmptyInvestmentsProps> = ({ onAddClick }) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <h3 className="text-gray-600 font-medium mb-2">{t('investments.noInvestmentsYet', 'No Investments Yet')}</h3>
      <p className="text-gray-500 mb-4">{t('investments.startBuilding', 'Start building your portfolio by adding your first investment.')}</p>
      <Button 
        onClick={onAddClick}
        variant="outline"
        className="bg-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('investments.addFirstInvestment', 'Add Your First Investment')}
      </Button>
    </div>
  );
};

export default EmptyInvestments;
