import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { Check, ChevronDown, ChevronUp, PiggyBank } from "lucide-react";
import { SavingStrategy } from "../../../types/finance";

interface StrategyCardProps {
  strategy: SavingStrategy;
  onToggle: (id: string) => void;
  isExpanded: boolean;
  iconComponent: React.ReactNode;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onToggle,
  isExpanded,
  iconComponent,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "hard":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeFrameColor = (timeFrame: string) => {
    switch (timeFrame) {
      case "immediate":
        return "bg-finance-green-light text-finance-green-dark";
      case "short-term":
        return "bg-finance-blue-light text-finance-blue-dark";
      case "long-term":
        return "bg-finance-purple-light text-finance-purple-dark";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className='finance-card overflow-hidden'>
      <CardContent className='p-6'>
        <div className='flex justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-full bg-finance-green-light flex items-center justify-center'>
              {iconComponent}
            </div>
            <div>
              <h3 className='font-medium'>{strategy.title}</h3>
              <div className='flex items-center space-x-2 mt-1'>
                <Badge
                  variant='secondary'
                  className={getDifficultyColor(strategy.difficulty)}>
                  {strategy.difficulty}
                </Badge>
                <Badge
                  variant='secondary'
                  className={getTimeFrameColor(strategy.timeFrame)}>
                  {strategy.timeFrame}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onToggle(strategy.id)}
            className='text-gray-500'>
            {isExpanded ? (
              <ChevronUp className='h-5 w-5' />
            ) : (
              <ChevronDown className='h-5 w-5' />
            )}
          </Button>
        </div>

        <p className='text-sm text-gray-600 mb-4'>{strategy.description}</p>

        <div className='flex items-center'>
          <PiggyBank className='h-5 w-5 text-finance-green mr-2' />
          <p className='text-sm'>
            <span className='font-medium'>Potential Monthly Savings:</span> $
            {strategy.potentialSaving.toLocaleString()}
          </p>
        </div>

        {isExpanded && (
          <div className='mt-6 animate-scale-in'>
            <h4 className='font-medium mb-3'>Implementation Steps</h4>
            <div className='space-y-3'>
              {strategy.steps.map((step, index) => (
                <div key={index} className='flex items-start gap-2'>
                  <div className='h-5 w-5 rounded-full bg-finance-green-light flex items-center justify-center mt-0.5'>
                    <Check className='h-3 w-3 text-finance-green' />
                  </div>
                  <p className='text-sm text-gray-700'>{step}</p>
                </div>
              ))}
            </div>

            <div className='mt-6'>
              <Button className='w-full bg-finance-green hover:bg-finance-green-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover'>
                Add to My Plan
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StrategyCard;
