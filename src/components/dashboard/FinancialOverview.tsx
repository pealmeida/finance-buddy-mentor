
import React, { useEffect, useState } from 'react';
import { TrendingUp, Wallet, LineChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserProfile, FinancialGoal, MonthlyAmount } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';

interface FinancialOverviewProps {
  userProfile: UserProfile;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ userProfile }) => {
  const { fetchMonthlySavings, calculateAverageSavings } = useMonthlySavings();
  const [monthlySavingsData, setMonthlySavingsData] = useState<MonthlyAmount[]>([]);
  const [averageSavings, setAverageSavings] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  const totalInvestments = userProfile.investments.reduce((sum, inv) => sum + inv.value, 0);
  const monthlyIncome = userProfile.monthlyIncome;

  // Calculate recommended savings (basic rule: 20% of income)
  const recommendedSavings = monthlyIncome * 0.2;
  
  useEffect(() => {
    const loadSavingsData = async () => {
      if (!userProfile.id) return;
      
      setLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const savingsData = await fetchMonthlySavings(userProfile.id, currentYear);
        
        if (savingsData) {
          setMonthlySavingsData(savingsData.data);
          const avg = calculateAverageSavings(savingsData.data);
          setAverageSavings(avg);
        }
      } catch (error) {
        console.error("Error loading savings data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSavingsData();
  }, [userProfile.id]);
  
  // Calculate savings progress based on average monthly savings
  const savingsProgress = Math.min((averageSavings / recommendedSavings) * 100, 100);
  
  // Mock emergency fund calculation (target = 6 months of expenses)
  const emergencyFundTarget = monthlyIncome * 6 * 0.7; // Assuming expenses are 70% of income
  const currentEmergencyFund = userProfile.hasEmergencyFund ? 
    emergencyFundTarget : 
    emergencyFundTarget * 0.3; // If they don't have one, set at 30% for demo
  const emergencyFundProgress = Math.min((currentEmergencyFund / emergencyFundTarget) * 100, 100);

  // Calculate progress for first financial goal if exists
  const firstGoal = userProfile.financialGoals[0];
  const goalProgress = firstGoal ? 
    Math.min((firstGoal.currentAmount / firstGoal.targetAmount) * 100, 100) : 
    0;

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Financial Overview</h2>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="finance-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-full bg-finance-blue-light flex items-center justify-center">
                <Wallet className="h-6 w-6 text-finance-blue" />
              </div>
              <TrendingUp className="h-5 w-5 text-finance-green" />
            </div>
            <h3 className="mt-4 font-medium text-gray-500">Monthly Income</h3>
            <p className="text-2xl font-semibold">${monthlyIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="finance-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-full bg-finance-green-light flex items-center justify-center">
                <LineChart className="h-6 w-6 text-finance-green" />
              </div>
              <TrendingUp className="h-5 w-5 text-finance-green" />
            </div>
            <h3 className="mt-4 font-medium text-gray-500">Investments</h3>
            <p className="text-2xl font-semibold">${totalInvestments.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">Monthly Savings</p>
            <p className="text-sm text-gray-500">
              {loading ? 'Loading...' : 
                `$${averageSavings.toLocaleString(undefined, {maximumFractionDigits: 0})} of $${recommendedSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
            </p>
          </div>
          <Progress value={savingsProgress} className="h-2 progress-animation" />
          <p className="mt-1 text-xs text-gray-500">
            {savingsProgress < 100 ? 
              `${Math.round(100 - savingsProgress)}% below recommended savings` : 
              "Meeting recommended savings"}
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">Emergency Fund</p>
            <p className="text-sm text-gray-500">${currentEmergencyFund.toLocaleString()} of ${emergencyFundTarget.toLocaleString()}</p>
          </div>
          <Progress value={emergencyFundProgress} className="h-2 progress-animation" />
          <p className="mt-1 text-xs text-gray-500">
            {emergencyFundProgress < 100 ? 
              `${Math.round(emergencyFundProgress)}% of 6 months target` : 
              "Emergency fund complete!"}
          </p>
        </div>
        
        {firstGoal && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">{firstGoal.name}</p>
              <p className="text-sm text-gray-500">${firstGoal.currentAmount.toLocaleString()} of ${firstGoal.targetAmount.toLocaleString()}</p>
            </div>
            <Progress value={goalProgress} className="h-2 progress-animation" />
            <p className="mt-1 text-xs text-gray-500">
              Target date: {new Date(firstGoal.targetDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialOverview;
