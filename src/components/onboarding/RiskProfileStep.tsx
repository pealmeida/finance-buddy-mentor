import React from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { RiskProfile } from "../../types/finance";
import { useOnboarding } from "../../context/OnboardingContext";
import { useTranslation } from "react-i18next";

const RiskProfileStep: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();

  console.log("profile.riskProfile in RiskProfileStep:", profile.riskProfile);

  const handleEmergencyFundMonthsChange = (value: number[]) => {
    updateProfile({
      emergencyFundMonths: value[0],
    });
  };

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-6'>
        {t("onboarding.riskProfile")}
      </h2>
      <p className='text-gray-600 mb-6'>{t("onboarding.riskComfortLevel")}</p>

      <RadioGroup
        value={profile.riskProfile ?? ""}
        onValueChange={(value) =>
          updateProfile({ riskProfile: value as RiskProfile })
        }
        className='space-y-4'>
        <div className='flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-300'>
          <RadioGroupItem
            value='conservative'
            id='conservative'
            className='mt-1'
          />
          <div>
            <Label htmlFor='conservative' className='text-base font-medium'>
              {t("onboarding.conservative")}
            </Label>
            <p className='text-sm text-gray-500'>
              {t("onboarding.conservativeDesc")}
            </p>
          </div>
        </div>

        <div className='flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-300'>
          <RadioGroupItem value='moderate' id='moderate' className='mt-1' />
          <div>
            <Label htmlFor='moderate' className='text-base font-medium'>
              {t("onboarding.moderate")}
            </Label>
            <p className='text-sm text-gray-500'>
              {t("onboarding.moderateDesc")}
            </p>
          </div>
        </div>

        <div className='flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-300'>
          <RadioGroupItem value='aggressive' id='aggressive' className='mt-1' />
          <div>
            <Label htmlFor='aggressive' className='text-base font-medium'>
              {t("onboarding.aggressive")}
            </Label>
            <p className='text-sm text-gray-500'>
              {t("onboarding.aggressiveDesc")}
            </p>
          </div>
        </div>
      </RadioGroup>

      <div className='mt-6 space-y-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='emergency'
                checked={profile.hasEmergencyFund}
                onCheckedChange={(checked) => {
                  updateProfile({
                    hasEmergencyFund: !!checked,
                    emergencyFundMonths: !!checked
                      ? profile.emergencyFundMonths || 3
                      : 0,
                  });
                }}
              />
              <Label htmlFor='emergency' className='text-base'>
                {t("onboarding.emergencyFund")}
              </Label>
            </div>
            {profile.hasEmergencyFund && (
              <span className='font-medium text-sm text-gray-700'>
                {profile.emergencyFundMonths || 0}{" "}
                {profile.emergencyFundMonths === 1 ? "month" : "months"}
              </span>
            )}
          </div>

          {profile.hasEmergencyFund && (
            <div className='px-8 pt-2'>
              <Label className='mb-2 block text-sm text-gray-600'>
                {t("onboarding.emergencyFundMonths")}
              </Label>
              <Slider
                defaultValue={[profile.emergencyFundMonths || 3]}
                value={[profile.emergencyFundMonths || 3]}
                onValueChange={handleEmergencyFundMonthsChange}
                max={6}
                min={1}
                step={1}
                className='my-4'
              />
              <div className='flex justify-between text-xs text-gray-500'>
                <span>1 month</span>
                <span>6 months</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskProfileStep;
