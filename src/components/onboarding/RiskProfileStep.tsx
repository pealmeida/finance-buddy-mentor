
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { RiskProfile } from '@/types/finance';
import { useOnboarding } from '@/context/OnboardingContext';

const RiskProfileStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();

  const handleEmergencyFundMonthsChange = (value: number[]) => {
    updateProfile({ 
      emergencyFundMonths: value[0]
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Risk Profile</h2>
      <p className="text-gray-600 mb-6">How comfortable are you with investment risk?</p>
      
      <RadioGroup 
        value={profile.riskProfile} 
        onValueChange={(value) => updateProfile({ riskProfile: value as RiskProfile })}
        className="space-y-4"
      >
        <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-300">
          <RadioGroupItem value="conservative" id="conservative" className="mt-1" />
          <div>
            <Label htmlFor="conservative" className="text-base font-medium">Conservative</Label>
            <p className="text-sm text-gray-500">Prioritize preserving capital with lower returns and minimal risk</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-300">
          <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
          <div>
            <Label htmlFor="moderate" className="text-base font-medium">Moderate</Label>
            <p className="text-sm text-gray-500">Balance between growth and capital preservation with medium risk</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-300">
          <RadioGroupItem value="aggressive" id="aggressive" className="mt-1" />
          <div>
            <Label htmlFor="aggressive" className="text-base font-medium">Aggressive</Label>
            <p className="text-sm text-gray-500">Maximize long-term growth with higher risk tolerance</p>
          </div>
        </div>
      </RadioGroup>
      
      <div className="mt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emergency" 
                checked={profile.hasEmergencyFund} 
                onCheckedChange={(checked) => {
                  updateProfile({ 
                    hasEmergencyFund: !!checked,
                    emergencyFundMonths: !!checked ? (profile.emergencyFundMonths || 3) : 0
                  });
                }}
              />
              <Label htmlFor="emergency" className="text-base">I have an emergency fund (3-6 months of expenses)</Label>
            </div>
            {profile.hasEmergencyFund && (
              <span className="font-medium text-sm text-gray-700">
                {profile.emergencyFundMonths || 0} {profile.emergencyFundMonths === 1 ? 'month' : 'months'}
              </span>
            )}
          </div>
          
          {profile.hasEmergencyFund && (
            <div className="px-8 pt-2">
              <Label className="mb-2 block text-sm text-gray-600">How many months of expenses do you have saved?</Label>
              <Slider
                defaultValue={[profile.emergencyFundMonths || 3]}
                value={[profile.emergencyFundMonths || 3]}
                onValueChange={handleEmergencyFundMonthsChange}
                max={6}
                min={1}
                step={1}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 month</span>
                <span>6 months</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="debts" 
            checked={profile.hasDebts} 
            onCheckedChange={(checked) => updateProfile({ hasDebts: !!checked })}
          />
          <Label htmlFor="debts" className="text-base">I have high-interest debts (credit cards, personal loans)</Label>
        </div>
      </div>
    </div>
  );
};

export default RiskProfileStep;
