
import React from 'react';
import { InvestmentRecommendation } from '@/types/finance';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AllocationChart from './AllocationChart';
import AllocationBreakdown from './AllocationBreakdown';

interface DetailedViewProps {
  recommendation: InvestmentRecommendation;
}

const DetailedView: React.FC<DetailedViewProps> = ({ recommendation }) => {
  return (
    <div className="mt-6 animate-scale-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AllocationChart allocation={recommendation.allocation} />
        
        <AllocationBreakdown
          allocation={recommendation.allocation}
          riskLevel={recommendation.riskLevel}
          expectedReturn={recommendation.expectedReturn}
          timeHorizon={recommendation.timeHorizon}
        />
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2">
          Get Detailed Plan
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DetailedView;
