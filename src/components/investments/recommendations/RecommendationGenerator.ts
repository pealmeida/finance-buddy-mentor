import { UserProfile, InvestmentRecommendation } from '../../../types/finance';

export const generateRecommendations = (userProfile: UserProfile): InvestmentRecommendation[] => {
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
  if (age && age < 40) {
    recommendations.push({
      id: '4',
      title: 'Long-Term Retirement Portfolio',
      description: 'Designed for young investors with a long time horizon before retirement.',
      riskLevel: age && age < 30 ? 'aggressive' : 'moderate',
      expectedReturn: age && age < 30 ? '8-10%' : '6-8%',
      timeHorizon: '25+ years',
      allocation: [
        { type: 'Stocks', percentage: age && age < 30 ? 80 : 65, color: '#34C759' },
        { type: 'Real Estate', percentage: 10, color: '#FF9500' },
        { type: 'Bonds', percentage: age && age < 30 ? 5 : 20, color: '#0A84FF' },
        { type: 'Alternative Investments', percentage: age && age < 30 ? 5 : 5, color: '#5E5CE6' }
      ]
    });
  } else if (age && age >= 40 && age < 55) {
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
