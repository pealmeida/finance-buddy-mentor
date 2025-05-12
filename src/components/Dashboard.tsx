
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/finance';
import InvestmentRecommendations from './InvestmentRecommendations';
import SavingStrategies from './SavingStrategies';
import FinancialOverview from './dashboard/FinancialOverview';
import FinancialGoals from './dashboard/FinancialGoals';
import PersonalizedInsights from './dashboard/PersonalizedInsights';
import MarketTrends from './dashboard/MarketTrends';
import ExpensesSummary from './dashboard/ExpensesSummary';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useMonthlyDataProcessor } from '@/hooks/useMonthlyDataProcessor';
import { logger } from '@/utils/logger';
import { useToast } from '@/components/ui/use-toast';

interface DashboardProps {
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const { fetchMonthlySavings } = useMonthlySavings();
  const { fetchMonthlyExpenses } = useMonthlyExpenses();
  const { toast } = useToast();
  const [savingsProgress, setSavingsProgress] = useState<number>(75); // Default value
  const [expensesRatio, setExpensesRatio] = useState<number>(50); // Default value
  const [savingsData, setSavingsData] = useState<any[]>([]);
  const [expensesData, setExpensesData] = useState<any[]>([]);
  
  // Use our data processor hook for type-safe data handling
  const processedSavings = useMonthlyDataProcessor(savingsData);
  const processedExpenses = useMonthlyDataProcessor(expensesData);
  
  // Calculate key metrics for child components
  const monthlyIncome = userProfile.monthlyIncome;
  const recommendedSavings = monthlyIncome * 0.2;

  useEffect(() => {
    const calculateFinancialMetrics = async () => {
      if (!userProfile.id) {
        logger.warn("No user profile ID available, skipping metrics calculation");
        return;
      }
      
      try {
        const currentYear = new Date().getFullYear();
        
        // Fetch savings data
        const savingsData = await fetchMonthlySavings(userProfile.id, currentYear);
        if (savingsData?.data) {
          setSavingsData(savingsData.data);
        }
        
        // Fetch expenses data
        const expensesData = await fetchMonthlyExpenses(userProfile.id, currentYear);
        if (expensesData?.data) {
          setExpensesData(expensesData.data);
        }
        
      } catch (error) {
        logger.error("Error calculating financial metrics:", error);
        toast({
          title: "Error loading data",
          description: "Could not load your financial data. Please try refreshing.",
          variant: "destructive"
        });
      }
    };
    
    calculateFinancialMetrics();
  }, [userProfile.id, fetchMonthlyExpenses, fetchMonthlySavings, toast]);

  // Calculate progress and ratios based on processed data
  useEffect(() => {
    // Calculate savings progress
    const avgSavings = processedSavings.average;
    const progress = Math.min((avgSavings / recommendedSavings) * 100, 100);
    setSavingsProgress(progress);
    
    // Calculate expense ratio if we have income
    if (monthlyIncome > 0) {
      const expenseRatio = Math.min((processedExpenses.average / monthlyIncome) * 100, 100);
      setExpensesRatio(expenseRatio);
    }
  }, [processedSavings, processedExpenses, recommendedSavings, monthlyIncome]);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/5 space-y-8">
          <FinancialOverview userProfile={userProfile} />
          <FinancialGoals userProfile={userProfile} />
          <ExpensesSummary userProfile={userProfile} expensesRatio={expensesRatio} />
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
