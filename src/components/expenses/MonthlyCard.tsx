
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';

interface MonthlyCardProps {
  item: MonthlyAmount;
  monthName: string;
  onAmountClick: () => void;
}

const MonthlyCard: React.FC<MonthlyCardProps> = ({
  item,
  monthName,
  onAmountClick
}) => {
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
      
      <CardContent>
        <div 
          className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          onClick={onAmountClick}
        >
          <div className="text-2xl font-bold text-red-600">
            ${item.amount.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCard;
