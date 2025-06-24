import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Shield, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Checkbox } from "../ui/checkbox";
import { useCurrency } from "../../context/CurrencyContext";
import { useResponsive } from "../../hooks/use-responsive";
import { cn } from "../../lib/utils";

interface EmergencyFundInvestmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyFundAmount: number;
  onOpenInvestmentDialog: () => void;
}

const EmergencyFundInvestmentDialog: React.FC<
  EmergencyFundInvestmentDialogProps
> = ({ isOpen, onClose, emergencyFundAmount, onOpenInvestmentDialog }) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const { isMobile } = useResponsive();
  const [acknowledgedSafety, setAcknowledgedSafety] = useState(false);
  const [acknowledgedLiquidity, setAcknowledgedLiquidity] = useState(false);

  const handleOpenInvestmentDialog = () => {
    onOpenInvestmentDialog();
    onClose();
    setAcknowledgedSafety(false);
    setAcknowledgedLiquidity(false);
  };

  const handleClose = () => {
    onClose();
    setAcknowledgedSafety(false);
    setAcknowledgedLiquidity(false);
  };

  const canProceed = acknowledgedSafety && acknowledgedLiquidity;

  const dialogTitle = t(
    "dashboard.emergencyFundInvestmentTitle",
    "Add Emergency Fund to Investments"
  );

  const dialogDescription = t(
    "dashboard.emergencyFundInvestmentDescription",
    "Would you like to track your emergency fund as part of your investment portfolio?"
  );

  const contentSection = (
    <div className='space-y-4'>
      <div className='p-4 bg-blue-50 rounded-lg'>
        <div className='flex items-center gap-2 mb-2'>
          <CheckCircle className='h-4 w-4 text-green-600' />
          <span className='font-medium text-sm'>
            {t("dashboard.emergencyFundAmount", "Emergency Fund Amount")}:{" "}
            {formatCurrency(emergencyFundAmount)}
          </span>
        </div>
      </div>

      <Alert>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          <div className='space-y-2'>
            <p className='font-medium'>
              {t(
                "dashboard.emergencyFundSafetyWarning",
                "⚠️ Important Safety Requirements"
              )}
            </p>
            <p className='text-sm'>
              {t(
                "dashboard.emergencyFundSafetyText",
                "Your emergency fund should ONLY be considered as an investment if it's allocated in safe, liquid instruments such as:"
              )}
            </p>
            <ul className='text-sm ml-4 space-y-1 list-disc'>
              <li>
                {t(
                  "dashboard.safeInvestmentFixedIncome",
                  "Fixed Income securities"
                )}
              </li>
              <li>
                {t(
                  "dashboard.safeInvestmentBonds",
                  "Government or high-grade corporate bonds"
                )}
              </li>
              <li>
                {t(
                  "dashboard.safeInvestmentCash",
                  "Cash equivalents and savings accounts"
                )}
              </li>
              <li>
                {t(
                  "dashboard.safeInvestmentInsured",
                  "Financial instruments secured by FDIC, FGC, or official federal deposit insurance"
                )}
              </li>
              <li>
                {t(
                  "dashboard.safeInvestmentMMF",
                  "Money market funds or high-liquidity CDBs"
                )}
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <div className='space-y-3'>
        <div className='flex items-start space-x-2'>
          <Checkbox
            id='safety-acknowledgment'
            checked={acknowledgedSafety}
            onCheckedChange={(checked) =>
              setAcknowledgedSafety(checked === true)
            }
          />
          <label htmlFor='safety-acknowledgment' className='text-sm'>
            {t(
              "dashboard.acknowledgeSafety",
              "I confirm that my emergency fund is invested only in safe, low-risk instruments as listed above"
            )}
          </label>
        </div>

        <div className='flex items-start space-x-2'>
          <Checkbox
            id='liquidity-acknowledgment'
            checked={acknowledgedLiquidity}
            onCheckedChange={(checked) =>
              setAcknowledgedLiquidity(checked === true)
            }
          />
          <label htmlFor='liquidity-acknowledgment' className='text-sm'>
            {t(
              "dashboard.acknowledgeLiquidity",
              "I understand that emergency funds must remain highly liquid and accessible within 24-48 hours"
            )}
          </label>
        </div>
      </div>
    </div>
  );

  // Render mobile sheet for mobile devices
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent
          side='bottom'
          className={cn(
            "h-[95vh] w-full rounded-t-lg border-t",
            "flex flex-col overflow-hidden",
            "p-0"
          )}>
          <SheetHeader className='sticky top-0 z-10 bg-background border-b px-6 py-4'>
            <div className='flex items-center gap-2'>
              <Shield className='h-5 w-5 text-finance-blue' />
              <SheetTitle className='text-lg font-semibold'>
                {dialogTitle}
              </SheetTitle>
            </div>
            <p className='text-sm text-muted-foreground mt-2'>
              {dialogDescription}
            </p>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6 py-4'>
            {contentSection}
          </div>

          <div className='sticky bottom-0 border-t bg-background p-6'>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={handleClose}
                className='flex-1'>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                onClick={handleOpenInvestmentDialog}
                disabled={!canProceed}
                className='flex-1 bg-finance-blue hover:bg-finance-blue/90'>
                {t("investments.addInvestment", "Add Investment")}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Render desktop dialog for desktop devices
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5 text-finance-blue' />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {contentSection}

        <DialogFooter className='flex gap-2'>
          <Button variant='outline' onClick={handleClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleOpenInvestmentDialog}
            disabled={!canProceed}
            className='bg-finance-blue hover:bg-finance-blue/90'>
            {t("investments.addInvestment", "Add Investment")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyFundInvestmentDialog;
