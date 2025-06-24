import React, { useState, useMemo } from "react";
import { DollarSign, LineChart, Shield, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useOnboarding } from "../../context/OnboardingContext";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../hooks/use-mobile";
import AddInvestmentDialog from "../investments/AddInvestmentDialog";
import EmergencyFundInvestmentDialog from "../dashboard/EmergencyFundInvestmentDialog";
import { Investment } from "../../types/finance";

interface InvestmentsStepProps {
  isLastStep?: boolean;
  onOpenReview: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const InvestmentsStep: React.FC<InvestmentsStepProps> = ({
  isLastStep = false,
  onOpenReview,
  onPrevious,
  onNext,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isAddInvestmentModalOpen, setIsAddInvestmentModalOpen] =
    useState(false);
  const [showEmergencyFundDialog, setShowEmergencyFundDialog] = useState(false);

  const { profile, addInvestment, removeInvestment } = useOnboarding();

  // Calculate emergency fund amount
  const emergencyFundAmount = useMemo(() => {
    if (
      profile.hasEmergencyFund &&
      profile.emergencyFundMonths &&
      profile.monthlyIncome
    ) {
      return profile.monthlyIncome * profile.emergencyFundMonths;
    }
    return 0;
  }, [
    profile.hasEmergencyFund,
    profile.emergencyFundMonths,
    profile.monthlyIncome,
  ]);

  // Check if emergency fund should be shown as option
  const shouldShowEmergencyFundOption = useMemo(() => {
    return (
      profile.hasEmergencyFund &&
      emergencyFundAmount > 0 &&
      !profile.investments?.some(
        (inv) =>
          inv.name.toLowerCase().includes("emergency") ||
          inv.name.toLowerCase().includes("emergência")
      )
    );
  }, [profile.hasEmergencyFund, emergencyFundAmount, profile.investments]);

  const handleAddInvestment = async (investment: Omit<Investment, "id">) => {
    await addInvestment(investment);
    setIsAddInvestmentModalOpen(false);
    return true;
  };

  const handleAddEmergencyFundToInvestments = async () => {
    if (emergencyFundAmount > 0) {
      const emergencyInvestment = {
        name: t("investments.emergencyFundInvestment", "Emergency Fund"),
        type: "cash" as const,
        value: emergencyFundAmount,
        isEmergencyFund: true,
        purchaseDate: new Date().toISOString().split("T")[0],
      };

      await addInvestment(emergencyInvestment);
    }
    setShowEmergencyFundDialog(false);
  };

  const handleNext = () => {
    console.log(`InvestmentsStep: handleNext - isLastStep: ${isLastStep}`);
    if (isLastStep) {
      console.log("InvestmentsStep: Calling onOpenReview.");
      onOpenReview();
    } else {
      console.log("InvestmentsStep: Calling onNext.");
      onNext();
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-semibold'>
          {t("onboarding.currentInvestments")}
        </h2>
        <div className='flex flex-col sm:flex-row items-center gap-3'>
          <Button
            onClick={() => setIsAddInvestmentModalOpen(true)}
            className='flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark'>
            <Plus size={16} />
            {t("investments.addInvestment", "Add Investment")}
          </Button>

          {shouldShowEmergencyFundOption && (
            <Button
              onClick={() => setShowEmergencyFundDialog(true)}
              variant='outline'
              className='flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white'>
              <Shield size={16} />
              {t("investments.addEmergencyFund", "Add Emergency Fund")}
            </Button>
          )}
        </div>
      </div>

      <p className='text-gray-600 mb-6'>
        {t("onboarding.listExistingInvestments")}
      </p>

      <AddInvestmentDialog
        isOpen={isAddInvestmentModalOpen}
        onOpenChange={setIsAddInvestmentModalOpen}
        onSubmit={handleAddInvestment}
      />

      <Separator className='my-6' />

      {profile.investments && profile.investments.length > 0 ? (
        <div className='space-y-4'>
          <h3 className='font-medium'>{t("onboarding.yourInvestments")}</h3>
          {profile.investments.map((investment) => (
            <div
              key={investment.id}
              className='flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-all duration-300'>
              <div className='flex items-center space-x-3'>
                <LineChart className='h-5 w-5 text-finance-green' />
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='font-medium'>{investment.name}</p>
                    {investment.isEmergencyFund && (
                      <Badge
                        variant='secondary'
                        className='bg-green-100 text-green-800 border-green-200 text-xs'>
                        <Shield className='h-3 w-3 mr-1' />
                        {t("investments.emergencyFund", "Emergency Fund")}
                      </Badge>
                    )}
                  </div>
                  <p className='text-sm text-gray-500'>
                    {investment.type.charAt(0).toUpperCase() +
                      investment.type.slice(1)}{" "}
                    | ${investment.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => removeInvestment(investment.id)}
                className='text-gray-500 hover:text-red-500 transition-colors'>
                {t("onboarding.remove")}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-10 text-gray-500'>
          {t("onboarding.noInvestmentsAdded")}
        </div>
      )}

      {/* Emergency Fund Investment Dialog */}
      <EmergencyFundInvestmentDialog
        isOpen={showEmergencyFundDialog}
        onClose={() => setShowEmergencyFundDialog(false)}
        emergencyFundAmount={emergencyFundAmount}
        onOpenInvestmentDialog={handleAddEmergencyFundToInvestments}
      />
    </div>
  );
};

export default InvestmentsStep;
