
import React from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import Investments from '@/components/investments/Investments';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import MobileHeader from '@/components/ui/mobile-header';
import MobileBottomNav from '@/components/ui/mobile-bottom-nav';
import ResponsiveContainer from '@/components/ui/responsive-container';

interface InvestmentsPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const InvestmentsPage: React.FC<InvestmentsPageProps> = ({ 
  userProfile, 
  onProfileUpdate 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header onboardingComplete={true} />
      </div>
      
      {/* Mobile Header */}
      <MobileHeader 
        title={t('navigation.investments', 'Investment Portfolio')}
        showMenu={true}
      />
      
      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        <ResponsiveContainer className="py-4 md:py-8">
          {/* Page Title and Description - Hidden on mobile */}
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-bold">{t('navigation.investments', 'Investment Portfolio')}</h1>
            <p className="text-gray-600 mt-2">
              {t('investments.description', 'Manage and track your investment portfolio in one place.')}
            </p>
          </div>
          
          {/* Content Card */}
          <Card className="bg-white shadow-sm md:shadow-md">
            <CardContent className="p-4 md:p-6">
              <Investments 
                profile={userProfile}
                onSave={onProfileUpdate}
              />
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
