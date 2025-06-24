import React from "react";
import { Investment } from "../../types/finance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import InvestmentForm from "./InvestmentForm";
import { useTranslation } from "react-i18next";
import { Currency } from "../../context/CurrencyContext";
import { useResponsive } from "../../hooks/use-responsive";
import { cn } from "../../lib/utils";

interface EditInvestmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  investment: Investment | null;
  onSubmit: (investment: Investment) => Promise<boolean>;
  onCancel: () => void;
  isSaving: boolean;
  userPreferredCurrency?: Currency;
}

const EditInvestmentDialog: React.FC<EditInvestmentDialogProps> = ({
  isOpen,
  onOpenChange,
  investment,
  onSubmit,
  onCancel,
  isSaving,
  userPreferredCurrency,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  const dialogTitle = t("investments.editInvestment", "Edit Investment");

  // Render mobile sheet for mobile devices
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side='bottom'
          className={cn(
            "h-[95vh] w-full rounded-t-lg border-t",
            "flex flex-col overflow-hidden",
            "p-0"
          )}>
          <SheetHeader className='sticky top-0 z-10 bg-background border-b px-6 py-4'>
            <div className='flex justify-between items-center'>
              <SheetTitle className='text-lg font-semibold'>
                {dialogTitle}
              </SheetTitle>
              <button
                onClick={() => onOpenChange(false)}
                className='rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
                <span className='sr-only'>Close</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <line x1='18' y1='6' x2='6' y2='18' />
                  <line x1='6' y1='6' x2='18' y2='18' />
                </svg>
              </button>
            </div>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6 pb-6'>
            {investment && (
              <InvestmentForm
                initialInvestment={investment}
                onSubmit={async (investmentData) => {
                  // Cast to Investment since we know it will have an id from initialInvestment
                  return await onSubmit(investmentData as Investment);
                }}
                onCancel={onCancel}
                isSubmitting={isSaving}
                userPreferredCurrency={userPreferredCurrency}
                isMobile={true}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Render desktop dialog for desktop devices
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {t(
              "investments.editInvestmentDescription",
              "Update the details of your investment."
            )}
          </DialogDescription>
        </DialogHeader>
        {investment && (
          <InvestmentForm
            initialInvestment={investment}
            onSubmit={async (investmentData) => {
              // Cast to Investment since we know it will have an id from initialInvestment
              return await onSubmit(investmentData as Investment);
            }}
            onCancel={onCancel}
            isSubmitting={isSaving}
            userPreferredCurrency={userPreferredCurrency}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditInvestmentDialog;
