
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface MonthlyCardProps {
  item: MonthlyAmount;
  monthName: string;
}

const MonthlyCard: React.FC<MonthlyCardProps> = ({
  item,
  monthName
}) => {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{monthName}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            ${item.amount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {t('expenses.totalExpenses', 'Total Expenses')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCard;
