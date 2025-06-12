import React from "react";
import { Shield } from "lucide-react";
import { Progress } from "../ui/progress";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";

interface EmergencyFundProps {
  currentEmergencyFund: number;
  emergencyFundTarget: number;
  emergencyFundPercentage: number;
  hasEmergencyFundData: boolean | undefined;
}

const EmergencyFund: React.FC<EmergencyFundProps> = ({
  currentEmergencyFund,
  emergencyFundTarget,
  emergencyFundPercentage,
  hasEmergencyFundData,
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();

  return (
    <div>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center space-x-2'>
          <Shield className='h-4 w-4 text-finance-blue' />
          <p className='font-medium'>
            {t("common.emergencyFund", "Emergency Fund")}
          </p>
        </div>
        {hasEmergencyFundData ? (
          <p className='text-sm text-gray-500'>
            {formatCurrency(currentEmergencyFund)} {t("common.of")}{" "}
            {formatCurrency(emergencyFundTarget)}
          </p>
        ) : (
          <p className='text-sm text-gray-500'>
            {t("common.noEmergencyFundData")}
          </p>
        )}
      </div>
      {hasEmergencyFundData ? (
        <Progress
          value={emergencyFundPercentage}
          className='h-2 progress-animation'
        />
      ) : (
        <div className='h-2 bg-gray-200 rounded-full'></div>
      )}
      <div className='mt-1 flex items-center justify-between'>
        {hasEmergencyFundData ? (
          <p className='text-xs text-gray-500'>
            {emergencyFundPercentage < 100
              ? `${Math.round(emergencyFundPercentage)}% ${t(
                  "common.emergencyFundProgress",
                  "of 6 months target"
                )}`
              : t("common.emergencyFundTarget", "Emergency fund complete!")}
          </p>
        ) : (
          <p className='text-xs text-gray-500'>
            {t("common.emergencyFundCallToAction")}
          </p>
        )}
        <p className='text-xs text-finance-blue'>
          {t(
            "common.emergencyFundRecommended",
            "Recommended: 6 months of expenses"
          )}
        </p>
      </div>
    </div>
  );
};

export default EmergencyFund;
