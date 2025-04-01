
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import UserOnboarding from '@/components/UserOnboarding';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';

interface OnboardingPageProps {
  onProfileComplete: (profile: UserProfile) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onProfileComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleProfileComplete = (profile: UserProfile) => {
    // Use email as the ID for the user profile
    const profileWithId = {
      ...profile,
      id: profile.email
    };
    
    // Save the profile
    onProfileComplete(profileWithId);
    
    // Show success message
    toast({
      title: "Profile completed!",
      description: "Your financial profile has been set up successfully.",
      duration: 3000,
    });
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={false} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">
              Let us know more about you to personalize your financial journey
            </p>
          </div>
          
          <UserOnboarding onComplete={handleProfileComplete} />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
