import React from "react";
import { useTranslation } from "react-i18next";
import { UserProfile } from "../types/finance";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import MobileHeader from "../components/ui/mobile-header";
import MobileBottomNav from "../components/ui/mobile-bottom-nav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface DashboardPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
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
      <MobileHeader title={t("navigation.dashboard", "Dashboard")} />

      {/* Main Content with padding for fixed mobile nav and header */}
      <main className='pt-16 pb-20 md:pt-0 md:pb-0'>
        <QueryClientProvider client={queryClient}>
          <Dashboard
            userProfile={userProfile}
            onProfileUpdate={onProfileUpdate}
          />
        </QueryClientProvider>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default DashboardPage;
