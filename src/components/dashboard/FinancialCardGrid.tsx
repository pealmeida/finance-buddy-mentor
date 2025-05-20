
import React from 'react';
import { TrendingUp, Wallet, LineChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile } from '@/types/finance';

interface FinancialCardGridProps {
  monthlyIncome: number;
  totalInvestments: number;
}

const FinancialCardGrid: React.FC<FinancialCardGridProps> = ({
  monthlyIncome,
  totalInvestments
}) => {
  return (
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
  );
};

export default FinancialCardGrid;
