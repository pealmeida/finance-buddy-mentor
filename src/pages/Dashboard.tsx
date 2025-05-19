
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { UserProfile } from '@/types/finance';
import { useTranslation } from 'react-i18next';

interface DashboardPageProps {
  userProfile: UserProfile;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ userProfile }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={true} />
      <Dashboard userProfile={userProfile} />
    </div>
  );
};

export default DashboardPage;
