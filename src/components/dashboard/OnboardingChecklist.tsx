
import React, { useState } from 'react';
import { CheckCircle, Circle, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '@/types/finance';

interface OnboardingChecklistProps {
  userProfile: UserProfile;
}

interface ChecklistItem {
  id: string;
  labelKey: string;
  completed: boolean;
  required: boolean;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ userProfile }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Calculate checklist items based on user profile
  const checklistItems: ChecklistItem[] = [
    {
      id: 'personal_info',
      labelKey: 'onboarding.personalInfoComplete',
      completed: !!(userProfile.name && userProfile.age && userProfile.monthlyIncome),
      required: true
    },
    {
      id: 'risk_profile',
      labelKey: 'onboarding.riskProfileSet',
      completed: !!userProfile.riskProfile,
      required: true
    },
    {
      id: 'emergency_fund',
      labelKey: 'onboarding.emergencyFundStatus',
      completed: userProfile.hasEmergencyFund !== undefined,
      required: false
    },
    {
      id: 'financial_goals',
      labelKey: 'onboarding.financialGoalsAdded',
      completed: !!(userProfile.financialGoals && userProfile.financialGoals.length > 0),
      required: false
    },
    {
      id: 'investments',
      labelKey: 'onboarding.investmentsAdded',
      completed: !!(userProfile.investments && userProfile.investments.length > 0),
      required: false
    },
    {
      id: 'monthly_expenses',
      labelKey: 'onboarding.monthlyExpensesSet',
      completed: !!userProfile.monthlyExpenses,
      required: false
    },
    {
      id: 'monthly_savings',
      labelKey: 'onboarding.monthlySavingsSet',
      completed: !!userProfile.monthlySavings,
      required: false
    }
  ];

  const completedItems = checklistItems.filter(item => item.completed).length;
  const totalItems = checklistItems.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  // Don't show if fully completed
  if (completedItems === totalItems) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
      <Card className="w-80 shadow-lg border-finance-blue/20 transition-all duration-300">
        {isExpanded ? (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-finance-blue">
                  {t('dashboard.onboardingProgress')}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-gray-600">
                  {completedItems}/{totalItems} {t('dashboard.completed')} ({Math.round(progressPercentage)}%)
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-finance-green" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                  <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                    {t(item.labelKey)}
                    {item.required && !item.completed && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white"
                  onClick={() => window.location.href = '/profile'}
                >
                  {t('dashboard.completeProfile')}
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-finance-blue mb-2">
                  {t('dashboard.setupProgress')}
                </h4>
                <Progress value={progressPercentage} className="h-2 mb-1" />
                <p className="text-xs text-gray-600">
                  {completedItems}/{totalItems} {t('dashboard.completed')} ({Math.round(progressPercentage)}%)
                </p>
              </div>
              <div className="flex gap-1 ml-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="h-6 w-6 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default OnboardingChecklist;
