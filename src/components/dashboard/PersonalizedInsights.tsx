
import React from 'react';
import { UserProfile } from '@/types/finance';
import { CircleDollarSign, Wallet, TrendingUp, Ban } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PersonalizedInsightsProps {
  userProfile: UserProfile;
  savingsProgress: number;
  expensesRatio: number;
}

const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({ 
  userProfile, 
  savingsProgress,
  expensesRatio
}) => {
  // Calculate spending insights
  const isHighSpending = expensesRatio > 70;
  const spendingStatus = isHighSpending ? 'High' : expensesRatio > 50 ? 'Moderate' : 'Low';
  const spendingColor = isHighSpending ? 'text-red-500' : expensesRatio > 50 ? 'text-amber-500' : 'text-green-500';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Personalized Insights</h2>
      
      <div className="space-y-6">
        {/* Savings Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Wallet className="text-blue-500 mr-2" />
              <h3 className="font-medium">Savings Progress</h3>
            </div>
            <span className="text-sm font-semibold">{Math.round(savingsProgress)}%</span>
          </div>
          <Progress value={savingsProgress} className="h-2" />
          <p className="mt-2 text-sm text-gray-600">
            {savingsProgress >= 100 
              ? "Excellent! You're meeting or exceeding your savings goals."
              : savingsProgress >= 70
              ? "Good progress towards your saving target."
              : "Consider increasing your monthly savings."}
          </p>
        </div>
        
        {/* Spending Analysis */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <CircleDollarSign className="text-red-500 mr-2" />
              <h3 className="font-medium">Spending Analysis</h3>
            </div>
            <span className={`text-sm font-semibold ${spendingColor}`}>{spendingStatus}</span>
          </div>
          <Progress value={expensesRatio} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
          <p className="mt-2 text-sm text-gray-600">
            {isHighSpending
              ? "Your expenses are high relative to your income. Consider budgeting."
              : expensesRatio > 50
              ? "Your spending is reasonable, but there's room for improvement."
              : "Great job keeping your expenses low!"}
          </p>
        </div>
        
        {/* Investment Opportunity */}
        <div className="flex items-start">
          <TrendingUp className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Investment Opportunity</h3>
            <p className="text-sm text-gray-600">
              Based on your risk profile ({userProfile.riskProfile}), consider exploring {' '}
              {userProfile.riskProfile === 'Conservative' 
                ? 'bonds and high-yield savings' 
                : userProfile.riskProfile === 'Moderate'
                ? 'balanced mutual funds'
                : 'growth stocks and ETFs'}.
            </p>
          </div>
        </div>
        
        {/* Debt Management */}
        {userProfile.hasDebts && (
          <div className="flex items-start">
            <Ban className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Debt Management</h3>
              <p className="text-sm text-gray-600">
                Focus on paying down high-interest debt first while maintaining minimum payments on others.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedInsights;
