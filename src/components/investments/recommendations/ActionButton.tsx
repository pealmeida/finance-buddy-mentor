
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActionButton: React.FC = () => {
  return (
    <Button className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2">
      Get Detailed Plan
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
};

export default ActionButton;
