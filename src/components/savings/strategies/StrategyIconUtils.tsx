
import React from 'react';
import { CreditCard, DollarSign, LineChart, PiggyBank, Smartphone } from 'lucide-react';

export const getIconForStrategy = (id: string): React.ReactNode => {
  switch (id) {
    case '1':
      return <DollarSign className="h-5 w-5 text-finance-blue" />;
    case '2':
      return <Smartphone className="h-5 w-5 text-finance-purple" />;
    case '3':
      return <PiggyBank className="h-5 w-5 text-finance-green" />;
    case '4':
      return <CreditCard className="h-5 w-5 text-red-500" />;
    case '5':
      return <LineChart className="h-5 w-5 text-finance-blue" />;
    default:
      return <PiggyBank className="h-5 w-5 text-finance-green" />;
  }
};
