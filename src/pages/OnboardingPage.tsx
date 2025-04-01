
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import UserOnboarding from '@/components/UserOnboarding';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';

interface OnboardingPageProps {
  onProfileComplete: (profile: UserProfile) => void;
  userProfile?: UserProfile;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onProfileComplete, userProfile }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isEditMode = Boolean(userProfile);
  
  // Check if we're editing an existing profile or creating a new one
  const handleProfileComplete = (profile: UserProfile) => {
    // Use a default placeholder for the required email field since we're no longer collecting it
    // In a real app, this would come from authentication
    const profileWithId = {
      ...profile,
      // Preserve existing id and email if in edit mode, otherwise use placeholders
      email: isEditMode ? userProfile.email : 'user@example.com',
      name: isEditMode ? (profile.name || userProfile.name) : 'User',
      id: isEditMode ? userProfile.id : 'user@example.com'
    };
    
    // Save the profile
    onProfileComplete(profileWithId);
    
    // Show success message
    toast({
      title: isEditMode ? "Profile updated!" : "Profile completed!",
      description: isEditMode 
        ? "Your financial profile has been updated successfully."
        : "Your financial profile has been set up successfully.",
      duration: 3000,
    });
    
    // Navigate to the appropriate page
    navigate(isEditMode ? '/profile' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={isEditMode} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isEditMode ? "Update Your Financial Profile" : "Complete Your Financial Profile"}
            </h1>
            <p className="text-gray-600">
              {isEditMode 
                ? "Make changes to your financial information and preferences" 
                : "Let's collect some information to personalize your financial recommendations"}
            </p>
          </div>
          
          <UserOnboarding 
            onComplete={handleProfileComplete} 
            existingProfile={userProfile} 
            isEditMode={isEditMode}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
