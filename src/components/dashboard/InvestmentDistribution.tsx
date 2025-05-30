import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { UserProfile } from '@/types/finance';
import { useTranslation } from 'react-i18next';

interface InvestmentDistributionProps {
  userProfile: UserProfile;
  investmentDistribution: Array<{
    type: string;
    percentage: number;
  }>;
}

const InvestmentDistribution: React.FC<InvestmentDistributionProps> = ({
  userProfile,
  investmentDistribution
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <p className="font-medium">{t('dashboard.investmentDistribution')}</p>
        <p className="text-xs text-gray-500">{userProfile.riskProfile} {t('dashboard.riskProfile')}</p>
      </div>
      
      <div className="flex items-center">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          {investmentDistribution.length > 0 ? (
            <div className="flex h-full">
              {investmentDistribution.map((item, index) => (
                <div 
                  key={index} 
                  className={`h-full ${
                    index === 0 ? 'bg-finance-blue' : 
                    index === 1 ? 'bg-finance-green' : 
                    index === 2 ? 'bg-finance-purple' : 
                    index === 3 ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} 
                  style={{
                    width: `${item.percentage}%`
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-300 h-full w-full"></div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        {investmentDistribution.map((item, index) => (
          <span key={index}>
            {item.type}: {item.percentage}%
          </span>
        ))}
      </div>
      
      {userProfile.investments.length === 0 && (
        <p className="text-xs text-gray-500 mt-2 flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
          {t('dashboard.recommendedAllocation')}
        </p>
      )}
    </div>
  );
};

export default InvestmentDistribution;
