import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InvestmentForm from './InvestmentForm';
import { useTranslation } from 'react-i18next';
import { Investment } from '@/types/finance';

interface AddInvestmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (investment: Omit<Investment, 'id'>) => Promise<boolean>;
  isSubmitting?: boolean;
}

const AddInvestmentDialog: React.FC<AddInvestmentDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting = false
}) => {
  const { t } = useTranslation();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('investments.addInvestment', 'Add New Investment')}</DialogTitle>
        </DialogHeader>
        <InvestmentForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestmentDialog;