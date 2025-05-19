
import React from 'react';
import { UserProfile } from '@/types/finance';
import Header from '@/components/Header';
import SavingsAnalysisHeader from '@/components/savings/analysis/SavingsAnalysisHeader';
import SavingsAnalysisTabs from '@/components/savings/analysis/SavingsAnalysisTabs';
import { Card } from '@/components/ui/card';

interface SavingsAnalysisPageProps {
  userProfile: UserProfile;
}

const SavingsAnalysisPage: React.FC<SavingsAnalysisPageProps> = ({ userProfile }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <SavingsAnalysisHeader />
        
        <Card className="mt-6 p-6">
          <SavingsAnalysisTabs userProfile={userProfile} />
        </Card>
      </div>
    </div>
  );
};

export default SavingsAnalysisPage;
