import React, { useState } from "react";
import { Button } from "./ui/button";
import { UserProfile } from "../types/finance";
import RecommendationCard from "./investments/recommendations/RecommendationCard";
import DetailedView from "./investments/recommendations/DetailedView";
import { generateRecommendations } from "./investments/recommendations/RecommendationGenerator";

interface InvestmentRecommendationsProps {
  userProfile: UserProfile;
}

const InvestmentRecommendations: React.FC<InvestmentRecommendationsProps> = ({
  userProfile,
}) => {
  const [expandedRecommendation, setExpandedRecommendation] = useState<
    string | null
  >(null);

  // Get recommendations based on user profile
  const recommendations = generateRecommendations(userProfile);

  const toggleRecommendation = (id: string) => {
    if (expandedRecommendation === id) {
      setExpandedRecommendation(null);
    } else {
      setExpandedRecommendation(id);
    }
  };

  return (
    <div className='w-full animate-fade-in px-4'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold'>Investment Recommendations</h2>
        <Button
          variant='outline'
          className='text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white transition-all duration-300'>
          See All
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            isExpanded={expandedRecommendation === recommendation.id}
            onToggle={toggleRecommendation}
            renderDetailedView={(rec) => <DetailedView recommendation={rec} />}
          />
        ))}
      </div>
    </div>
  );
};

export default InvestmentRecommendations;
