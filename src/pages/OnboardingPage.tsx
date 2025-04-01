
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import UserOnboarding from '@/components/UserOnboarding';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface OnboardingPageProps {
  onProfileComplete: (profile: UserProfile) => void;
  userProfile?: UserProfile;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onProfileComplete, userProfile }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const { saveUserProfile, loading: savingProfile } = useSupabaseData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(userProfile);
  
  // Check if we're editing an existing profile or creating a new one
  const handleProfileComplete = async (profile: UserProfile) => {
    try {
      if (isSubmitting) return; // Prevent duplicate submissions
      
      setIsSubmitting(true);
      
      // Check for authenticated user first
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Create updated profile with auth user info if available
      let profileWithId: UserProfile = { ...profile };
      
      if (session?.user) {
        console.log('Session user found, using their ID for the profile:', session.user.id);
        profileWithId = {
          ...profile,
          id: session.user.id,
          email: session.user.email || profile.email || 'user@example.com',
          name: profile.name || (session.user.user_metadata?.name as string) || 'User',
        };
        
        // Validate profile before saving
        if (!profileWithId.id) {
          throw new Error("Profile must have a valid ID");
        }
        
        // Save profile to Supabase
        console.log('About to save profile to Supabase:', profileWithId);
        const success = await saveUserProfile(profileWithId);
        
        if (!success) {
          throw new Error("Failed to save profile to database");
        }
        console.log('Profile saved to Supabase successfully');
      } else {
        // No auth session, use existing ID if available or placeholder
        console.log('No session found, using local profile data');
        profileWithId = {
          ...profile,
          id: (isEditMode && userProfile?.id) ? userProfile.id : 'user-id',
          email: profile.email || (isEditMode && userProfile?.email ? userProfile.email : 'user@example.com'),
        };
      }
      
      // Pass the profile to parent component
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
    } catch (err) {
      console.error("Error completing profile:", err);
      toast({
        title: "Error saving profile",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
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
            isSaving={isSubmitting || savingProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
