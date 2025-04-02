
import React from 'react';
import { Edit, Trash2, LineChart, Landmark, Home, Coins, BitcoinSign, DollarSign, HelpCircle } from 'lucide-react';
import { Investment } from '@/types/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InvestmentCardProps {
  investment: Investment;
  onEdit: (investment: Investment) => void;
  onDelete: (id: string) => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  onEdit,
  onDelete
}) => {
  // Map investment types to icons
  const getInvestmentIcon = () => {
    switch (investment.type) {
      case 'stocks':
        return <LineChart className="h-5 w-5 text-blue-500" />;
      case 'bonds':
        return <Landmark className="h-5 w-5 text-green-600" />;
      case 'realEstate':
        return <Home className="h-5 w-5 text-orange-500" />;
      case 'cash':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'crypto':
        return <BitcoinSign className="h-5 w-5 text-yellow-500" />;
      case 'other':
      default:
        return <Coins className="h-5 w-5 text-purple-500" />;
    }
  };

  // Format type for display
  const formatType = (type: string) => {
    if (type === 'realEstate') return 'Real Estate';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            {getInvestmentIcon()}
            <h3 className="font-medium">{investment.name}</h3>
          </div>
          <Badge variant="outline">{formatType(investment.type)}</Badge>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Current Value</span>
            <span className="font-medium">${investment.value.toLocaleString()}</span>
          </div>
          
          {investment.annualReturn !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Annual Return</span>
              <span className="font-medium">{investment.annualReturn}%</span>
            </div>
          )}
        </div>
        
        <div className="px-4 pb-4 pt-2 flex justify-end gap-2 border-t bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(investment)}
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(investment.id)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCard;
