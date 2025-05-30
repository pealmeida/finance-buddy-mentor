
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTranslation } from 'react-i18next';
import CurrencySelector from '@/components/CurrencySelector';

const PersonalInfoStep: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{t('onboarding.personalInfo')}</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="age">{t('onboarding.age')}</Label>
          <Input 
            id="age" 
            type="number" 
            value={profile.age || ''} 
            onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
            placeholder="30"
            className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="income">{t('onboarding.monthlyIncome')}</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="income" 
              type="number" 
              value={profile.monthlyIncome || ''} 
              onChange={(e) => updateProfile({ monthlyIncome: parseInt(e.target.value) || 0 })}
              placeholder="5000"
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{t('onboarding.preferredCurrency')}</Label>
          <div className="flex justify-start">
            <CurrencySelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
