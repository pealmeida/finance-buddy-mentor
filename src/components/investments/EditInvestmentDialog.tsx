
import React from 'react';
import { Investment } from '@/types/finance';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InvestmentForm from './InvestmentForm';
import { useTranslation } from 'react-i18next';

interface EditInvestmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  investment: Investment | null;
  onSubmit: (investment: Investment) => Promise<boolean>;
  onCancel: () => void;
  isSaving: boolean;
}

const EditInvestmentDialog: React.FC<EditInvestmentDialogProps> = ({
  isOpen,
  onOpenChange,
  investment,
  onSubmit,
  onCancel,
  isSaving
}) => {
  const { t } = useTranslation();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('investments.editInvestment', 'Edit Investment')}</DialogTitle>
        </DialogHeader>
        {investment && (
          <InvestmentForm
            initialInvestment={investment}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={isSaving}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditInvestmentDialog;
