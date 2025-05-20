import React, { useEffect, useState } from 'react';
import { TrendingUp, Wallet, LineChart, AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserProfile, FinancialGoal, MonthlyAmount, Investment } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
interface FinancialOverviewProps {
  userProfile: UserProfile;
}
interface InvestmentDistribution {
  type: string;
  percentage: number;
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
  const [investmentDistribution, setInvestmentDistribution] = useState<InvestmentDistribution[]>([]);
  const totalInvestments = userProfile.investments.reduce((sum, inv) => sum + inv.value, 0);
  const monthlyIncome = userProfile.monthlyIncome;

  // Calculate recommended savings (basic rule: 20% of income)
  const recommendedSavings = monthlyIncome * 0.2;

  // Calculate emergency fund target (6 months of expenses)
  const monthlyExpenses = monthlyIncome * 0.7; // Assuming expenses are 70% of income
  const emergencyFundTarget = monthlyExpenses * 6;

  // Calculate current emergency fund amount based on profile data
  // For demo purposes, if they have an emergency fund, estimate it based on the target
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
  }, [userProfile.id]);
  
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

  // Calculate savings progress based on average monthly savings
  const savingsProgress = Math.min(averageSavings / recommendedSavings * 100, 100);

  // Calculate progress for first financial goal if exists
  const firstGoal = userProfile.financialGoals[0];
  const goalProgress = firstGoal ? Math.min(firstGoal.currentAmount / firstGoal.targetAmount * 100, 100) : 0;
  
  // Render financial goal component if goal exists
  const renderFirstGoalSection = () => {
    if (!firstGoal) return null;
    
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium">{firstGoal.name}</p>
          <p className="text-sm text-gray-500">
            ${firstGoal.currentAmount.toLocaleString()} of ${firstGoal.targetAmount.toLocaleString()}
          </p>
        </div>
        <Progress value={goalProgress} className="h-2 progress-animation" />
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {goalProgress < 100 ? `${Math.round(goalProgress)}% completed` : "Goal achieved!"}
          </p>
          <p className="text-xs text-finance-blue">
            Target date: {new Date(firstGoal.targetDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };
  
  return <div className="glass-panel rounded-2xl p-6">
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
              {loading ? 'Loading...' : `$${averageSavings.toLocaleString(undefined, {
              maximumFractionDigits: 0
            })} of $${recommendedSavings.toLocaleString(undefined, {
              maximumFractionDigits: 0
            })}`}
            </p>
          </div>
          <Progress value={savingsProgress} className="h-2 progress-animation" />
          <p className="mt-1 text-xs text-gray-500">
            {savingsProgress < 100 ? `${Math.round(100 - savingsProgress)}% below recommended savings` : "Meeting recommended savings"}
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-finance-blue" />
              <p className="font-medium">Emergency Fund</p>
            </div>
            <p className="text-sm text-gray-500">
              ${currentEmergencyFund.toLocaleString(undefined, {
              maximumFractionDigits: 0
            })} 
              of ${emergencyFundTarget.toLocaleString(undefined, {
              maximumFractionDigits: 0
            })}
            </p>
          </div>
          <Progress value={emergencyFundPercentage} className="h-2 progress-animation" />
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {emergencyFundPercentage < 100 ? `${Math.round(emergencyFundPercentage)}% of 6 months target` : "Emergency fund complete!"}
            </p>
            <p className="text-xs text-finance-blue">
              Recommended: 6 months of expenses
            </p>
          </div>
        </div>
        
        {renderFirstGoalSection()}
        
        {/* Investment Distribution - Updated to match PersonalizedInsights style */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium">Investment Distribution</p>
            <p className="text-xs text-gray-500">{userProfile.riskProfile} profile</p>
          </div>
          
          <div className="flex items-center">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              {investmentDistribution.length > 0 ? <div className="flex h-full">
                  {investmentDistribution.map((item, index) => <div key={index} className={`h-full ${index === 0 ? 'bg-finance-blue' : index === 1 ? 'bg-finance-green' : index === 2 ? 'bg-finance-purple' : index === 3 ? 'bg-yellow-400' : 'bg-gray-400'}`} style={{
                width: `${item.percentage}%`
              }}></div>)}
                </div> : <div className="bg-gray-300 h-full w-full"></div>}
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {investmentDistribution.map((item, index) => <span key={index}>
                {item.type}: {item.percentage}%
              </span>)}
          </div>
          
          {userProfile.investments.length === 0 && <p className="text-xs text-gray-500 mt-2 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
              Recommended allocation based on your risk profile
            </p>}
        </div>
      </div>
    </div>;
};
export default FinancialOverview;
