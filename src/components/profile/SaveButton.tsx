
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { UserProfile } from '@/types/finance';

interface SaveButtonProps {
  onSave: () => void;
  profile: UserProfile;
  isSaving?: boolean;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  onSave, 
  profile, 
  isSaving = false,
  disabled = false
}) => {
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

  const buttonDisabled = disabled || !hasProfileData || isSaving;

  return (
    <div className="flex justify-end mt-8">
      <Button 
        onClick={onSave}
        disabled={buttonDisabled}
        className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> 
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" /> 
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
};

export default SaveButton;
