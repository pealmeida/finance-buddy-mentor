
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { UserProfile } from '@/types/finance';
import { useTranslation } from 'react-i18next';
import MobileHeader from '@/components/ui/mobile-header';
import MobileBottomNav from '@/components/ui/mobile-bottom-nav';

interface DashboardPageProps {
  userProfile: UserProfile;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ userProfile }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header onboardingComplete={true} />
      </div>
      
      {/* Mobile Header */}
      <MobileHeader 
        title={t('navigation.dashboard', 'Dashboard')}
        showMenu={true}
      />
      
      {/* Main Content with bottom padding for mobile nav */}
      <main className="pb-20 md:pb-0">
        <Dashboard userProfile={userProfile} />
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default DashboardPage;
