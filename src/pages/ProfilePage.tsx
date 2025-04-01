
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInfoTab from '@/components/profile/PersonalInfoTab';
import FinancialTab from '@/components/profile/FinancialTab';
import GoalsTab from '@/components/profile/GoalsTab';

interface ProfilePageProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onProfileUpdate }) => {
  const [profile, setProfile] = useState<UserProfile>({...userProfile});
  const [userName, setUserName] = useState<string>('');
  const { toast } = useToast();
  
  // Fetch current user email and name from Supabase auth
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { email, user_metadata } = session.user;
        
        // Update profile with the authenticated user's email and name
        if (email) {
          setProfile(prev => ({
            ...prev,
            email
          }));
        }
        
        // Set user name for display
        if (user_metadata && user_metadata.name) {
          setProfile(prev => ({
            ...prev,
            name: user_metadata.name
          }));
          setUserName(user_metadata.name);
        } else if (profile.name) {
          setUserName(profile.name);
        } else if (email) {
          // Use email as fallback if no name is available
          const nameFromEmail = email.split('@')[0];
          setUserName(nameFromEmail);
        }
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update userName if name field changes
    if (field === 'name') {
      setUserName(value);
    }
  };
  
  const handleSaveProfile = () => {
    onProfileUpdate(profile);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
      duration: 3000
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={true} />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader userName={userName} />
        
        <div className="bg-white rounded-xl shadow-sm p-8">
          <Tabs defaultValue="personal" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="financial">Financial Profile</TabsTrigger>
              <TabsTrigger value="goals">Goals & Investments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <PersonalInfoTab profile={profile} onInputChange={handleInputChange} />
            </TabsContent>
            
            <TabsContent value="financial">
              <FinancialTab profile={profile} onInputChange={handleInputChange} />
            </TabsContent>
            
            <TabsContent value="goals">
              <GoalsTab />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleSaveProfile}
              className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> 
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
