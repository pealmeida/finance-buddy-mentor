import React, { useState } from "react";
import { UserProfile } from "../types/finance";
import Header from "../components/Header";
import UserDataProvider from "../components/profile/UserDataProvider";
import PersonalInfoTab from "../components/profile/PersonalInfoTab";
import { Button } from "../components/ui/button";
import { ChevronLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../components/ui/mobile-header";
import MobileBottomNav from "../components/ui/mobile-bottom-nav";
import { useTranslation } from "react-i18next";

interface ProfilePageProps {
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  onProfileUpdate,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    navigate("/full-profile", { state: { isEditMode: true } });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      {/* Desktop Header */}
      <div className='hidden md:block'>
        <Header onboardingComplete={true} />
      </div>

      {/* Mobile Header */}
      <MobileHeader title={t("profile.title", "Profile Settings")} />

      {/* Main Content */}
      <main className='pt-16 pb-20 md:pt-0 md:pb-8'>
        <UserDataProvider
          userProfile={userProfile}
          onProfileUpdate={onProfileUpdate}>
          {({ profile, userName, handleInputChange }) => (
            <div className='w-full'>
              {/* Full-width container consistent with header */}
              <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8'>
                {/* Desktop Header Section */}
                <div className='hidden md:flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4'>
                  <div>
                    <h1 className='text-3xl font-bold'>
                      {t("profile.title", "Profile Settings")}
                    </h1>
                    <p className='text-gray-500 mt-1'>
                      {t("profile.welcome", "Welcome")},{" "}
                      <span className='font-medium'>{userName}</span>
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-3'>
                    <Button
                      variant='outline'
                      onClick={handleEditFullProfile}
                      className='flex items-center gap-2 border-finance-blue text-finance-blue hover:bg-finance-blue hover:text-white'>
                      <Pencil className='h-4 w-4' />{" "}
                      {t("profile.editFullProfile", "Edit Full Profile")}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => navigate("/dashboard")}
                      className='flex items-center gap-2'>
                      <ChevronLeft className='h-4 w-4' />{" "}
                      {t("profile.backToDashboard", "Back to Dashboard")}
                    </Button>
                  </div>
                </div>

                {/* Mobile Welcome Message and Edit Button */}
                <div className='md:hidden mb-4 flex flex-row items-center justify-between gap-3 px-4'>
                  <p className='text-gray-600 text-left flex-1'>
                    {t("profile.welcome", "Welcome")},{" "}
                    <span className='font-medium text-finance-blue'>
                      {userName}
                    </span>
                  </p>
                  <Button
                    variant='outline'
                    onClick={handleEditFullProfile}
                    className='flex-shrink-0 flex items-center justify-center gap-2 border-finance-blue text-finance-blue hover:bg-finance-blue hover:text-white'>
                    <Pencil className='h-4 w-4' />{" "}
                    {t("profile.editFullProfile", "Edit Full Profile")}
                  </Button>
                </div>

                {/* Personal Information Content */}
                <div className='w-full'>
                  <PersonalInfoTab
                    profile={profile}
                    onInputChange={handleInputChange}
                    isSubmitting={isSubmitting}
                  />

                  <div className='mt-8 flex justify-center md:justify-end'>
                    <Button
                      onClick={() => handleProfileUpdate(profile)}
                      disabled={isSubmitting}
                      className='w-full md:w-auto bg-finance-blue hover:bg-finance-blue-dark text-white px-8 py-3 font-medium shadow-lg'>
                      {isSubmitting
                        ? t("profile.saving", "Saving...")
                        : t("profile.saveChanges", "Save Changes")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </UserDataProvider>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default ProfilePage;
