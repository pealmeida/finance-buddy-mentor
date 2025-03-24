
import React from 'react';
import Header from '@/components/Header';
import UserOnboarding from '@/components/UserOnboarding';
import Dashboard from '@/components/Dashboard';
import { UserProfile } from '@/types/finance';

interface IndexProps {
  userProfile: UserProfile | null;
  onProfileComplete: (profile: UserProfile) => void;
}

const Index: React.FC<IndexProps> = ({ userProfile, onProfileComplete }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={!!userProfile} />
      
      {!userProfile ? (
        <UserOnboarding onComplete={onProfileComplete} />
      ) : (
        <Dashboard userProfile={userProfile} />
      )}
    </div>
  );
};

export default Index;
