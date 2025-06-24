import React from "react";
import Header from "../components/Header";
import { UserProfile } from "../types/finance";
import Investments from "../components/investments/Investments";
import { Card, CardContent } from "../components/ui/card";
import { useTranslation } from "react-i18next";
import MobileHeader from "../components/ui/mobile-header";
import MobileBottomNav from "../components/ui/mobile-bottom-nav";
import ResponsiveContainer from "../components/ui/responsive-container";

interface InvestmentsPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const InvestmentsPage: React.FC<InvestmentsPageProps> = ({
  userProfile,
  onProfileUpdate,
}) => {
  const { t } = useTranslation();

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      {/* Desktop Header */}
      <div className='hidden md:block'>
        <Header onboardingComplete={true} />
      </div>

      {/* Mobile Header */}
      <MobileHeader
        title={t("navigation.investments", "Investment Portfolio")}
      />

      {/* Main Content */}
      <main className='pt-16 pb-20 md:pt-0 md:pb-8'>
        <ResponsiveContainer className='py-4 md:py-8 space-y-8'>
          {/* Page Title and Description - Hidden on mobile */}
          <div className='hidden md:block mb-8'>
            <h1 className='text-3xl font-bold'>
              {t("navigation.investments", "Investments")}
            </h1>
          </div>

          {/* Investment Portfolio Section */}
          <Card
            className='bg-white shadow-sm md:shadow-md'
            style={{ marginTop: "0px" }}>
            <CardContent className='p-4 md:p-6'>
              <Investments profile={userProfile} onSave={onProfileUpdate} />
            </CardContent>
          </Card>
        </ResponsiveContainer>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default InvestmentsPage;
