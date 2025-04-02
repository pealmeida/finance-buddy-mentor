
import React from 'react';
import { UserProfile } from '@/types/finance';
import MonthlySavings from '@/components/savings/MonthlySavings';

interface MonthlySavingsContentProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
  isSubmitting: boolean;
}

const MonthlySavingsContent: React.FC<MonthlySavingsContentProps> = ({ 
  userProfile, 
  onProfileUpdate, 
  isSubmitting 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Monthly Savings</h1>
          
          <div className="glass-panel rounded-2xl p-8 mb-8">
            <MonthlySavings 
              profile={userProfile} 
              onSave={onProfileUpdate} 
              isSaving={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySavingsContent;
