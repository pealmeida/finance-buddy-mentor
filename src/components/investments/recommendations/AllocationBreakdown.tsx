
import React from 'react';
import { AllocationItem } from '@/types/finance';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface AllocationBreakdownProps {
  allocation: AllocationItem[];
  riskLevel: string;
  expectedReturn: string;
  timeHorizon: string;
}

const AllocationBreakdown: React.FC<AllocationBreakdownProps> = ({
  allocation,
  riskLevel,
  expectedReturn,
  timeHorizon
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Allocation Breakdown</h4>
        <div className="space-y-2">
          {allocation.map((item) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.type}</span>
              </div>
              <span className="text-sm font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Investment Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Risk Level:</span>
            <span className="font-medium capitalize">{riskLevel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Expected Return:</span>
            <span className="font-medium">{expectedReturn}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Time Horizon:</span>
            <span className="font-medium">{timeHorizon}</span>
          </div>
        </div>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-xs text-gray-500 cursor-help">
              <Info className="h-3 w-3" />
              <span>About expected returns</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">
              Expected returns are based on historical data and market projections. 
              Actual returns may vary. Past performance does not guarantee future results.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AllocationBreakdown;
