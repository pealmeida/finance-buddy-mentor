
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { UserProfile } from '@/types/finance';

interface DashboardPageProps {
  userProfile: UserProfile;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ userProfile }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={true} />
      <Dashboard userProfile={userProfile} />
    </div>
  );
};

export default DashboardPage;
