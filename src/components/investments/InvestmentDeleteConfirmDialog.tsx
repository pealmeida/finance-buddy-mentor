import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Investment } from "../../types/finance";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../../lib/utils";
import { Shield, AlertTriangle } from "lucide-react";
import { useResponsive } from "../../hooks/use-responsive";
import { cn } from "../../lib/utils";

interface InvestmentDeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  investment: Investment | null;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const InvestmentDeleteConfirmDialog: React.FC<
  InvestmentDeleteConfirmDialogProps
> = ({ isOpen, onOpenChange, investment, onConfirm, isDeleting = false }) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  if (!investment) return null;

  // Check if this is an emergency fund investment
  const isEmergencyFund =
    investment.isEmergencyFund ||
    investment.name.toLowerCase().includes("emergency") ||
    investment.name.toLowerCase().includes("emergência") ||
    investment.name.toLowerCase().includes("fundo de emergência");

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const dialogTitle = t("investments.deleteInvestment", "Delete Investment");

  const contentSection = (
    <div className='space-y-3'>
      <p className='text-gray-600'>
        {t(
          "investments.deleteConfirmMessage",
          "Are you sure you want to delete this investment? This action cannot be undone."
        )}
      </p>

      {/* Investment details */}
      <div className='p-3 bg-gray-50 rounded-lg border'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='font-medium text-gray-900 truncate'>
            {investment.name}
          </h4>
          {isEmergencyFund && (
            <div className='flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded'>
              <Shield className='h-3 w-3' />
              {t("investments.emergency", "Emergency")}
            </div>
          )}
        </div>
        <div className='flex justify-between items-center text-sm'>
          <span className='text-gray-600'>
            {t("investments.currentValue", "Current Value")}:
          </span>
          <span className='font-semibold text-gray-900'>
            ${formatNumber(investment.value, 2)}
          </span>
        </div>
      </div>

      {isEmergencyFund && (
        <div className='p-3 bg-amber-50 border border-amber-200 rounded-lg'>
          <p className='text-sm text-amber-800'>
            <strong>{t("investments.warning", "Warning")}:</strong>{" "}
            {t(
              "investments.emergencyFundDeleteWarning",
              "You are about to delete an emergency fund investment. Make sure you have alternative emergency savings."
            )}
          </p>
        </div>
      )}
    </div>
  );

  // Render mobile sheet for mobile devices
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side='bottom'
          className={cn(
            "h-auto w-full rounded-t-lg border-t",
            "flex flex-col overflow-hidden",
            "p-0"
          )}>
          <SheetHeader className='sticky top-0 z-10 bg-background border-b px-6 py-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-full bg-red-100'>
                <AlertTriangle className='h-5 w-5 text-red-600' />
              </div>
              <SheetTitle className='text-lg font-semibold'>
                {dialogTitle}
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className='flex-1 p-6 space-y-4'>{contentSection}</div>

          <div className='sticky bottom-0 border-t bg-background p-6'>
            <div className='flex gap-2 w-full'>
              <Button
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isDeleting}
                className='flex-1'>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isDeleting}
                className='flex-1 bg-red-600 hover:bg-red-700 text-white'>
                {isDeleting
                  ? t("investments.deleting", "Deleting...")
                  : t("investments.confirmDelete", "Delete Investment")}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Render desktop alert dialog for desktop devices
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className='max-w-md'>
        <AlertDialogHeader>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-full bg-red-100'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
            </div>
            <AlertDialogTitle className='text-lg font-semibold'>
              {dialogTitle}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        <AlertDialogDescription asChild>
          {contentSection}
        </AlertDialogDescription>

        <AlertDialogFooter className='gap-2'>
          <AlertDialogCancel disabled={isDeleting}>
            {t("common.cancel", "Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-500'>
            {isDeleting
              ? t("investments.deleting", "Deleting...")
              : t("investments.confirmDelete", "Delete Investment")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InvestmentDeleteConfirmDialog;
