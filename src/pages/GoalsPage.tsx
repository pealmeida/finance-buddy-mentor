
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { UserProfile, FinancialGoal } from '@/types/finance';
import { useProfileData } from '@/hooks/useProfileData';
import GoalsManagement from '@/components/goals/GoalsManagement';
import { useToast } from '@/components/ui/use-toast';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/ProfileErrorState';

interface GoalsPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ userProfile, onProfileUpdate }) => {
  const {
    profile,
    loading,
    error,
    handleInputChange
  } = useProfileData(userProfile);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Update the parent app state when profile changes
    if (profile && !loading) {
      onProfileUpdate(profile);
    }
  }, [profile, loading, onProfileUpdate]);

  if (loading) {
    return (
      <>
        <Header onboardingComplete={true} />
        <ProfileLoadingState />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header onboardingComplete={true} />
        <ProfileErrorState error={error} />
      </>
    );
  }

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={true} />
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-8 flex items-center">
          <button 
            className="mr-4 text-gray-500 hover:text-gray-700"
            onClick={handleGoBack}
          >
            &larr; Back to Dashboard
          </button>
          <h1 className="text-3xl font-semibold text-gray-800">Financial Goals</h1>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <GoalsManagement 
            goals={profile.financialGoals} 
            onGoalsChange={(updatedGoals) => handleInputChange('financialGoals', updatedGoals)} 
          />
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
