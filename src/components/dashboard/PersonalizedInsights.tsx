import React from "react";
import { UserProfile } from "../../types/finance";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  BrainCircuit,
  BarChart3,
  PiggyBank,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface PersonalizedInsightsProps {
  userProfile: UserProfile;
  savingsProgress: number;
  expensesRatio: number;
}

const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({
  userProfile,
  savingsProgress,
  expensesRatio,
}) => {
  const { t } = useTranslation();

  // Generate personalized insights based on user data
  const getSavingsInsightData = () => {
    const name = userProfile.name?.split(" ")[0] || "there";

    if (savingsProgress === 0) {
      return {
        message: t("dashboard.savingsInsight.noData", {
          name,
          defaultValue: `Hi ${name}, it looks like you haven't recorded any savings yet. Start tracking your savings to get personalized insights!`,
        }),
        status: "no-data",
        icon: PiggyBank,
        color: "text-gray-500",
        bgColor: "bg-gray-50",
        progressColor: "bg-gray-300",
      };
    } else if (savingsProgress < 50) {
      return {
        message: t("dashboard.savingsInsight.low", {
          name,
          defaultValue: `Hi ${name}, we noticed your monthly savings are below the recommended amount. Consider creating a budget to increase your savings rate.`,
        }),
        status: "needs-improvement",
        icon: AlertCircle,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        progressColor: "bg-amber-500",
      };
    } else if (savingsProgress >= 50 && savingsProgress < 100) {
      return {
        message: t("dashboard.savingsInsight.moderate", {
          name,
          defaultValue: `Good job ${name}! You're making progress toward your savings goals, but there's still room for improvement.`,
        }),
        status: "on-track",
        icon: Target,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        progressColor: "bg-blue-500",
      };
    } else {
      return {
        message: t("dashboard.savingsInsight.high", {
          name,
          defaultValue: `Excellent work ${name}! You're exceeding your savings targets. Consider investing the extra funds to maximize your returns.`,
        }),
        status: "excellent",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        progressColor: "bg-green-500",
      };
    }
  };

  const getExpenseInsightData = () => {
    const name = userProfile.name?.split(" ")[0] || "there";

    if (expensesRatio > 70) {
      return {
        message: t("dashboard.expenseInsight.high", {
          name,
          defaultValue: `${name}, your expenses are high relative to your income. Consider identifying areas where you can cut back.`,
        }),
        status: "high",
        color: "text-red-600",
        bgColor: "bg-red-50",
        progressColor: "bg-red-500",
      };
    } else if (expensesRatio > 50) {
      return {
        message: t("dashboard.expenseInsight.moderate", {
          name,
          defaultValue: `${name}, your expenses are at a moderate level. Look for opportunities to reduce non-essential spending.`,
        }),
        status: "moderate",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        progressColor: "bg-orange-500",
      };
    } else {
      return {
        message: t("dashboard.expenseInsight.low", {
          name,
          defaultValue: `${name}, you're doing well at keeping your expenses in check. This gives you more flexibility for savings and investments.`,
        }),
        status: "low",
        color: "text-green-600",
        bgColor: "bg-green-50",
        progressColor: "bg-green-500",
      };
    }
  };

  const getInvestmentAdviceData = () => {
    const name = userProfile.name?.split(" ")[0] || "there";
    const riskProfile = userProfile.riskProfile?.toLowerCase() ?? "";
    let advice = t(`dashboard.investmentAdvice.${riskProfile}`, {
      name,
      defaultValue: `As a ${riskProfile} investor ${name}, focus on investments that match your risk tolerance.`,
    });

    if (userProfile.age && userProfile.age > 50) {
      advice += t("dashboard.investmentAdvice.ageAdjustment", {
        defaultValue: " Consider reducing risk as retirement nears.",
      });
    }

    return {
      message: advice,
      riskLevel: riskProfile,
      isAgeAdjusted: userProfile.age && userProfile.age > 50,
    };
  };

  const formatPercentage = (value: number): string => {
    return Math.round(value * 100) / 100 + "%";
  };

  const savingsData = getSavingsInsightData();
  const expenseData = getExpenseInsightData();
  const investmentData = getInvestmentAdviceData();

  return (
    <Card style={{ backgroundColor: "rgb(255, 255, 255)" }}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg font-medium'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-purple-50 border border-purple-100'>
              <BrainCircuit className='h-5 w-5 text-purple-500' />
            </div>
            {t("dashboard.personalizedInsights")}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-8'>
        {/* Savings Analysis */}
        <div
          className={`rounded-xl p-5 ${savingsData.bgColor} border border-gray-200/50 shadow-sm`}>
          <div className='flex items-center gap-3 mb-4'>
            <div
              className={`p-2.5 rounded-full bg-white shadow-md border border-gray-100`}>
              <PiggyBank className={`h-5 w-5 ${savingsData.color}`} />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t("savings.analysis.title")}
              </h3>
              <Badge
                className={`${savingsData.color} border-current bg-white/80 text-xs font-medium`}>
                {t(`dashboard.status.${savingsData.status}`, {
                  defaultValue:
                    savingsData.status === "no-data"
                      ? "No Data"
                      : "Needs Improvement", // Fallback
                })}
              </Badge>
            </div>
            <div className='text-right'>
              <div className='text-lg font-semibold text-gray-800'>
                {formatPercentage(savingsProgress)}
              </div>
              <div className='text-xs text-gray-500'>
                {t("dashboard.common.ofTarget", "of target")}
              </div>
            </div>
          </div>
          <div className='mb-4'>
            <Progress
              value={savingsProgress}
              className={`h-3 bg-white/50`}
              indicatorClassName={savingsData.progressColor}
            />
          </div>
          <p className={`text-sm ${savingsData.color} leading-relaxed`}>
            {savingsData.message}
          </p>
        </div>

        {/* Expense Analysis */}
        <div
          className={`rounded-xl p-5 ${expenseData.bgColor} border border-gray-200/50 shadow-sm`}>
          <div className='flex items-center gap-3 mb-4'>
            <div
              className={`p-2.5 rounded-full bg-white shadow-md border border-gray-100`}>
              <BarChart3 className={`h-5 w-5 ${expenseData.color}`} />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t("expenses.monthlyExpenses")}
              </h3>
              <Badge
                className={`${expenseData.color} border-current bg-white/80 text-xs font-medium`}>
                {t(`dashboard.status.${expenseData.status}`, {
                  defaultValue: expenseData.status,
                })}
              </Badge>
            </div>
            <div className='text-right'>
              <div className='text-lg font-semibold text-gray-800'>
                {formatPercentage(expensesRatio)}
              </div>
              <div className='text-xs text-gray-500'>
                {t("dashboard.common.ofIncome", "of income")}
              </div>
            </div>
          </div>
          <div className='mb-4'>
            <div className='w-full bg-white/50 rounded-full h-3 relative overflow-hidden'>
              <div
                className={`${expenseData.progressColor} h-3 rounded-full transition-all duration-300 ease-out`}
                style={{ width: `${Math.min(expensesRatio, 100)}%` }}
              />
            </div>
          </div>
          <p className={`text-sm ${expenseData.color} leading-relaxed`}>
            {expenseData.message}
          </p>
        </div>

        {/* Investment Strategy */}
        <div className='rounded-xl p-5 bg-gradient-to-r from-purple-50 to-purple-50 border border-purple-200/40 shadow-sm'>
          <div className='flex items-start gap-3 mb-4'>
            <div className='p-2.5 rounded-full bg-white shadow-md border border-gray-100'>
              <TrendingUp className='h-5 w-5 text-purple-600' />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {t("investments.strategy")}
              </h3>
              <div className='flex items-center gap-2 mt-2'>
                <Badge className='bg-purple-600 hover:bg-purple-700 text-white border-0 text-xs px-2 py-1 shadow-sm'>
                  ⭐ {t("investments.recommended")}
                </Badge>
                <Badge className='text-purple-600 border-purple-300 bg-white/60 text-xs font-medium'>
                  {t(`common.riskProfile.${investmentData.riskLevel}`)}
                </Badge>
              </div>
            </div>
          </div>
          <p className='text-sm text-purple-700 leading-relaxed bg-white/60 p-3 rounded-lg'>
            {investmentData.message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedInsights;
