import React, { useState, useEffect } from "react";
import { MonthlyAmount } from "../../types/finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Save, X, Calculator, Info, TrendingUp } from "lucide-react";
import { useTranslatedMonths } from "../../constants/months";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useCurrency } from "../../context/CurrencyContext";

interface DetailedSavingsListProps {
  monthData: MonthlyAmount;
  onUpdateMonthData: (updatedData: MonthlyAmount) => void;
  onSaveAmount: (month: number, amount: number) => void;
  monthlyIncome?: number;
  monthlyExpenses?: MonthlyAmount[];
  isMobile?: boolean;
}

const DetailedSavingsList: React.FC<DetailedSavingsListProps> = ({
  monthData,
  onUpdateMonthData,
  onSaveAmount,
  monthlyIncome,
  monthlyExpenses,
  isMobile = false,
}) => {
  const { t } = useTranslation();
  const { currencyConfig } = useCurrency();
  const { getTranslatedMonths } = useTranslatedMonths();
  const [value, setValue] = useState(monthData.amount);
  const [error, setError] = useState("");
  const [isAutoCalculated, setIsAutoCalculated] = useState(false);
  const [autoCalculationEnabled, setAutoCalculationEnabled] = useState(true);

  const translatedMonths = getTranslatedMonths();
  const monthName = translatedMonths[monthData.month - 1];

  // Calculate automatic savings for the specific month
  const calculateAutomaticSavings = () => {
    if (!monthlyIncome || monthlyIncome <= 0) {
      setError(
        t(
          "savings.noIncomeDataError",
          "No monthly income data available for automatic calculation"
        )
      );
      return 0;
    }

    // Find expenses for the specific month
    const monthExpenses = monthlyExpenses?.find(
      (expense) => expense.month === monthData.month
    );
    const monthExpenseAmount = monthExpenses?.amount || 0;

    // Calculate savings: income - expenses
    const calculatedSavings = monthlyIncome - monthExpenseAmount;

    // Ensure savings are not negative
    return Math.max(0, calculatedSavings);
  };

  const handleAutoCalculate = () => {
    const automaticSavings = calculateAutomaticSavings();
    if (automaticSavings >= 0 && !error) {
      setValue(automaticSavings);
      setIsAutoCalculated(true);
      setError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setIsAutoCalculated(false); // Mark as manually edited
    setAutoCalculationEnabled(false); // Disable auto calculation when manually editing

    if (inputValue === "") {
      setValue(0);
      setError("");
      return;
    }

    const numValue = parseFloat(inputValue);

    if (isNaN(numValue)) {
      setError(t("common.enterValidNumber", "Please enter a valid number"));
    } else if (numValue < 0) {
      setError(t("common.amountNotNegative", "Amount cannot be negative"));
    } else {
      setValue(numValue);
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!error) {
      onSaveAmount(monthData.month, value);
      // Update the month data
      onUpdateMonthData({ ...monthData, amount: value });
    }
  };

  // Calculate monthly expense for display
  const monthExpenses = monthlyExpenses?.find(
    (expense) => expense.month === monthData.month
  );
  const monthExpenseAmount = monthExpenses?.amount || 0;
  const canAutoCalculate = monthlyIncome && monthlyIncome > 0;
  const suggestedSavings = calculateAutomaticSavings();

  // Apply automatic calculation when switch is enabled
  useEffect(() => {
    if (autoCalculationEnabled && canAutoCalculate) {
      const automaticSavings = calculateAutomaticSavings();
      if (automaticSavings >= 0) {
        setValue(automaticSavings);
        setIsAutoCalculated(true);
        setError("");
      }
    }
  }, [
    autoCalculationEnabled,
    canAutoCalculate,
    monthlyIncome,
    monthExpenseAmount,
  ]);

  return (
    <Card
      className={cn(
        "w-full",
        isMobile && "border-0 shadow-none bg-transparent"
      )}>
      <CardHeader className={cn(isMobile && "px-0 pt-4")}>
        <CardTitle
          className={cn(
            "flex justify-between items-center",
            isMobile ? "flex-col space-y-3 items-stretch" : "flex-row"
          )}>
          <span className={cn(isMobile ? "text-xl text-center" : "text-2xl")}>
            <TrendingUp
              className={cn("inline mr-2", isMobile ? "h-5 w-5" : "h-6 w-6")}
            />
            {t("savings.editSavingsFor", "Edit Savings for")} {monthName}
          </span>
        </CardTitle>
        <CardDescription className={cn(isMobile && "px-0")}>
          {t(
            "savings.adjustSavingsDescription",
            "Adjust your savings amount for this month based on your income and expenses"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className={cn(isMobile && "px-0 space-y-6")}>
        {/* Auto-calculation info */}
        {canAutoCalculate && (
          <Alert className='mb-4'>
            <Info className='h-4 w-4' />
            <AlertDescription>
              <div className='space-y-1'>
                <div>
                  {t("savings.monthlyIncome", "Monthly Income")}:{" "}
                  {currencyConfig.symbol}
                  {monthlyIncome.toLocaleString()}
                </div>
                <div>
                  {t("savings.monthlyExpenses", "Monthly Expenses")} (
                  {monthName}): {currencyConfig.symbol}
                  {monthExpenseAmount.toLocaleString()}
                </div>
                <div className='font-medium'>
                  {t("savings.suggestedSavings", "Suggested Savings")}:{" "}
                  {currencyConfig.symbol}
                  {suggestedSavings.toLocaleString()}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='amount' className='text-base font-medium'>
                {t("savings.savingsAmount", "Savings Amount")} (
                {currencyConfig.symbol})
              </Label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10'>
                  {currencyConfig.symbol}
                </span>
                <Input
                  id='amount'
                  type='number'
                  value={value}
                  onChange={handleChange}
                  disabled={autoCalculationEnabled}
                  className={cn(
                    "pl-7",
                    isMobile && "h-12 text-base",
                    autoCalculationEnabled && "bg-muted cursor-not-allowed"
                  )}
                  placeholder='0.00'
                  min='0'
                  step='0.01'
                  autoFocus={!autoCalculationEnabled}
                />
              </div>

              {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}

              {isAutoCalculated && autoCalculationEnabled && (
                <p className='text-green-600 text-sm mt-1'>
                  {t(
                    "savings.autoCalculatedValue",
                    "Value calculated automatically based on income and expenses"
                  )}
                </p>
              )}

              {autoCalculationEnabled && (
                <p className='text-muted-foreground text-xs'>
                  {t(
                    "savings.disableAutoToEdit",
                    "Disable automatic calculation to edit manually"
                  )}
                </p>
              )}
            </div>

            {/* Auto-calculate switch */}
            {canAutoCalculate && (
              <div className='flex items-center space-x-3 p-4 bg-gray-50 rounded-lg'>
                <Calculator className='h-5 w-5 text-muted-foreground' />
                <div className='flex-1'>
                  <Label
                    htmlFor='auto-calculate'
                    className='text-sm font-medium'>
                    {t(
                      "savings.autoCalculate",
                      "Auto-calculate (Income - Expenses)"
                    )}
                  </Label>
                  <p className='text-xs text-muted-foreground'>
                    {t(
                      "savings.autoCalculateDescription",
                      "Automatically update savings amount based on income and expenses"
                    )}
                  </p>
                </div>
                <Switch
                  id='auto-calculate'
                  checked={autoCalculationEnabled}
                  onCheckedChange={setAutoCalculationEnabled}
                />
              </div>
            )}
          </div>

          <div
            className={cn(
              "flex gap-3 pt-4 border-t",
              isMobile ? "flex-col" : "justify-end"
            )}>
            <Button
              type='submit'
              className={cn(
                "flex items-center gap-2",
                isMobile && "h-12 text-base order-1"
              )}
              disabled={!!error}>
              <Save size={isMobile ? 20 : 16} />
              {t("common.save")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DetailedSavingsList;
