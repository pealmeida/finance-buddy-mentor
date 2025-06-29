import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";
import { MONTHS } from "@/constants/months";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { CurrencyInput } from "@/components/ui/currency-input";

interface MonthlyExpensesFormProps {
  month: number;
  amount: number;
  onSave: (month: number, amount: number) => void;
  onCancel: () => void;
}

const MonthlyExpensesForm: React.FC<MonthlyExpensesFormProps> = ({
  month,
  amount,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { currencyConfig } = useCurrency();
  const [value, setValue] = useState(amount);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

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

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border'>
      <h3 className='text-xl font-semibold mb-4'>
        {t("expenses.editExpensesFor", "Edit Expenses for")} {MONTHS[month - 1]}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='amount'>
              {t("expenses.expenseAmount", "Expense Amount")} (
              {currencyConfig.symbol})
            </Label>
            <div className='mt-1 relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2'>
                {currencyConfig.symbol}
              </span>
              <CurrencyInput
                id='amount'
                value={value}
                onChange={(newValue) => setValue(newValue)}
                className='pl-7'
                placeholder='0,00'
                autoFocus
              />
            </div>
            {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
          </div>

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
              className='flex items-center gap-2 bg-red-600 hover:bg-red-700'
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

export default MonthlyExpensesForm;
