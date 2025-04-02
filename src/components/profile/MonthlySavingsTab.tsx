
import React from 'react';
import { UserProfile } from '@/types/finance';
import MonthlySavings from '@/components/savings/MonthlySavings';

interface MonthlySavingsTabProps {
  profile: UserProfile;
  isSubmitting: boolean;
  onSave: (updatedProfile: UserProfile) => void;
}

const MonthlySavingsTab: React.FC<MonthlySavingsTabProps> = ({ 
  profile, 
  isSubmitting, 
  onSave 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <MonthlySavings
          profile={profile}
          onSave={onSave}
          isSaving={isSubmitting}
        />
      </div>
    </div>
  );
};

export default MonthlySavingsTab;
