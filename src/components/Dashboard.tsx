
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/finance';
import FinancialOverview from './dashboard/FinancialOverview';
import FinancialGoals from './dashboard/FinancialGoals';
import PersonalizedInsights from './dashboard/PersonalizedInsights';
import MarketTrends from './dashboard/MarketTrends';
import ExpensesSummary from './dashboard/ExpensesSummary';
import OnboardingChecklist from './dashboard/OnboardingChecklist';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const { t } = useTranslation();
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
        
        if (savingsData && savingsData.data) {
          // Ensure we convert any JSON data to the proper MonthlyAmount type
          const typedSavingsData = Array.isArray(savingsData.data) 
            ? savingsData.data.map(item => ({
                month: typeof item.month === 'number' ? item.month : parseInt(String(item.month)),
                amount: typeof item.amount === 'number' ? item.amount : parseFloat(String(item.amount))
              }))
            : [];
          
          const avgSavings = calculateAverageSavings(typedSavingsData);
          const progress = Math.min((avgSavings / recommendedSavings) * 100, 100);
          setSavingsProgress(progress);
        }
        
        // Fetch expenses data
        const expensesData = await fetchMonthlyExpenses(userProfile.id, currentYear);
        
        if (expensesData && savingsData) {
          // Ensure we convert any JSON data to the proper MonthlyAmount type 
          const typedExpensesData = Array.isArray(expensesData.data) 
            ? expensesData.data.map(item => ({
                month: typeof item.month === 'number' ? item.month : parseInt(String(item.month)),
                amount: typeof item.amount === 'number' ? item.amount : parseFloat(String(item.amount))
              }))
            : [];
          
          const typedSavingsData = Array.isArray(savingsData.data) 
            ? savingsData.data.map(item => ({
                month: typeof item.month === 'number' ? item.month : parseInt(String(item.month)),
                amount: typeof item.amount === 'number' ? item.amount : parseFloat(String(item.amount))
              }))
            : [];
          
          const avgExpenses = calculateAverageExpenses(typedExpensesData);
          const avgSavings = calculateAverageSavings(typedSavingsData);
          
          // Calculate what percentage of income is being spent
          if (monthlyIncome > 0) {
            const expenseRatio = Math.min((avgExpenses / monthlyIncome) * 100, 100);
            setExpensesRatio(expenseRatio);
          }
        }
      } catch (error) {
        console.error(t('errors.errorCalculating'), error);
      }
    };
    
    calculateFinancialMetrics();
  }, [userProfile.id, recommendedSavings, monthlyIncome, fetchMonthlySavings, fetchMonthlyExpenses, calculateAverageSavings, calculateAverageExpenses, t]);

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 px-4 sm:px-6 animate-fade-in">
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
      
      {/* Floating Onboarding Checklist */}
      <OnboardingChecklist userProfile={userProfile} />
    </div>
  );
};

export default Dashboard;
