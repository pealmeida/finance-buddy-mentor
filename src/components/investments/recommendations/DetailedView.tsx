
import React from 'react';
import { InvestmentRecommendation } from '@/types/finance';
import AllocationChart from './AllocationChart';
import AllocationBreakdown from './AllocationBreakdown';
import ActionButton from './ActionButton';

interface DetailedViewProps {
  recommendation: InvestmentRecommendation;
}

const DetailedView: React.FC<DetailedViewProps> = ({ recommendation }) => {
  return (
    <div className="mt-6 animate-scale-in">
      <AllocationSection recommendation={recommendation} />
      
      <div className="mt-6 flex justify-end">
        <ActionButton />
      </div>
    </div>
  );
};

interface AllocationSectionProps {
  recommendation: InvestmentRecommendation;
}

const AllocationSection: React.FC<AllocationSectionProps> = ({ recommendation }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AllocationChart allocation={recommendation.allocation} />
      
      <AllocationBreakdown
        allocation={recommendation.allocation}
        riskLevel={recommendation.riskLevel}
        expectedReturn={recommendation.expectedReturn}
        timeHorizon={recommendation.timeHorizon}
      />
    </div>
  );
};

export default DetailedView;
