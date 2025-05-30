
import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTranslation } from 'react-i18next';

const ReviewStep: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useOnboarding();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{t('onboarding.reviewComplete')}</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">{t('onboarding.personalInformation')}</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="flex justify-between py-1">
              <span className="text-gray-600">{t('onboarding.email')}:</span>
              <span className="font-medium">{profile.email}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">{t('onboarding.name')}:</span>
              <span className="font-medium">{profile.name}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">{t('onboarding.age')}:</span>
              <span className="font-medium">{profile.age}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">{t('onboarding.monthlyIncome')}:</span>
              <span className="font-medium">${profile.monthlyIncome?.toLocaleString()}</span>
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">{t('onboarding.riskProfile')}</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="flex justify-between py-1">
              <span className="text-gray-600">{t('onboarding.riskTolerance')}:</span>
              <span className="font-medium capitalize">{profile.riskProfile}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">{t('onboarding.emergencyFund')}:</span>
              <span className="font-medium">{profile.hasEmergencyFund ? t('onboarding.yes') : t('onboarding.no')}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">{t('onboarding.highInterestDebts')}:</span>
              <span className="font-medium">{profile.hasDebts ? t('onboarding.yes') : t('onboarding.no')}</span>
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">{t('onboarding.financialGoals')}</h3>
          {profile.financialGoals && profile.financialGoals.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {profile.financialGoals.map((goal) => (
                <div key={goal.id} className="py-1">
                  <p className="font-medium">{goal.name}</p>
                  <p className="text-sm text-gray-600">
                    ${goal.targetAmount.toLocaleString()} by {new Date(goal.targetDate).toLocaleDateString()} | 
                    <span className="capitalize"> {goal.priority} priority</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500">{t('onboarding.noGoalsAdded')}</div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">{t('onboarding.currentInvestments')}</h3>
          {profile.investments && profile.investments.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {profile.investments.map((investment) => (
                <div key={investment.id} className="py-1">
                  <p className="font-medium">{investment.name}</p>
                  <p className="text-sm text-gray-600">
                    {investment.type.charAt(0).toUpperCase() + investment.type.slice(1)} | 
                    ${investment.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500">{t('onboarding.noInvestmentsAdded')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
