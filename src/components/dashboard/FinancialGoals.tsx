
import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserProfile } from '@/types/finance';

interface FinancialGoalsProps {
  userProfile: UserProfile;
}

const FinancialGoals: React.FC<FinancialGoalsProps> = ({ userProfile }) => {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Financial Goals</h2>
        <Link to="/goals">
          <Button variant="ghost" className="text-finance-blue flex items-center gap-1 text-sm">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {userProfile.financialGoals.length > 0 ? (
        <div className="space-y-4">
          {userProfile.financialGoals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="flex items-center space-x-4 p-4 rounded-xl border hover:bg-gray-50 transition-all duration-300">
              <div className="h-10 w-10 rounded-full bg-finance-purple-light flex items-center justify-center">
                <Target className="h-5 w-5 text-finance-purple" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{goal.name}</h3>
                  <span className="text-sm font-medium text-finance-purple">
                    {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(goal.currentAmount / goal.targetAmount) * 100} 
                  className="h-1.5 mt-2 progress-animation" 
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    By {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <Target className="h-10 w-10 mx-auto mb-2 text-gray-300" />
          <p>No financial goals yet</p>
          <Button 
            variant="outline" 
            className="mt-4 text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white transition-all duration-300"
          >
            Add a Goal
          </Button>
        </div>
      )}
    </div>
  );
};

export default FinancialGoals;
