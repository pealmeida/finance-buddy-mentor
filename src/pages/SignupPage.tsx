
import React from 'react';
import Header from '@/components/Header';
import UserOnboarding from '@/components/UserOnboarding';
import { UserProfile } from '@/types/finance';

interface SignupPageProps {
  onProfileComplete: (profile: UserProfile) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onProfileComplete }) => {
  const handleProfileComplete = (profile: UserProfile) => {
    // Use email as the ID for the user profile
    const profileWithId = {
      ...profile,
      id: profile.email
    };
    onProfileComplete(profileWithId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={false} />
      <div className="container mx-auto px-4 py-8">
        <UserOnboarding onComplete={handleProfileComplete} />
      </div>
    </div>
  );
};

export default SignupPage;
