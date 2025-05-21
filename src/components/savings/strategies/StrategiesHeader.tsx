
import React from 'react';
import { Button } from '@/components/ui/button';

interface StrategiesHeaderProps {
  title: string;
}

const StrategiesHeader: React.FC<StrategiesHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <Button 
        variant="outline" 
        className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white transition-all duration-300"
      >
        See All
      </Button>
    </div>
  );
};

export default StrategiesHeader;
