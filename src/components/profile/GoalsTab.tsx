
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GoalsTab: React.FC = () => {
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
          >
            Manage Investments
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsTab;
