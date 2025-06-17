import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X, Calculator, Info } from "lucide-react";
import { MONTHS } from "@/constants/months";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { MonthlyAmount } from "@/types/finance";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MonthlySavingsFormProps {
  month: number;
  amount: number;
  onSave: (month: number, amount: number) => void;
  onCancel: () => void;
  monthlyIncome?: number;
  monthlyExpenses?: MonthlyAmount[];
}

const MonthlySavingsForm: React.FC<MonthlySavingsFormProps> = ({
  month,
  amount,
  onSave,
  onCancel,
  monthlyIncome = 0,
  monthlyExpenses = [],
}) => {
  const { t } = useTranslation();
  const { currencyConfig } = useCurrency();
  const [value, setValue] = useState(amount);
  const [error, setError] = useState("");
  const [isAutoCalculated, setIsAutoCalculated] = useState(false);

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
    const monthExpenses = monthlyExpenses.find(
      (expense) => expense.month === month
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
    if (!error) onSave(month, value);
  };

  // Calculate monthly expense for display
  const monthExpenses = monthlyExpenses.find(
    (expense) => expense.month === month
  );
  const monthExpenseAmount = monthExpenses?.amount || 0;
  const canAutoCalculate = monthlyIncome && monthlyIncome > 0;

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border'>
      <h3 className='text-xl font-semibold mb-4'>
        {t("savings.editSavingsFor", "Edit Savings for")} {MONTHS[month - 1]}
      </h3>

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
                {MONTHS[month - 1]}): {currencyConfig.symbol}
                {monthExpenseAmount.toLocaleString()}
              </div>
              <div className='font-medium'>
                {t("savings.suggestedSavings", "Suggested Savings")}:{" "}
                {currencyConfig.symbol}
                {calculateAutomaticSavings().toLocaleString()}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='amount'>
              {t("savings.savingsAmount", "Savings Amount")} (
              {currencyConfig.symbol})
            </Label>
            <div className='mt-1 relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2'>
                {currencyConfig.symbol}
              </span>
              <Input
                id='amount'
                type='number'
                value={value}
                onChange={handleChange}
                className='pl-7'
                placeholder='0.00'
                min='0'
                step='0.01'
                autoFocus
              />
            </div>
            {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
            {isAutoCalculated && (
              <p className='text-green-600 text-sm mt-1'>
                {t(
                  "savings.autoCalculatedValue",
                  "Value calculated automatically based on income and expenses"
                )}
              </p>
            )}
          </div>

          {/* Auto-calculate button */}
          {canAutoCalculate && (
            <Button
              type='button'
              variant='outline'
              onClick={handleAutoCalculate}
              className='w-full flex items-center gap-2'>
              <Calculator size={16} />
              {t("savings.autoCalculate", "Auto-calculate (Income - Expenses)")}
            </Button>
          )}

          <div className='flex justify-end gap-3 mt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              className='flex items-center gap-2'>
              <X size={16} />
              {t("common.cancel")}
            </Button>
            <Button
              type='submit'
              className='flex items-center gap-2'
              disabled={!!error}>
              <Save size={16} />
              {t("common.save")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MonthlySavingsForm;
