
import React from 'react';
import { DollarSign, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useOnboarding } from '@/context/OnboardingContext';

const InvestmentsStep: React.FC = () => {
  const { 
    profile, 
    currentInvestment, 
    updateCurrentInvestment, 
    addInvestment, 
    removeInvestment 
  } = useOnboarding();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Current Investments</h2>
      <p className="text-gray-600 mb-6">List your existing investments</p>
      
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="investmentType">Investment Type</Label>
          <select
            id="investmentType"
            value={currentInvestment.type}
            onChange={(e) => updateCurrentInvestment({
              type: e.target.value as any
            })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            value={currentInvestment.name} 
            onChange={(e) => updateCurrentInvestment({ name: e.target.value })}
            placeholder="S&P 500 ETF, Bitcoin, etc."
            className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="investmentValue">Current Value ($)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="investmentValue" 
              type="number" 
              value={currentInvestment.value || ''} 
              onChange={(e) => updateCurrentInvestment({ value: parseInt(e.target.value) || 0 })}
              placeholder="10000"
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
            />
          </div>
        </div>
        
        <Button 
          onClick={addInvestment}
          disabled={!currentInvestment.name || currentInvestment.value <= 0}
          className="w-full bg-finance-blue hover:bg-finance-blue-dark transition-all duration-300"
        >
          Add Investment
        </Button>
      </div>
      
      <Separator className="my-6" />
      
      {profile.investments && profile.investments.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium">Your Investments</h3>
          {profile.investments.map((investment) => (
            <div key={investment.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <LineChart className="h-5 w-5 text-finance-green" />
                <div>
                  <p className="font-medium">{investment.name}</p>
                  <p className="text-sm text-gray-500">
                    {investment.type.charAt(0).toUpperCase() + investment.type.slice(1)} | ${investment.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeInvestment(investment.id)}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          No investments added yet
        </div>
      )}
    </div>
  );
};

export default InvestmentsStep;
