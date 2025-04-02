
import React, { useState } from 'react';
import { UserProfile } from '@/types/finance';
import Header from '@/components/Header';
import UserDataProvider from '@/components/profile/UserDataProvider';
import PersonalInfoTab from '@/components/profile/PersonalInfoTab';
import FinancialTab from '@/components/profile/FinancialTab';
import GoalsTab from '@/components/profile/GoalsTab';
import MonthlySavingsTab from '@/components/profile/MonthlySavingsTab';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, Goal, User, Wallet } from 'lucide-react';

interface ProfilePageProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onProfileUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    setIsSubmitting(true);
    try {
      await onProfileUpdate(updatedProfile);
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={true} />
      
      <UserDataProvider 
        userProfile={userProfile} 
        onProfileUpdate={onProfileUpdate}
      >
        {({ profile, userName, handleInputChange }) => (
          <div className="container mx-auto px-4 py-8">
            <ProfileHeader userName={userName} />
            
            <div className="w-full max-w-4xl mx-auto mt-8">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Personal Info</span>
                    <span className="sm:hidden">Personal</span>
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span className="hidden sm:inline">Financial Info</span>
                    <span className="sm:hidden">Financial</span>
                  </TabsTrigger>
                  <TabsTrigger value="goals" className="flex items-center gap-2">
                    <Goal className="h-4 w-4" />
                    <span className="hidden sm:inline">Financial Goals</span>
                    <span className="sm:hidden">Goals</span>
                  </TabsTrigger>
                  <TabsTrigger value="savings" className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">Monthly Savings</span>
                    <span className="sm:hidden">Savings</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4">
                  <PersonalInfoTab 
                    profile={profile} 
                    onInputChange={handleInputChange}
                    handleInputChange={handleInputChange}
                    isSubmitting={isSubmitting}
                  />
                </TabsContent>
                
                <TabsContent value="financial" className="space-y-4">
                  <FinancialTab 
                    profile={profile} 
                    onInputChange={handleInputChange}
                    handleInputChange={handleInputChange}
                    isSubmitting={isSubmitting}
                  />
                </TabsContent>
                
                <TabsContent value="goals" className="space-y-4">
                  <GoalsTab 
                    profile={profile}
                    onSave={handleProfileUpdate}
                    isSubmitting={isSubmitting}
                  />
                </TabsContent>
                
                <TabsContent value="savings" className="space-y-4">
                  <MonthlySavingsTab 
                    profile={profile}
                    onSave={handleProfileUpdate}
                    isSubmitting={isSubmitting}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </UserDataProvider>
    </div>
  );
};

export default ProfilePage;
