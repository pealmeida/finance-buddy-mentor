import React from "react";
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
import { Investment } from "../../types/finance";
import { Currency } from "../../context/CurrencyContext";
import { useResponsive } from "../../hooks/use-responsive";
import { cn } from "../../lib/utils";

interface AddInvestmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (investment: Omit<Investment, "id">) => Promise<boolean>;
  isSubmitting?: boolean;
  initialValues?: Partial<Omit<Investment, "id">>;
  userPreferredCurrency?: Currency;
}

const AddInvestmentDialog: React.FC<AddInvestmentDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  initialValues,
  userPreferredCurrency,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  const dialogTitle = t("investments.addInvestment", "Add New Investment");

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
            <InvestmentForm
              initialInvestment={initialValues as Investment}
              onSubmit={onSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
              userPreferredCurrency={userPreferredCurrency}
              isMobile={true}
            />
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
              "investments.addInvestmentDescription",
              "Add a new investment to your portfolio and track its performance."
            )}
          </DialogDescription>
        </DialogHeader>
        <InvestmentForm
          initialInvestment={initialValues as Investment}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          userPreferredCurrency={userPreferredCurrency}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestmentDialog;
