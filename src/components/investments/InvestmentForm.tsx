import React, { useState, useEffect } from "react";
import { DollarSign, LineChart, Percent, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Alert, AlertDescription } from "../ui/alert";
import { useTranslation } from "react-i18next";
import { Investment } from "../../types/finance";
import { Currency, useCurrency } from "../../context/CurrencyContext";
import { CurrencyInput } from "../ui/currency-input";
import { PercentageInput } from "../ui/percentage-input";

interface InvestmentFormProps {
  initialInvestment?: Investment;
  onSubmit: (
    investment: Omit<Investment, "id"> | Investment
  ) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
  userPreferredCurrency?: Currency;
  isMobile?: boolean;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  initialInvestment,
  onSubmit,
  onCancel,
  isSubmitting = false,
  userPreferredCurrency,
}) => {
  const { t } = useTranslation();
  const { formatCurrency, currencyConfig } = useCurrency();
  const isEditMode = Boolean(initialInvestment);

  // Initialize state with emergency fund detection
  const [investmentData, setInvestmentData] = useState<
    Omit<Investment, "id"> | Investment
  >(() => {
    const defaultData = {
      type: "stocks" as const,
      name: "",
      value: 0,
      annualReturn: undefined,
      isEmergencyFund: false,
      purchaseDate: new Date().toISOString().split("T")[0],
    };

    if (initialInvestment) {
      // Check if this is an emergency fund investment
      const isEmergencyFund =
        initialInvestment.isEmergencyFund ||
        initialInvestment.name.toLowerCase().includes("emergency") ||
        initialInvestment.name.toLowerCase().includes("emergência") ||
        initialInvestment.name.toLowerCase().includes("fundo de emergência");

      return {
        ...defaultData,
        ...initialInvestment,
        isEmergencyFund,
      };
    }

    return defaultData;
  });

  // Define safe investment types for emergency fund
  const safeInvestmentTypes = ["bonds", "fixedIncome", "cash", "other"];
  const allInvestmentTypes = [
    "stocks",
    "bonds",
    "fixedIncome",
    "realEstate",
    "cash",
    "crypto",
    "other",
  ];

  // Get available investment types based on emergency fund toggle
  const availableInvestmentTypes = investmentData.isEmergencyFund
    ? safeInvestmentTypes
    : allInvestmentTypes;

  const handleChange = (field: keyof typeof investmentData, value: any) => {
    setInvestmentData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // If toggling emergency fund and current type is not safe, reset to safe type
      if (
        field === "isEmergencyFund" &&
        value === true &&
        !safeInvestmentTypes.includes(prev.type)
      ) {
        updated.type = "cash";
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(investmentData);
  };

  const isFormValid =
    investmentData.name.trim() !== "" && investmentData.value > 0;

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Remove duplicate heading since DialogTitle already exists */}

      {/* Emergency Fund Toggle */}
      <div className='space-y-4 p-4 bg-green-50 rounded-lg border border-green-200'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <div className='flex items-center space-x-2 flex-1'>
            <Shield className='h-4 w-4 text-green-600 flex-shrink-0' />
            <Label
              htmlFor='emergencyFund'
              className='font-medium text-sm sm:text-base'>
              {t("investments.emergencyFundLabel", "Emergency Fund Investment")}
            </Label>
          </div>
          <Switch
            id='emergencyFund'
            checked={investmentData.isEmergencyFund || false}
            onCheckedChange={(checked) =>
              handleChange("isEmergencyFund", checked)
            }
            disabled={isSubmitting}
            className='self-start sm:self-center'
          />
        </div>

        <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>
          {t(
            "investments.emergencyFundDescription",
            "Mark this investment as part of your emergency fund. Only safe, liquid investments are recommended."
          )}
        </p>

        {investmentData.isEmergencyFund && (
          <Alert className='border-amber-200 bg-amber-50'>
            <Shield className='h-4 w-4 text-amber-600' />
            <AlertDescription className='text-xs sm:text-sm text-amber-800'>
              {t(
                "investments.emergencyFundWarning",
                "Emergency fund investments should be safe and easily accessible. Only bonds, cash equivalents, and other secure instruments are recommended."
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Form Fields Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='investmentType' className='text-sm font-medium'>
            {t("investments.investmentType", "Investment Type")}
          </Label>
          <select
            id='investmentType'
            value={investmentData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className='w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200'
            disabled={isSubmitting}>
            {availableInvestmentTypes.map((type) => (
              <option key={type} value={type}>
                {t(
                  `investments.types.${type}`,
                  type.charAt(0).toUpperCase() + type.slice(1)
                )}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='investmentName' className='text-sm font-medium'>
            {t("investments.investmentName", "Investment Name")}
          </Label>
          <Input
            id='investmentName'
            value={investmentData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={t(
              "investments.investmentNamePlaceholder",
              "S&P 500 ETF, Bitcoin, etc."
            )}
            className='transition-all duration-200 focus:ring-2 focus:ring-blue-500 h-10'
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='investmentValue' className='text-sm font-medium'>
            {t("investments.currentValue", "Current Value")}
          </Label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400'>
              {currencyConfig.symbol}
            </span>
            <CurrencyInput
              id='investmentValue'
              value={investmentData.value || ""}
              onChange={(value) => handleChange("value", value)}
              placeholder='10.000,00'
              className='pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 h-10'
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='annualReturn' className='text-sm font-medium'>
            {t("investments.annualReturn", "Annual Return (%) - Optional")}
          </Label>
          <div className='relative'>
            <Percent className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <PercentageInput
              id='annualReturn'
              value={investmentData.annualReturn || ""}
              onChange={(value) =>
                handleChange("annualReturn", value || undefined)
              }
              placeholder='7,5'
              className='pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 h-10'
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isSubmitting}
          className='w-full sm:w-auto min-w-[100px]'>
          {t("common.cancel", "Cancel")}
        </Button>
        <Button
          type='submit'
          disabled={!isFormValid || isSubmitting}
          className='w-full sm:w-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
          {isSubmitting
            ? t("common.saving", "Saving...")
            : isEditMode
            ? t("investments.updateInvestment", "Update Investment")
            : t("investments.addInvestment", "Add Investment")}
        </Button>
      </div>
    </form>
  );
};

export default InvestmentForm;
