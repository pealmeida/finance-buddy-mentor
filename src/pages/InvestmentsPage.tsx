
import React from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import Investments from '@/components/investments/Investments';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

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
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('navigation.investments', 'Investment Portfolio')}</h1>
          <p className="text-gray-600 mt-2">
            {t('investments.description', 'Manage and track your investment portfolio in one place.')}
          </p>
        </div>
        
        <Card className="bg-white shadow-md">
          <CardContent className="p-6">
            <Investments 
              profile={userProfile}
              onSave={onProfileUpdate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestmentsPage;
