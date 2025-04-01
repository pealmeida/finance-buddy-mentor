
import React from 'react';
import { Trash2 } from 'lucide-react';
import { DebtDetail } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DebtDetailItemProps {
  debt: DebtDetail;
  onRemove: (id: string) => void;
}

const DebtDetailItem: React.FC<DebtDetailItemProps> = ({ debt, onRemove }) => {
  // Map debt type to a more friendly display name
  const typeDisplayNames = {
    creditCard: 'Credit Card',
    personalLoan: 'Personal Loan',
    studentLoan: 'Student Loan',
    other: 'Other Debt'
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg mb-2 bg-white">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">{debt.name}</span>
          <Badge variant="outline" className="text-xs">
            {typeDisplayNames[debt.type]}
          </Badge>
        </div>
        <div className="text-sm text-gray-500 mt-1 flex gap-4">
          <span>${debt.amount.toLocaleString()}</span>
          <span>{debt.interestRate}% APR</span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onRemove(debt.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DebtDetailItem;
