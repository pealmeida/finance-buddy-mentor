
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { UserProfile } from '@/types/finance';

interface SaveButtonProps {
  onSave: () => void;
  profile: UserProfile;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, profile }) => {
  // Determine if there's any data to save
  const hasProfileData = profile && (
    profile.name || 
    profile.email || 
    profile.age || 
    profile.monthlyIncome || 
    profile.riskProfile || 
    profile.hasEmergencyFund !== undefined || 
    profile.hasDebts !== undefined
  );

  return (
    <div className="flex justify-end mt-8">
      <Button 
        onClick={onSave}
        disabled={!hasProfileData}
        className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2"
      >
        <Save className="h-4 w-4" /> 
        Save Changes
      </Button>
    </div>
  );
};

export default SaveButton;
