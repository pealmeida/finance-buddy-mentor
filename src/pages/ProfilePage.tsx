
import React, { useState } from 'react';
import { UserProfile } from '@/types/finance';
import Header from '@/components/Header';
import UserDataProvider from '@/components/profile/UserDataProvider';
import PersonalInfoTab from '@/components/profile/PersonalInfoTab';
import InvestmentRecommendations from '@/components/InvestmentRecommendations';
import SavingStrategies from '@/components/SavingStrategies';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Pencil, User, LineChart, PiggyBank } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfilePageProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onProfileUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal-info');
  const navigate = useNavigate();
  
  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    setIsSubmitting(true);
    try {
      await onProfileUpdate(updatedProfile);
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  const handleEditFullProfile = () => {
    navigate('/full-profile', { state: { isEditMode: true } });
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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <p className="text-gray-500 mt-1">
                  Welcome, <span className="font-medium">{userName}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleEditFullProfile}
                  className="flex items-center gap-2 border-finance-blue text-finance-blue hover:bg-finance-blue hover:text-white"
                >
                  <Pencil className="h-4 w-4" /> Edit Full Profile
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')} 
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to Dashboard
                </Button>
              </div>
            </div>
            
            <div className="w-full max-w-4xl mx-auto">
              <Tabs defaultValue="personal-info" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-transparent p-0 space-x-6 border-b">
                  <TabsTrigger 
                    value="personal-info"
                    className="flex items-center gap-2 px-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-finance-blue data-[state=active]:text-finance-blue rounded-none"
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">Personal Information</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="investments"
                    className="flex items-center gap-2 px-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-finance-blue data-[state=active]:text-finance-blue rounded-none"
                  >
                    <LineChart className="h-4 w-4" />
                    <span className="font-medium">Investment Recommendations</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="savings"
                    className="flex items-center gap-2 px-1 py-3 data-[state=active]:border-b-2 data-[state=active]:border-finance-blue data-[state=active]:text-finance-blue rounded-none"
                  >
                    <PiggyBank className="h-4 w-4" />
                    <span className="font-medium">Money-Saving Strategies</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal-info" className="mt-6">
                  <PersonalInfoTab 
                    profile={profile} 
                    onInputChange={handleInputChange}
                    handleInputChange={handleInputChange}
                    isSubmitting={isSubmitting}
                  />
                  
                  <div className="mt-8 flex justify-end">
                    <Button 
                      onClick={() => handleProfileUpdate(profile)}
                      disabled={isSubmitting}
                      className="bg-finance-blue hover:bg-finance-blue-dark text-white"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="investments" className="mt-6">
                  <InvestmentRecommendations userProfile={userProfile} />
                </TabsContent>
                
                <TabsContent value="savings" className="mt-6">
                  <SavingStrategies userProfile={userProfile} />
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
