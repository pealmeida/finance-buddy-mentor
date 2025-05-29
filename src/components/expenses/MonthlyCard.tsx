
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';
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
  const hasDetailedItems = item.items && item.items.length > 0;
  const itemCount = item.items?.length || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{monthName}</span>
          {hasDetailedItems && (
            <Badge variant="secondary" className="text-xs">
              <Receipt className="h-3 w-3 mr-1" />
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Badge>
          )}
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

        {hasDetailedItems && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div className="font-medium mb-1">Recent items:</div>
            {item.items?.slice(0, 2).map((expenseItem, index) => (
              <div key={index} className="flex justify-between">
                <span className="truncate mr-2">{expenseItem.description}</span>
                <span>${expenseItem.amount}</span>
              </div>
            ))}
            {itemCount > 2 && (
              <div className="text-center mt-1 text-gray-500">
                +{itemCount - 2} more items
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyCard;
