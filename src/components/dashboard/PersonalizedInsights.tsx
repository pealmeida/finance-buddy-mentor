
import React from 'react';
import { UserProfile } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit, BarChart3 } from 'lucide-react';

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
  // Generate personalized insights based on user data
  const getPersonalizedInsight = (): string => {
    const name = userProfile.name?.split(' ')[0] || 'there';
    let insight = '';
    
    if (savingsProgress < 50) {
      insight = `Hi ${name}, we noticed your monthly savings are below the recommended amount. Consider creating a budget to increase your savings rate.`;
    } else if (savingsProgress >= 50 && savingsProgress < 100) {
      insight = `Good job ${name}! You're making progress toward your savings goals, but there's still room for improvement.`;
    } else {
      insight = `Excellent work ${name}! You're exceeding your savings targets. Consider investing the extra funds to maximize your returns.`;
    }
    
    return insight;
  };
  
  const getExpenseInsight = (): string => {
    const name = userProfile.name?.split(' ')[0] || 'there';
    
    if (expensesRatio > 70) {
      return `${name}, your expenses are high relative to your income. Consider identifying areas where you can cut back.`;
    } else if (expensesRatio > 50) {
      return `${name}, your expenses are at a moderate level. Look for opportunities to reduce non-essential spending.`;
    } else {
      return `${name}, you're doing well at keeping your expenses in check. This gives you more flexibility for savings and investments.`;
    }
  };
  
  const getRiskBasedAdvice = (): string => {
    const name = userProfile.name?.split(' ')[0] || 'there';
    const riskProfile = userProfile.riskProfile.toLowerCase();
    
    if (riskProfile === 'conservative') {
      return `As a conservative investor ${name}, focus on stable investments like bonds and dividend stocks to preserve capital.`;
    } else if (riskProfile === 'moderate') {
      return `With your moderate risk tolerance ${name}, a balanced portfolio of stocks and bonds could work well for you.`;
    } else {
      return `As an aggressive investor ${name}, you might consider growth stocks and alternative investments for higher potential returns.`;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-purple-500" />
            Personalized Insights
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-md font-medium mb-2">Savings Progress</h3>
          <Progress value={savingsProgress} className="h-2" indicatorClassName="bg-green-500" />
          <p className="mt-2 text-sm text-gray-600">
            {getPersonalizedInsight()}
          </p>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Expense Analysis</h3>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-red-500" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${Math.min(expensesRatio, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {getExpenseInsight()}
          </p>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Investment Strategy</h3>
          <p className="text-sm text-gray-600">
            {getRiskBasedAdvice()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedInsights;
