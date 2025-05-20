
import React, { useEffect, useState } from 'react';
import { TrendingUp, Wallet, LineChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import InvestmentDistribution from './InvestmentDistribution';
import MonthlySavings from './MonthlySavings';
import EmergencyFund from './EmergencyFund';
import FinancialGoalSection from './FinancialGoalSection';

interface FinancialOverviewProps {
  userProfile: UserProfile;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  userProfile
}) => {
  const {
    fetchMonthlySavings,
    calculateAverageSavings
  } = useMonthlySavings();
  const [monthlySavingsData, setMonthlySavingsData] = useState<MonthlyAmount[]>([]);
  const [averageSavings, setAverageSavings] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [investmentDistribution, setInvestmentDistribution] = useState<Array<{
    type: string;
    percentage: number;
  }>>([]);
  const totalInvestments = userProfile.investments.reduce((sum, inv) => sum + inv.value, 0);
  const monthlyIncome = userProfile.monthlyIncome;

  // Calculate recommended savings (basic rule: 20% of income)
  const recommendedSavings = monthlyIncome * 0.2;

  // Calculate emergency fund target (6 months of expenses)
  const monthlyExpenses = monthlyIncome * 0.7; // Assuming expenses are 70% of income
  const emergencyFundTarget = monthlyExpenses * 6;

  // Calculate current emergency fund amount based on profile data
  const emergencyFundPercentage = userProfile.hasEmergencyFund ? (userProfile.emergencyFundMonths || 0) / 6 * 100 : 30;
  const currentEmergencyFund = emergencyFundPercentage / 100 * emergencyFundTarget;
  
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
  }, [userProfile.id, fetchMonthlySavings, calculateAverageSavings]);
  
  useEffect(() => {
    // Generate investment distribution based on risk profile
    const calculateInvestmentDistribution = () => {
      const {
        riskProfile,
        investments
      } = userProfile;
      if (investments.length === 0) {
        // If no investments, use recommended allocation based on risk profile
        if (riskProfile === 'conservative') {
          return [{
            type: 'Bonds',
            percentage: 60
          }, {
            type: 'Stocks',
            percentage: 20
          }, {
            type: 'Cash',
            percentage: 15
          }, {
            type: 'Real Estate',
            percentage: 5
          }];
        } else if (riskProfile === 'moderate') {
          return [{
            type: 'Stocks',
            percentage: 50
          }, {
            type: 'Bonds',
            percentage: 30
          }, {
            type: 'Real Estate',
            percentage: 15
          }, {
            type: 'Cash',
            percentage: 5
          }];
        } else {
          // aggressive
          return [{
            type: 'Stocks',
            percentage: 70
          }, {
            type: 'Real Estate',
            percentage: 15
          }, {
            type: 'Alternative',
            percentage: 10
          }, {
            type: 'Bonds',
            percentage: 5
          }];
        }
      } else {
        // Calculate actual distribution from their investments
        const distribution: Record<string, number> = {};
        let total = 0;
        investments.forEach(inv => {
          const formattedType = formatInvestmentType(inv.type);
          if (!distribution[formattedType]) distribution[formattedType] = 0;
          distribution[formattedType] += inv.value;
          total += inv.value;
        });
        return Object.entries(distribution).map(([type, value]) => ({
          type,
          percentage: Math.round(value / total * 100)
        })).sort((a, b) => b.percentage - a.percentage);
      }
    };
    setInvestmentDistribution(calculateInvestmentDistribution());
  }, [userProfile.investments, userProfile.riskProfile]);

  // Format investment type for display
  const formatInvestmentType = (type: string): string => {
    switch (type) {
      case 'stocks':
        return 'Stocks';
      case 'bonds':
        return 'Bonds';
      case 'realEstate':
        return 'Real Estate';
      case 'cash':
        return 'Cash';
      case 'crypto':
        return 'Crypto';
      default:
        return 'Other';
    }
  };

  // First financial goal
  const firstGoal = userProfile.financialGoals[0];
  
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
        {/* Using the extracted MonthlySavings component */}
        <MonthlySavings
          averageSavings={averageSavings}
          recommendedSavings={recommendedSavings}
          loading={loading}
        />
        
        {/* Using the extracted EmergencyFund component */}
        <EmergencyFund
          currentEmergencyFund={currentEmergencyFund}
          emergencyFundTarget={emergencyFundTarget}
          emergencyFundPercentage={emergencyFundPercentage}
        />
        
        {/* Using the extracted FinancialGoalSection component */}
        <FinancialGoalSection goal={firstGoal} />
        
        {/* Investment Distribution - Using the previously extracted component */}
        <InvestmentDistribution 
          userProfile={userProfile}
          investmentDistribution={investmentDistribution}
        />
      </div>
    </div>
  );
};

export default FinancialOverview;
