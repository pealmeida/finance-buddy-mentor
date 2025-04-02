
import React from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import MonthlySavings from '@/components/savings/MonthlySavings';

interface MonthlySavingsPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const MonthlySavingsPage: React.FC<MonthlySavingsPageProps> = ({ 
  userProfile, 
  onProfileUpdate
}) => {
  const { handleProfileComplete, isSubmitting } = useProfileCompletion(onProfileUpdate);
  
  const handleSave = (updatedProfile: UserProfile) => {
    handleProfileComplete(updatedProfile, true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Monthly Savings</h1>
          
          <div className="glass-panel rounded-2xl p-8 mb-8">
            <MonthlySavings 
              profile={userProfile} 
              onSave={handleSave} 
              isSaving={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySavingsPage;
