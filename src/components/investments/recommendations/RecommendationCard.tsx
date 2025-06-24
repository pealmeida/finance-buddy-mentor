import React from "react";
import { InvestmentRecommendation } from "../../../types/finance";
import { ChevronDown, BarChart3 } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import {
  AccordionTrigger,
  AccordionContent,
} from "../../../components/ui/accordion";
import { Badge } from "../../../components/ui/badge";

interface RecommendationCardProps {
  recommendation: InvestmentRecommendation;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  renderDetailedView: (
    recommendation: InvestmentRecommendation
  ) => React.ReactNode;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  renderDetailedView,
}) => {
  const getRiskLevelBadgeStyle = (riskLevel: string) => {
    switch (riskLevel) {
      case "conservative":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "aggressive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className='finance-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-finance-blue/20'>
      <AccordionTrigger className='hover:no-underline p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-finance-blue focus-visible:ring-offset-2 rounded-lg [&>svg]:hidden'>
        <CardContent className='p-4 w-full'>
          {/* Mobile Layout */}
          <div className='space-y-5'>
            {/* Header */}
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-full bg-finance-blue-light flex items-center justify-center flex-shrink-0 shadow-sm'>
                <BarChart3 className='h-5 w-5 text-finance-blue' />
              </div>

              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-base text-left leading-snug mb-2 text-gray-900'>
                  {recommendation.title}
                </h3>
                <div className='flex items-center gap-2'>
                  <Badge
                    className={`${getRiskLevelBadgeStyle(
                      recommendation.riskLevel
                    )} flex items-center gap-1 text-xs px-2.5 py-1 border font-medium`}>
                    {recommendation.riskLevel}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className='text-gray-500 text-left'>
              {recommendation.description}
            </p>

            {/* Expected Return Section */}
            <div className='flex items-center justify-between bg-gradient-to-r from-finance-blue-light/30 to-finance-green-light/30 rounded-lg p-3 border border-finance-blue-light'>
              <div className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5 text-finance-blue' />
                <span className='text-lg font-bold text-finance-blue'>
                  {recommendation.expectedReturn}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600 font-medium'>
                  expected return
                </span>
                <ChevronDown className='h-4 w-4 text-gray-500 transition-transform duration-200' />
              </div>
            </div>
          </div>
        </CardContent>
      </AccordionTrigger>

      <AccordionContent>
        <CardContent className='px-4 pb-4 pt-0'>
          <div className='border-t border-gray-100 pt-4'>
            {renderDetailedView(recommendation)}
          </div>
        </CardContent>
      </AccordionContent>
    </Card>
  );
};

export default RecommendationCard;
