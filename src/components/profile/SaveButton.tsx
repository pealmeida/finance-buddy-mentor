
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { UserProfile } from '@/types/finance';
import { Loader2 } from 'lucide-react';

interface SaveButtonProps {
  onSave: () => void;
  profile: UserProfile;
  isSaving?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, profile, isSaving = false }) => {
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
        disabled={!hasProfileData || isSaving}
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
