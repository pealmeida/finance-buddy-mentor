
import React, { useState } from 'react';
import { ArrowRight, BarChart3, ChevronDown, ChevronUp, Info, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile, InvestmentRecommendation, AllocationItem } from '@/types/finance';
import { 
  PieChart as RechartsChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend 
} from 'recharts';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface InvestmentRecommendationsProps {
  userProfile: UserProfile;
}

const InvestmentRecommendations: React.FC<InvestmentRecommendationsProps> = ({ userProfile }) => {
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  // Generate investment recommendations based on user profile
  const getRecommendations = (): InvestmentRecommendation[] => {
    const { riskProfile, age } = userProfile;
    
    const recommendations: InvestmentRecommendation[] = [];
    
    if (riskProfile === 'conservative') {
      recommendations.push({
        id: '1',
        title: 'Income-Focused Portfolio',
        description: 'A conservative allocation focused on capital preservation and income generation.',
        riskLevel: 'conservative',
        expectedReturn: '4-6%',
        timeHorizon: '3-5 years',
        allocation: [
          { type: 'Bonds', percentage: 60, color: '#0A84FF' },
          { type: 'Stocks', percentage: 20, color: '#34C759' },
          { type: 'Cash', percentage: 15, color: '#5E5CE6' },
          { type: 'Real Estate', percentage: 5, color: '#FF9500' }
        ]
      });
    } else if (riskProfile === 'moderate') {
      recommendations.push({
        id: '2',
        title: 'Balanced Growth Portfolio',
        description: 'A balanced approach seeking long-term growth with moderate volatility.',
        riskLevel: 'moderate',
        expectedReturn: '6-8%',
        timeHorizon: '5-10 years',
        allocation: [
          { type: 'Stocks', percentage: 50, color: '#34C759' },
          { type: 'Bonds', percentage: 30, color: '#0A84FF' },
          { type: 'Real Estate', percentage: 15, color: '#FF9500' },
          { type: 'Cash', percentage: 5, color: '#5E5CE6' }
        ]
      });
    } else if (riskProfile === 'aggressive') {
      recommendations.push({
        id: '3',
        title: 'Growth-Oriented Portfolio',
        description: 'An aggressive approach focused on maximum long-term growth potential.',
        riskLevel: 'aggressive',
        expectedReturn: '8-10%+',
        timeHorizon: '10+ years',
        allocation: [
          { type: 'Stocks', percentage: 70, color: '#34C759' },
          { type: 'Real Estate', percentage: 15, color: '#FF9500' },
          { type: 'Alternative Investments', percentage: 10, color: '#5E5CE6' },
          { type: 'Bonds', percentage: 5, color: '#0A84FF' }
        ]
      });
    }
    
    // Add retirement-focused recommendation based on age
    if (age < 40) {
      recommendations.push({
        id: '4',
        title: 'Long-Term Retirement Portfolio',
        description: 'Designed for young investors with a long time horizon before retirement.',
        riskLevel: age < 30 ? 'aggressive' : 'moderate',
        expectedReturn: age < 30 ? '8-10%' : '6-8%',
        timeHorizon: '25+ years',
        allocation: [
          { type: 'Stocks', percentage: age < 30 ? 80 : 65, color: '#34C759' },
          { type: 'Real Estate', percentage: 10, color: '#FF9500' },
          { type: 'Bonds', percentage: age < 30 ? 5 : 20, color: '#0A84FF' },
          { type: 'Alternative Investments', percentage: age < 30 ? 5 : 5, color: '#5E5CE6' }
        ]
      });
    } else if (age >= 40 && age < 55) {
      recommendations.push({
        id: '5',
        title: 'Mid-Career Retirement Portfolio',
        description: 'Balanced approach for mid-career investors building retirement savings.',
        riskLevel: 'moderate',
        expectedReturn: '6-8%',
        timeHorizon: '15-25 years',
        allocation: [
          { type: 'Stocks', percentage: 60, color: '#34C759' },
          { type: 'Bonds', percentage: 25, color: '#0A84FF' },
          { type: 'Real Estate', percentage: 10, color: '#FF9500' },
          { type: 'Cash', percentage: 5, color: '#5E5CE6' }
        ]
      });
    } else {
      recommendations.push({
        id: '6',
        title: 'Pre-Retirement Portfolio',
        description: 'Designed to balance growth with capital preservation as retirement approaches.',
        riskLevel: 'conservative',
        expectedReturn: '4-6%',
        timeHorizon: '5-15 years',
        allocation: [
          { type: 'Bonds', percentage: 50, color: '#0A84FF' },
          { type: 'Stocks', percentage: 30, color: '#34C759' },
          { type: 'Real Estate', percentage: 10, color: '#FF9500' },
          { type: 'Cash', percentage: 10, color: '#5E5CE6' }
        ]
      });
    }
    
    // If user has no debt and has emergency fund, add more aggressive option
    if (!userProfile.hasDebts && userProfile.hasEmergencyFund) {
      recommendations.push({
        id: '7',
        title: 'Wealth Acceleration Portfolio',
        description: 'For financially stable investors looking to accelerate wealth building.',
        riskLevel: 'aggressive',
        expectedReturn: '9-12%',
        timeHorizon: '10+ years',
        allocation: [
          { type: 'Growth Stocks', percentage: 65, color: '#34C759' },
          { type: 'Real Estate', percentage: 15, color: '#FF9500' },
          { type: 'Alternative Investments', percentage: 15, color: '#5E5CE6' },
          { type: 'Bonds', percentage: 5, color: '#0A84FF' }
        ]
      });
    }
    
    return recommendations;
  };

  const recommendations = getRecommendations();

  const toggleRecommendation = (id: string) => {
    if (expandedRecommendation === id) {
      setExpandedRecommendation(null);
    } else {
      setExpandedRecommendation(id);
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent * 100 > 5 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Investment Recommendations</h2>
        <Button variant="outline" className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white transition-all duration-300">
          See All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((recommendation) => (
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
                  onClick={() => toggleRecommendation(recommendation.id)}
                  className="text-gray-500"
                >
                  {expandedRecommendation === recommendation.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{recommendation.description}</p>
              
              {expandedRecommendation === recommendation.id && (
                <div className="mt-6 animate-scale-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsChart>
                          <Pie
                            data={recommendation.allocation}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="percentage"
                          >
                            {recommendation.allocation.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: any) => [`${value}%`, 'Allocation']}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend />
                        </RechartsChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Allocation Breakdown</h4>
                        <div className="space-y-2">
                          {recommendation.allocation.map((item) => (
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
                            <span className="font-medium capitalize">{recommendation.riskLevel}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Expected Return:</span>
                            <span className="font-medium">{recommendation.expectedReturn}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Time Horizon:</span>
                            <span className="font-medium">{recommendation.timeHorizon}</span>
                          </div>
                        </div>
                      </div>
                      
                      <TooltipProvider>
                        <UITooltip>
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
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover flex items-center gap-2">
                      Get Detailed Plan
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvestmentRecommendations;
