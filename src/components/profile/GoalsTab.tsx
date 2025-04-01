
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GoalsTab: React.FC = () => {
  const navigate = useNavigate();

  const handleGoalsRedirect = () => {
    navigate('/onboarding', { state: { targetStep: 3 } }); // Financial Goals step
  };

  const handleInvestmentsRedirect = () => {
    navigate('/onboarding', { state: { targetStep: 4 } }); // Investments step
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            View and manage your financial goals and investments.
          </p>
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
