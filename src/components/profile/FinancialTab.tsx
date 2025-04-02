
import React from 'react';
import { UserProfile } from '@/types/finance';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialTabProps {
  profile: UserProfile;
  onInputChange: (field: keyof UserProfile, value: any) => void;
  handleInputChange?: (field: keyof UserProfile, value: any) => void; // Add for backward compatibility
}

const FinancialTab: React.FC<FinancialTabProps> = ({ profile, onInputChange, handleInputChange }) => {
  // Use either onInputChange or handleInputChange (for backward compatibility)
  const handleChange = (field: keyof UserProfile, value: any) => {
    if (handleInputChange) {
      handleInputChange(field, value);
    } else {
      onInputChange(field, value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="income">Monthly Income ($)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="income" 
              type="number" 
              value={profile.monthlyIncome} 
              onChange={(e) => handleChange('monthlyIncome', parseInt(e.target.value) || 0)}
              placeholder="5000"
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
            />
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <Label>Risk Profile</Label>
          <RadioGroup 
            value={profile.riskProfile} 
            onValueChange={(value) => handleChange('riskProfile', value)}
            className="space-y-2"
          >
            <div className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-gray-50">
              <RadioGroupItem value="conservative" id="conservative" className="mt-1" />
              <div>
                <Label htmlFor="conservative" className="font-medium">Conservative</Label>
                <p className="text-xs text-gray-500">Prioritize preserving capital</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-gray-50">
              <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
              <div>
                <Label htmlFor="moderate" className="font-medium">Moderate</Label>
                <p className="text-xs text-gray-500">Balance growth and preservation</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-gray-50">
              <RadioGroupItem value="aggressive" id="aggressive" className="mt-1" />
              <div>
                <Label htmlFor="aggressive" className="font-medium">Aggressive</Label>
                <p className="text-xs text-gray-500">Maximize long-term growth</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="emergency" 
              checked={profile.hasEmergencyFund} 
              onCheckedChange={(checked) => handleChange('hasEmergencyFund', !!checked)}
            />
            <Label htmlFor="emergency">I have an emergency fund (3-6 months of expenses)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="debts" 
              checked={profile.hasDebts} 
              onCheckedChange={(checked) => handleChange('hasDebts', !!checked)}
            />
            <Label htmlFor="debts">I have high-interest debts (credit cards, personal loans)</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialTab;
