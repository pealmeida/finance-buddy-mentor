
import React from 'react';
import { UserProfile } from '@/types/finance';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User } from 'lucide-react';
import CurrencySelector from '@/components/CurrencySelector';
import { useTranslation } from 'react-i18next';

interface PersonalInfoTabProps {
  profile: UserProfile;
  onInputChange: (field: keyof UserProfile, value: any) => void;
  handleInputChange?: (field: keyof UserProfile, value: any) => void; // Add for backward compatibility
  isSubmitting?: boolean; // Add isSubmitting property
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ profile, onInputChange, handleInputChange }) => {
  const { t } = useTranslation();
  
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
        <CardTitle>{t('profile.personalInfo', 'Personal Information')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('profile.emailAddress', 'Email Address')}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="email" 
              type="email"
              value={profile.email || ''} 
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="johndoe@example.com"
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
              readOnly
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">{t('profile.fullName', 'Full Name')}</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="name" 
              value={profile.name || ''} 
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">{t('profile.age', 'Age')}</Label>
          <Input 
            id="age" 
            type="number" 
            value={profile.age || ''} 
            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            placeholder="30"
            className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{t('profile.preferredCurrency', 'Preferred Currency')}</Label>
          <div className="flex justify-start">
            <CurrencySelector />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoTab;
