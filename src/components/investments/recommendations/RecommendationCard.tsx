
import React from 'react';
import { InvestmentRecommendation } from '@/types/finance';
import { ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface RecommendationCardProps {
  recommendation: InvestmentRecommendation;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  renderDetailedView: (recommendation: InvestmentRecommendation) => React.ReactNode;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  isExpanded,
  onToggle,
  renderDetailedView
}) => {
  return (
    <Card key={recommendation.id} className="finance-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-finance-blue-light flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-finance-blue" />
            </div>
            <div>
              <h3 className="font-medium">{recommendation.title}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                  {recommendation.riskLevel}
                </span>
                <span className="text-xs text-gray-500">
                  {recommendation.expectedReturn} expected return
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(recommendation.id)}
            className="text-gray-500"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{recommendation.description}</p>
        
        {isExpanded && renderDetailedView(recommendation)}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
