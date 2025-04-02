
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import { MONTHS } from '@/constants/months';

interface MonthlySavingsFormProps {
  month: number;
  initialAmount: number;
  onSave: (month: number, amount: number) => void;
  onCancel: () => void;
}

const MonthlySavingsForm: React.FC<MonthlySavingsFormProps> = ({
  month,
  initialAmount,
  onSave,
  onCancel
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [error, setError] = useState('');
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    if (e.target.value === '') {
      setAmount(0);
      setError('');
    } else if (isNaN(value)) {
      setError('Please enter a valid number');
    } else if (value < 0) {
      setError('Amount cannot be negative');
    } else {
      setAmount(value);
      setError('');
    }
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!error) {
      onSave(month, amount);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <h3 className="text-xl font-semibold mb-4">
        Edit Savings for {MONTHS[month - 1]}
      </h3>
      
      <form onSubmit={handleSave}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Savings Amount ($)</Label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
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
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark"
              disabled={!!error}
            >
              <Save size={16} />
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MonthlySavingsForm;
