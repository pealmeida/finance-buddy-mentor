
import React from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';

// Import refactored components
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInfoTab from '@/components/profile/PersonalInfoTab';
import UserDataProvider from '@/components/profile/UserDataProvider';
import SaveButton from '@/components/profile/SaveButton';

interface ProfilePageProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onProfileUpdate }) => {
  const { toast } = useToast();
  
  const handleSaveProfile = (profile: UserProfile) => {
    try {
      onProfileUpdate(profile);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Error Saving Profile",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
        duration: 4000
      });
      console.error("Error saving profile:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={true} />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <UserDataProvider 
          userProfile={userProfile} 
          onProfileUpdate={onProfileUpdate}
        >
          {({ profile, userName, handleInputChange }) => (
            <>
              <ProfileHeader userName={userName} />
              
              <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
                {/* Personal Information Section */}
                <section>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Personal Information</h2>
                    <p className="text-gray-500">Update your basic profile details below. For more comprehensive changes, use the Edit Full Profile button.</p>
                  </div>
                  <PersonalInfoTab profile={profile} onInputChange={handleInputChange} />
                </section>
                
                <SaveButton 
                  onSave={() => handleSaveProfile(profile)} 
                  profile={profile}
                />
              </div>
            </>
          )}
        </UserDataProvider>
      </div>
    </div>
  );
};

export default ProfilePage;
