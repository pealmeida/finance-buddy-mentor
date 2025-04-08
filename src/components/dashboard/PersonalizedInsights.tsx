
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, PiggyBank, Target, ArrowUpRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useToast } from '@/components/ui/use-toast';

interface PersonalizedInsightsProps {
  userProfile: UserProfile;
  savingsProgress: number;
  expensesRatio: number; // Added this prop
}

const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({ 
  userProfile, 
  savingsProgress,
  expensesRatio
}) => {
  const { fetchMonthlySavings, calculateAverageSavings } = useMonthlySavings();
  const { toast } = useToast();
  const [averageSavingsPercent, setAverageSavingsPercent] = useState<number>(15); // Default 15%
  
  useEffect(() => {
    const loadActualSavingsPercent = async () => {
      if (!userProfile.id || userProfile.monthlyIncome <= 0) return;
      
      try {
        const currentYear = new Date().getFullYear();
        const savingsData = await fetchMonthlySavings(userProfile.id, currentYear);
        
        if (savingsData) {
          const avgSavings = calculateAverageSavings(savingsData.data);
          const savingsPercent = (avgSavings / userProfile.monthlyIncome) * 100;
          setAverageSavingsPercent(Math.round(savingsPercent));
        }
      } catch (error) {
        console.error("Error calculating actual savings percent:", error);
      }
    };
    
    loadActualSavingsPercent();
  }, [userProfile.id, userProfile.monthlyIncome]);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Personalized Insights</h2>
      </div>
      
      <div className="space-y-4">
        <div className="rounded-xl border p-4 hover:bg-gray-50 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <LineChart className="h-5 w-5 text-finance-blue" />
            <h3 className="font-medium">Investment Distribution</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Your investment mix is {userProfile.riskProfile}. This aligns with your risk profile.
          </p>
          <div className="flex items-center">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              {userProfile.investments.length > 0 ? (
                <div className="flex h-full">
                  <div className="bg-finance-blue h-full" style={{width: '40%'}}></div>
                  <div className="bg-finance-green h-full" style={{width: '25%'}}></div>
                  <div className="bg-finance-purple h-full" style={{width: '20%'}}></div>
                  <div className="bg-yellow-400 h-full" style={{width: '15%'}}></div>
                </div>
              ) : (
                <div className="bg-gray-300 h-full w-full"></div>
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Stocks</span>
            <span>Bonds</span>
            <span>Real Estate</span>
            <span>Cash</span>
          </div>
        </div>
        
        <div className="rounded-xl border p-4 hover:bg-gray-50 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <PiggyBank className="h-5 w-5 text-finance-green" />
            <h3 className="font-medium">Savings Rate</h3>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            You're saving approximately <span className="font-medium">{averageSavingsPercent}%</span> of your income.
          </p>
          <p className="text-sm text-gray-600">
            {savingsProgress < 90 ? 
              "Increasing to 20% can significantly improve your long-term financial security." : 
              "Great job! You're meeting the recommended savings rate."}
          </p>
          <Link to="/savings">
            <Button 
              variant="link" 
              className="text-finance-blue p-0 mt-2 text-sm flex items-center gap-1 hover:underline"
            >
              Improve Savings <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        
        <div className="rounded-xl border p-4 hover:bg-gray-50 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="h-5 w-5 text-finance-purple" />
            <h3 className="font-medium">Next Steps</h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-2">
            {!userProfile.hasEmergencyFund && (
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-finance-blue"></div>
                Build emergency fund (3-6 months of expenses)
              </li>
            )}
            {userProfile.hasDebts && (
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-finance-blue"></div>
                Pay off high-interest debt
              </li>
            )}
            {averageSavingsPercent < 20 && (
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-finance-blue"></div>
                Increase monthly savings to 20% of income
              </li>
            )}
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-finance-blue"></div>
              {userProfile.investments.length === 0 ? 
                "Start building an investment portfolio" : 
                "Diversify investment portfolio"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedInsights;
