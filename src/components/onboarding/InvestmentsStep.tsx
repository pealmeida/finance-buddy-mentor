import React, { useState } from "react";
import { DollarSign, LineChart } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useOnboarding } from "../../context/OnboardingContext";
import { useTranslation } from "react-i18next";
import AddInvestmentDialog from "../investments/AddInvestmentDialog";
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
  const [isAddInvestmentModalOpen, setIsAddInvestmentModalOpen] =
    useState(false);

  const { profile, addInvestment, removeInvestment } = useOnboarding();

  const handleAddInvestment = async (investment: Omit<Investment, "id">) => {
    await addInvestment(investment);
    setIsAddInvestmentModalOpen(false);
    return true;
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
    <div>
      <h2 className='text-2xl font-semibold mb-6'>
        {t("onboarding.currentInvestments")}
      </h2>
      <p className='text-gray-600 mb-6'>
        {t("onboarding.listExistingInvestments")}
      </p>

      <div className='space-y-4 mb-6'>
        <Button
          onClick={() => setIsAddInvestmentModalOpen(true)}
          className='w-full bg-finance-blue hover:bg-finance-blue-dark transition-all duration-300'>
          {t("onboarding.addInvestmentButton")}
        </Button>
      </div>

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
                <div>
                  <p className='font-medium'>{investment.name}</p>
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
    </div>
  );
};

export default InvestmentsStep;
