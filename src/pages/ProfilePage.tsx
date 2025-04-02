
import React, { useState } from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';

// Import refactored components
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInfoTab from '@/components/profile/PersonalInfoTab';
import FinancialTab from '@/components/profile/FinancialTab';
import UserDataProvider from '@/components/profile/UserDataProvider';
import SaveButton from '@/components/profile/SaveButton';
import { Check, X } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfilePageProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onProfileUpdate }) => {
  const { toast } = useToast();
  const { saveUserProfile } = useSupabaseData();
  const [saving, setSaving] = useState(false);
  
  const handleSaveProfile = async (profile: UserProfile) => {
    if (!profile || !profile.id) {
      toast({
        title: "Error",
        description: "Invalid profile data. Please try again.",
        variant: "destructive",
        duration: 4000
      });
      return;
    }

    try {
      setSaving(true);
      console.log('Saving profile from ProfilePage:', profile);
      
      // Save to Supabase
      const success = await saveUserProfile(profile);
      
      if (success) {
        // Update local state
        onProfileUpdate(profile);
        
        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved.",
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: "Error Saving Profile",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
        duration: 4000
      });
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
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
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">Personal Information</TabsTrigger>
                    <TabsTrigger value="financial">Financial Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="mt-6">
                    <PersonalInfoTab profile={profile} onInputChange={handleInputChange} />
                    
                    {/* Emergency Fund Information */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Emergency Fund Status</h3>
                      <div className="flex items-center gap-2 mb-2">
                        {profile.hasEmergencyFund ? (
                          <>
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                              <Check className="h-4 w-4 text-green-600" />
                            </span>
                            <span className="text-green-700">Emergency fund established</span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100">
                              <X className="h-4 w-4 text-amber-600" />
                            </span>
                            <span className="text-amber-700">No emergency fund established</span>
                          </>
                        )}
                      </div>
                      {profile.hasEmergencyFund && profile.emergencyFundMonths && (
                        <p className="text-sm text-gray-600 pl-8">
                          You have {profile.emergencyFundMonths} {profile.emergencyFundMonths === 1 ? 'month' : 'months'} of expenses saved.
                        </p>
                      )}
                      {!profile.hasEmergencyFund && (
                        <p className="text-sm text-gray-600 pl-8">
                          It's recommended to save 3-6 months of living expenses for emergencies.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="financial" className="mt-6">
                    <FinancialTab profile={profile} onInputChange={handleInputChange} />
                  </TabsContent>
                </Tabs>
                
                <SaveButton 
                  onSave={() => handleSaveProfile(profile)} 
                  profile={profile}
                  isSaving={saving}
                  disabled={!profile || !profile.id}
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
