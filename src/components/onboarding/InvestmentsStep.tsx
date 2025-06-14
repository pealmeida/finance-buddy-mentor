import React from "react";
import { DollarSign, LineChart } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useOnboarding } from "../../context/OnboardingContext";
import { useTranslation } from "react-i18next";

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
  const {
    profile,
    currentInvestment,
    updateCurrentInvestment,
    addInvestment,
    removeInvestment,
  } = useOnboarding();

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
        <div className='space-y-2'>
          <Label htmlFor='investmentType'>
            {t("onboarding.investmentType")}
          </Label>
          <select
            id='investmentType'
            value={currentInvestment.type}
            onChange={(e) =>
              updateCurrentInvestment({
                type: e.target.value as any,
              })
            }
            className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
            <option value='stocks'>{t("onboarding.stocks")}</option>
            <option value='bonds'>{t("onboarding.bonds")}</option>
            <option value='realEstate'>{t("onboarding.realEstate")}</option>
            <option value='cash'>{t("onboarding.cash")}</option>
            <option value='crypto'>{t("onboarding.crypto")}</option>
            <option value='other'>{t("onboarding.other")}</option>
          </select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='investmentName'>
            {t("onboarding.investmentName")}
          </Label>
          <Input
            id='investmentName'
            value={currentInvestment.name}
            onChange={(e) => updateCurrentInvestment({ name: e.target.value })}
            placeholder={t("onboarding.investmentNamePlaceholder")}
            className='transition-all duration-300 focus:ring-2 focus:ring-finance-blue'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='investmentValue'>
            {t("onboarding.currentValue")}
          </Label>
          <div className='relative'>
            <DollarSign className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
            <Input
              id='investmentValue'
              type='number'
              value={currentInvestment.value || ""}
              onChange={(e) =>
                updateCurrentInvestment({
                  value: parseInt(e.target.value) || 0,
                })
              }
              placeholder='10000'
              className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue'
            />
          </div>
        </div>

        <div className='flex gap-4 justify-end mt-6'>
          <Button variant='outline' onClick={onPrevious}>
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!currentInvestment.name || currentInvestment.value <= 0}
            className='w-full bg-finance-blue hover:bg-finance-blue-dark transition-all duration-300'>
            {isLastStep ? "Review" : "Next"}
          </Button>
        </div>
      </div>

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
