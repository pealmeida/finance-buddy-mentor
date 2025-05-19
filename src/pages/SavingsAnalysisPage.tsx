
import React, { useState } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import Header from '@/components/Header';
import SavingsAnalysisHeader from '@/components/savings/analysis/SavingsAnalysisHeader';
import SavingsAnalysisTabs from '@/components/savings/analysis/SavingsAnalysisTabs';
import { Card } from '@/components/ui/card';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';

interface SavingsAnalysisPageProps {
  userProfile: UserProfile;
}

const SavingsAnalysisPage: React.FC<SavingsAnalysisPageProps> = ({ userProfile }) => {
  // Use the current year as the default
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { loading, error, fetchMonthlySavings, calculateAverageSavings } = useMonthlySavings();
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>([]);
  const [averageSaved, setAverageSaved] = useState<number>(0);
  
  // Handle year changes
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    // Additional logic for fetching new data when year changes could go here
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        <SavingsAnalysisHeader 
          selectedYear={selectedYear}
          handleYearChange={handleYearChange}
          loadingData={loading}
        />
        
        <Card className="mt-6 p-6">
          <SavingsAnalysisTabs 
            loadingData={loading}
            savingsData={savingsData}
            averageSaved={averageSaved}
            selectedYear={selectedYear}
            error={error}
          />
        </Card>
      </div>
    </div>
  );
};

export default SavingsAnalysisPage;
