
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/finance';
import InvestmentRecommendations from './InvestmentRecommendations';
import SavingStrategies from './SavingStrategies';
import FinancialOverview from './dashboard/FinancialOverview';
import FinancialGoals from './dashboard/FinancialGoals';
import PersonalizedInsights from './dashboard/PersonalizedInsights';
import MarketTrends from './dashboard/MarketTrends';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';

interface DashboardProps {
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const { fetchMonthlySavings, calculateAverageSavings } = useMonthlySavings();
  const { fetchMonthlyExpenses, calculateAverageExpenses } = useMonthlyExpenses();
  const [savingsProgress, setSavingsProgress] = useState<number>(75); // Default value
  const [expensesRatio, setExpensesRatio] = useState<number>(50); // Default value
  
  // Calculate key metrics for child components
  const monthlyIncome = userProfile.monthlyIncome;
  const recommendedSavings = monthlyIncome * 0.2;

  useEffect(() => {
    const calculateFinancialMetrics = async () => {
      if (!userProfile.id) return;
      
      try {
        const currentYear = new Date().getFullYear();
        
        // Fetch savings data
        const savingsData = await fetchMonthlySavings(userProfile.id, currentYear);
        
        if (savingsData) {
          const avgSavings = calculateAverageSavings(savingsData.data);
          const progress = Math.min((avgSavings / recommendedSavings) * 100, 100);
          setSavingsProgress(progress);
        }
        
        // Fetch expenses data
        const expensesData = await fetchMonthlyExpenses(userProfile.id, currentYear);
        
        if (expensesData && savingsData) {
          const avgExpenses = calculateAverageExpenses(expensesData.data);
          const avgSavings = calculateAverageSavings(savingsData.data);
          
          // Calculate what percentage of income is being spent
          if (monthlyIncome > 0) {
            const expenseRatio = Math.min((avgExpenses / monthlyIncome) * 100, 100);
            setExpensesRatio(expenseRatio);
          }
        }
      } catch (error) {
        console.error("Error calculating financial metrics:", error);
      }
    };
    
    calculateFinancialMetrics();
  }, [userProfile.id, recommendedSavings, monthlyIncome]);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/5 space-y-8">
          <FinancialOverview userProfile={userProfile} />
          <FinancialGoals userProfile={userProfile} />
        </div>
        
        <div className="w-full md:w-2/5 space-y-8">
          <PersonalizedInsights 
            userProfile={userProfile} 
            savingsProgress={savingsProgress}
            expensesRatio={expensesRatio} 
          />
          <MarketTrends />
        </div>
      </div>
      
      <div className="mt-12 space-y-12">
        <InvestmentRecommendations userProfile={userProfile} />
        <SavingStrategies userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Dashboard;
