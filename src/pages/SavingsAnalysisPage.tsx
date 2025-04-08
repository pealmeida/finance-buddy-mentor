
import React, { useState } from 'react';
import SavingsAnalysisHeader from '@/components/savings/analysis/SavingsAnalysisHeader';
import SavingsAnalysisStats from '@/components/savings/analysis/SavingsAnalysisStats';
import SavingsAnalysisTabs from '@/components/savings/analysis/SavingsAnalysisTabs';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';

const SavingsAnalysisPage: React.FC = () => {
  const { calculateAverageExpenses } = useMonthlyExpenses();
  const { calculateAverageSavings } = useMonthlySavings();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Passing an empty array as the default argument for calculateAverageSavings
  const averageSavings = calculateAverageSavings([]);
  const averageExpenses = calculateAverageExpenses([]);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <SavingsAnalysisHeader />
      <SavingsAnalysisStats averageSavings={averageSavings} averageExpenses={averageExpenses} />
      <SavingsAnalysisTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default SavingsAnalysisPage;
