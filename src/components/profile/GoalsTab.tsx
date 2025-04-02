
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/finance';
import { Target, ChevronRight } from 'lucide-react';

interface GoalsTabProps {
  profile?: UserProfile;
  onSave?: (updatedProfile: UserProfile) => void;
  isSubmitting?: boolean;
}

const GoalsTab: React.FC<GoalsTabProps> = ({ profile, onSave, isSubmitting }) => {
  const navigate = useNavigate();

  const goalsCount = profile?.financialGoals?.length || 0;

  const handleGoalsRedirect = () => {
    navigate('/goals');
  };

  const handleInvestmentsRedirect = () => {
    navigate('/full-profile', { state: { targetStep: 4 } }); // Investments step
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goalsCount > 0 ? (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                You have {goalsCount} financial goal{goalsCount !== 1 ? 's' : ''} set up.
              </p>
              <div className="flex items-center text-sm text-finance-blue">
                <Target className="h-4 w-4 mr-1" />
                <span>Progress tracking available on the dashboard</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">
              Define your financial goals to track progress and stay motivated.
            </p>
          )}
          <Button 
            variant="outline" 
            className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white"
            onClick={handleGoalsRedirect}
          >
            Manage Goals
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            View and manage your investment portfolio.
          </p>
          <Button 
            variant="outline"
            className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white"
            onClick={handleInvestmentsRedirect}
          >
            Manage Investments
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsTab;
