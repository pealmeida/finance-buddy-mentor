
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import { MONTHS } from '@/constants/months';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/context/CurrencyContext';

interface MonthlySavingsFormProps {
  month: number;
  amount: number;
  onSave: (month: number, amount: number) => void;
  onCancel: () => void;
}

const MonthlySavingsForm: React.FC<MonthlySavingsFormProps> = ({
  month,
  amount,
  onSave,
  onCancel
}) => {
  const { t } = useTranslation();
  const { currencyConfig } = useCurrency();
  const [value, setValue] = useState(amount);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      setValue(0);
      setError('');
      return;
    }
    
    const numValue = parseFloat(inputValue);
    
    if (isNaN(numValue)) {
      setError(t('common.enterValidNumber', 'Please enter a valid number'));
    } else if (numValue < 0) {
      setError(t('common.amountNotNegative', 'Amount cannot be negative'));
    } else {
      setValue(numValue);
      setError('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!error) onSave(month, value);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <h3 className="text-xl font-semibold mb-4">
        {t('savings.editSavingsFor', 'Edit Savings for')} {MONTHS[month - 1]}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">{t('savings.savingsAmount', 'Savings Amount')} ({currencyConfig.symbol})</Label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">{currencyConfig.symbol}</span>
              <Input
                id="amount"
                type="number"
                value={value}
                onChange={handleChange}
                className="pl-7"
                placeholder="0.00"
                min="0"
                step="0.01"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X size={16} />
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={!!error}
            >
              <Save size={16} />
              {t('common.save')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MonthlySavingsForm;
