import React, { useState, useCallback } from "react";
import { CheckCircle, Circle, ChevronUp, ChevronDown, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../../types/finance";

interface OnboardingChecklistProps {
  userProfile: UserProfile;
  isMobile: boolean;
}

interface ChecklistItem {
  id: string;
  labelKey: string;
  completed: boolean;
  required: boolean;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  userProfile,
  isMobile,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const hasMonthlyExpensesData = useCallback((): boolean => {
    if (
      !userProfile.monthlyExpenses ||
      !userProfile.monthlyExpenses.data ||
      userProfile.monthlyExpenses.data.length === 0
    ) {
      return false;
    }
    return userProfile.monthlyExpenses.data.some((item) => item.amount > 0);
  }, [userProfile.monthlyExpenses]);

  const hasMonthlySavingsData = useCallback((): boolean => {
    if (
      !userProfile.monthlySavings ||
      !userProfile.monthlySavings.data ||
      userProfile.monthlySavings.data.length === 0
    ) {
      return false;
    }
    return userProfile.monthlySavings.data.some((item) => item.amount > 0);
  }, [userProfile.monthlySavings]);

  const isChecklistItemCompleted = useCallback(
    (itemId: string): boolean => {
      switch (itemId) {
        case "personal_info":
          return (
            !!userProfile.name &&
            !!userProfile.age &&
            !!userProfile.monthlyIncome
          );
        case "risk_profile":
          return !!userProfile.riskProfile;
        case "monthly_expenses":
          return hasMonthlyExpensesData();
        case "monthly_savings":
          return hasMonthlySavingsData();
        case "financial_goals":
          return (
            !!userProfile.financialGoals &&
            userProfile.financialGoals.length > 0
          );
        case "investments":
          return (
            !!userProfile.investments && userProfile.investments.length > 0
          );
        default:
          return false;
      }
    },
    [userProfile, hasMonthlyExpensesData, hasMonthlySavingsData]
  );

  const checklistItems: ChecklistItem[] = [
    {
      id: "personal_info",
      labelKey: "onboarding.personalInfoComplete",
      completed: isChecklistItemCompleted("personal_info"),
      required: true,
    },
    {
      id: "risk_profile",
      labelKey: "onboarding.riskProfileSet",
      completed: isChecklistItemCompleted("risk_profile"),
      required: true,
    },
    {
      id: "monthly_expenses",
      labelKey: "onboarding.monthlyExpensesSet",
      completed: isChecklistItemCompleted("monthly_expenses"),
      required: false,
    },
    {
      id: "monthly_savings",
      labelKey: "onboarding.monthlySavingsSet",
      completed: isChecklistItemCompleted("monthly_savings"),
      required: false,
    },
    {
      id: "financial_goals",
      labelKey: "onboarding.financialGoalsAdded",
      completed: isChecklistItemCompleted("financial_goals"),
      required: false,
    },
    {
      id: "investments",
      labelKey: "onboarding.investmentsAdded",
      completed: isChecklistItemCompleted("investments"),
      required: false,
    },
  ];

  const completedItems = checklistItems.filter((item) => item.completed).length;
  const totalItems = checklistItems.length;
  const progressPercentage = Math.round((completedItems / totalItems) * 100);

  const handleCompleteProfile = () => {
    navigate("/full-profile");
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) {
    return null;
  }

  const bottomPositionClass = isMobile ? "bottom-20" : "bottom-4";

  return (
    <div className={`fixed ${bottomPositionClass} left-4 z-50 animate-fade-in`}>
      <Card
        className='shadow-lg border-finance-blue/20 transition-all duration-300'
        style={{ width: "252px", backgroundColor: "rgb(255, 255, 255)" }}>
        {isExpanded ? (
          <>
            <CardHeader
              className='pb-3'
              onClick={handleToggleExpanded}
              style={{ cursor: "pointer" }}
              role='button'
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggleExpanded();
                }
              }}
              aria-label={t("dashboard.onboardingProgress")}>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg text-finance-blue'>
                  {t("dashboard.onboardingProgress")}
                </CardTitle>
                <div className='flex gap-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleDismiss}
                    className='h-6 w-6 p-0'
                    aria-label='Fechar checklist'>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </div>
              <div className='space-y-2'>
                <Progress
                  value={progressPercentage}
                  className='h-2'
                  aria-label={`Progresso: ${progressPercentage}%`}
                />
                <p className='text-sm text-gray-600'>
                  {completedItems}/{totalItems} {t("dashboard.completed")} (
                  {progressPercentage}%)
                </p>
              </div>
            </CardHeader>
            <CardContent
              className='space-y-3'
              onClick={handleToggleExpanded}
              style={{ cursor: "pointer" }}
              role='button'
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggleExpanded();
                }
              }}>
              {checklistItems.map((item) => (
                <div key={item.id} className='flex items-center gap-3'>
                  {item.completed ? (
                    <CheckCircle className='h-5 w-5 text-finance-green' />
                  ) : (
                    <Circle className='h-5 w-5 text-gray-300' />
                  )}
                  <span
                    className={`text-sm ${
                      item.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-700"
                    }`}>
                    {t(item.labelKey)}
                    {item.required && !item.completed && (
                      <span className='text-red-500 ml-1'>*</span>
                    )}
                  </span>
                </div>
              ))}
              <div className='pt-2 border-t'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompleteProfile();
                  }}>
                  {t("dashboard.completeProfile")}
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent
            className='p-4'
            onClick={handleToggleExpanded}
            style={{ cursor: "pointer" }}
            role='button'
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggleExpanded();
              }
            }}
            aria-label='Expandir checklist de progresso'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <h4 className='text-sm font-medium text-finance-blue mb-2'>
                  {t("dashboard.setupProgress")}
                </h4>
                <Progress
                  value={progressPercentage}
                  className='h-2 mb-1'
                  aria-label={`Progresso: ${progressPercentage}%`}
                />
                <p className='text-xs text-gray-600'>
                  {completedItems}/{totalItems} {t("dashboard.completed")} (
                  {progressPercentage}%)
                </p>
              </div>
              <div className='flex gap-1 ml-3'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleDismiss}
                  className='h-6 w-6 p-0'
                  aria-label='Fechar checklist'>
                  <X className='h-4 w-4' />
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
