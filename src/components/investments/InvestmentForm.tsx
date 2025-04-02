
import React, { useState, useEffect } from 'react';
import { DollarSign, LineChart, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Investment } from '@/types/finance';

interface InvestmentFormProps {
  initialInvestment?: Investment;
  onSubmit: (investment: Omit<Investment, 'id'> | Investment) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  initialInvestment,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const isEditMode = Boolean(initialInvestment);
  
  const [investmentData, setInvestmentData] = useState<Omit<Investment, 'id'> | Investment>({
    type: 'stocks',
    name: '',
    value: 0,
    annualReturn: undefined,
    ...(initialInvestment || {})
  });

  const handleChange = (field: keyof typeof investmentData, value: any) => {
    setInvestmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(investmentData);
  };

  const isFormValid = investmentData.name.trim() !== '' && investmentData.value > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">
        {isEditMode ? 'Edit Investment' : 'Add New Investment'}
      </h2>
      
      <div className="space-y-2">
        <Label htmlFor="investmentType">Investment Type</Label>
        <select
          id="investmentType"
          value={investmentData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          disabled={isSubmitting}
        >
          <option value="stocks">Stocks</option>
          <option value="bonds">Bonds</option>
          <option value="realEstate">Real Estate</option>
          <option value="cash">Cash / Savings</option>
          <option value="crypto">Cryptocurrency</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="investmentName">Investment Name</Label>
        <Input 
          id="investmentName" 
          value={investmentData.name} 
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="S&P 500 ETF, Bitcoin, etc."
          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="investmentValue">Current Value ($)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="investmentValue" 
            type="number" 
            value={investmentData.value || ''} 
            onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
            placeholder="10000"
            className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="annualReturn">Annual Return (%) - Optional</Label>
        <div className="relative">
          <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="annualReturn" 
            type="number" 
            value={investmentData.annualReturn || ''} 
            onChange={(e) => handleChange('annualReturn', parseFloat(e.target.value) || undefined)}
            placeholder="7.5"
            className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Investment' : 'Add Investment'}
        </Button>
      </div>
    </form>
  );
};

export default InvestmentForm;
