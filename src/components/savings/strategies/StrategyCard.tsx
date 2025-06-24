import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Check,
  ChevronDown,
  PiggyBank,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Target,
  BookOpen,
  Calculator,
  Clock,
} from "lucide-react";
import { SavingStrategy } from "../../../types/finance";
import { AccordionContent, AccordionTrigger } from "../../ui/accordion";
import { Progress } from "../../ui/progress";
import { useIsMobile } from "../../../hooks/use-mobile";
import { formatNumber } from "../../../lib/utils";

interface StrategyCardProps {
  strategy: SavingStrategy;
  iconComponent: React.ReactNode;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  iconComponent,
}) => {
  const { t } = useTranslation();

  const [implementationProgress, setImplementationProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const isMobile = useIsMobile();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "hard":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTimeFrameColor = (timeFrame: string) => {
    switch (timeFrame) {
      case "immediate":
        return "bg-finance-green-light text-finance-green-dark border-finance-green";
      case "short-term":
        return "bg-finance-blue-light text-finance-blue-dark border-finance-blue";
      case "long-term":
        return "bg-finance-purple-light text-finance-purple-dark border-finance-purple";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <CheckCircle2 className='h-3.5 w-3.5 text-green-600' />;
      case "medium":
        return <AlertCircle className='h-3.5 w-3.5 text-blue-600' />;
      case "hard":
        return <Target className='h-3.5 w-3.5 text-purple-600' />;
      default:
        return <AlertCircle className='h-3.5 w-3.5 text-gray-600' />;
    }
  };

  const getTimeFrameDetails = (timeFrame: string) => {
    switch (timeFrame) {
      case "immediate":
        return t("savings.strategies.timeFrames.immediate");
      case "short-term":
        return t("savings.strategies.timeFrames.shortTerm");
      case "long-term":
        return t("savings.strategies.timeFrames.longTerm");
      default:
        return t("savings.strategies.timeFrames.default");
    }
  };

  const toggleStepCompletion = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(completedSteps.filter((i) => i !== stepIndex));
    } else {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const progressPercentage =
    (completedSteps.length / strategy.steps.length) * 100;

  const getTipsForStrategy = (strategyId: string): string[] => {
    const tipsMap: { [key: string]: string } = {
      "1": "budgetRule",
      "2": "subscriptions",
      "3": "emergencyFund",
      "4": "debtPayment",
      "5": "automatedSavings",
      "6": "mealPlanning",
      "7": "energyEfficiency",
    };

    const tipKey = tipsMap[strategyId];
    if (tipKey) {
      try {
        const tips = t(`savings.strategies.tips.${tipKey}`, {
          returnObjects: true,
        });
        // Ensure we always return an array
        return Array.isArray(tips) ? tips : [];
      } catch (error) {
        console.warn(`Failed to load tips for strategy ${strategyId}:`, error);
        return [];
      }
    }
    return [];
  };

  return (
    <Card className='finance-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-finance-green/20'>
      <AccordionTrigger className='hover:no-underline p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-finance-green focus-visible:ring-offset-2 rounded-lg [&>svg]:hidden'>
        <CardContent className={`${isMobile ? "p-4" : "p-6"} w-full`}>
          {/* Mobile Layout */}
          {isMobile ? (
            <div className='space-y-5'>
              {/* Header Section */}
              <div className='flex items-center gap-4'>
                <div className='h-12 w-12 rounded-full bg-finance-green-light flex items-center justify-center flex-shrink-0 shadow-sm'>
                  {iconComponent}
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-base text-left leading-snug mb-2 text-gray-900'>
                    {strategy.title}
                  </h3>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='secondary'
                      className={`${getDifficultyColor(
                        strategy.difficulty
                      )} flex items-center gap-1 text-xs px-2.5 py-1 border font-medium`}>
                      {getDifficultyIcon(strategy.difficulty)}
                      {t(
                        `savings.strategies.difficulty.${strategy.difficulty}`
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className='text-gray-500 text-left'>{strategy.description}</p>

              {/* Savings Amount Section */}
              <div className='flex items-center justify-between bg-gradient-to-r from-finance-green-light/30 to-finance-blue-light/30 rounded-lg p-3 border border-finance-green-light'>
                <div className='flex items-center gap-2'>
                  <PiggyBank className='h-5 w-5 text-finance-green' />
                  <span className='text-lg font-bold text-finance-green'>
                    ${formatNumber(strategy.potentialSaving, 2)}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600 font-medium'>
                    {t("savings.strategies.potentialMonthly")}
                  </span>
                  <ChevronDown className='h-4 w-4 text-gray-500 transition-transform duration-200' />
                </div>
              </div>
            </div>
          ) : (
            /* Desktop Layout */
            <div className='space-y-4'>
              <div className='flex justify-between items-start'>
                <div className='flex items-start gap-4 flex-1'>
                  <div className='h-12 w-12 rounded-full bg-finance-green-light flex items-center justify-center flex-shrink-0'>
                    {iconComponent}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-lg text-left leading-tight mb-3'>
                      {strategy.title}
                    </h3>
                    <div className='flex items-center gap-3'>
                      <Badge
                        variant='secondary'
                        className={`${getDifficultyColor(
                          strategy.difficulty
                        )} flex items-center gap-1.5 px-3 py-1.5 border`}>
                        {getDifficultyIcon(strategy.difficulty)}
                        {t(
                          `savings.strategies.difficulty.${strategy.difficulty}`
                        )}
                      </Badge>
                      <Badge
                        variant='secondary'
                        className={`${getTimeFrameColor(
                          strategy.timeFrame
                        )} px-3 py-1.5 border`}>
                        {t(
                          `savings.strategies.timeFrame.${
                            strategy.timeFrame === "short-term"
                              ? "shortTerm"
                              : strategy.timeFrame === "long-term"
                              ? "longTerm"
                              : strategy.timeFrame
                          }`
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className='text-right ml-4'>
                  <div className='flex items-center gap-2 justify-end'>
                    <PiggyBank className='h-5 w-5 text-finance-green' />
                    <span className='text-xl font-bold text-finance-green'>
                      ${formatNumber(strategy.potentialSaving, 2)}
                    </span>
                    <ChevronDown className='h-5 w-5 text-gray-500 transition-transform duration-200 ml-2' />
                  </div>
                  <p className='text-sm text-gray-500 mt-1'>
                    {t("savings.strategies.potentialMonthly")}
                  </p>
                </div>
              </div>

              <p className='text-gray-500 text-left'>{strategy.description}</p>
            </div>
          )}
        </CardContent>
      </AccordionTrigger>

      <AccordionContent className={`${isMobile ? "px-4 pb-4" : "px-6 pb-6"}`}>
        <div className='space-y-6'>
          {/* Strategy Details */}
          <div className='bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-100'>
            <div className='flex items-center gap-2 mb-3'>
              <Clock className='h-5 w-5 text-blue-600' />
              <h4 className='font-semibold text-gray-800'>
                {t("savings.strategies.timelineDifficulty")}
              </h4>
            </div>
            <p
              className={`text-gray-700 ${
                isMobile ? "text-sm" : "text-sm"
              } leading-relaxed`}>
              {getTimeFrameDetails(strategy.timeFrame)}
            </p>
          </div>

          {/* Implementation Steps with Progress */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h4 className='font-semibold text-gray-800 flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5 text-green-600' />
                {t("savings.strategies.implementationSteps")}
              </h4>
              <div className='text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full'>
                {completedSteps.length} {t("savings.strategies.of")}{" "}
                {strategy.steps.length} {t("savings.strategies.completed")}
              </div>
            </div>

            <Progress value={progressPercentage} className='mb-6 h-3' />

            <div className='space-y-3'>
              {strategy.steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-200 cursor-pointer border-2 ${
                    completedSteps.includes(index)
                      ? "bg-green-50 border-green-200 shadow-sm"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300"
                  } ${isMobile ? "min-h-[60px]" : ""}`}
                  onClick={() => toggleStepCompletion(index)}>
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200 ${
                      completedSteps.includes(index)
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-white border-2 border-gray-300 hover:border-gray-400"
                    }`}>
                    {completedSteps.includes(index) ? (
                      <Check className='h-4 w-4' />
                    ) : (
                      <span className='text-sm font-medium'>{index + 1}</span>
                    )}
                  </div>
                  <p
                    className={`${
                      isMobile ? "text-sm" : "text-sm"
                    } leading-relaxed ${
                      completedSteps.includes(index)
                        ? "text-gray-700 line-through"
                        : "text-gray-700"
                    }`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          {getTipsForStrategy(strategy.id).length > 0 && (
            <div className='bg-yellow-50 rounded-xl p-4 border border-yellow-200'>
              <div className='flex items-center gap-2 mb-3'>
                <BookOpen className='h-5 w-5 text-yellow-600' />
                <h4 className='font-semibold text-gray-800'>
                  {t("savings.strategies.proTips")}
                </h4>
              </div>
              <ul className='space-y-3'>
                {getTipsForStrategy(strategy.id).map((tip, index) => (
                  <li
                    key={index}
                    className='flex items-start gap-3 text-sm text-gray-700 leading-relaxed'>
                    <div className='h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0'></div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Potential Impact Calculator */}
          <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200'>
            <div className='flex items-center gap-2 mb-4'>
              <Calculator className='h-5 w-5 text-green-600' />
              <h4 className='font-semibold text-gray-800'>
                {t("savings.strategies.potentialImpact")}
              </h4>
            </div>
            <div
              className={`grid ${
                isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
              } text-sm`}>
              <div
                className={`${
                  isMobile ? "text-center" : ""
                } bg-white rounded-lg p-3 border border-green-100`}>
                <p className='text-gray-600 mb-1'>
                  {t("savings.strategies.monthlySavingsLabel")}
                </p>
                <p className='font-bold text-green-600 text-lg'>
                  ${formatNumber(strategy.potentialSaving, 2)}
                </p>
              </div>
              <div
                className={`${
                  isMobile ? "text-center" : ""
                } bg-white rounded-lg p-3 border border-blue-100`}>
                <p className='text-gray-600 mb-1'>
                  {t("savings.strategies.annualSavings")}
                </p>
                <p className='font-bold text-blue-600 text-lg'>
                  ${formatNumber(strategy.potentialSaving * 12, 2)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`grid ${
              isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
            } mt-6`}>
            <Button
              className='bg-finance-green hover:bg-finance-green-dark text-white transition-all duration-300 shadow-lg hover:shadow-xl h-12 text-base font-medium'
              size={isMobile ? "lg" : "default"}>
              <TrendingUp className='h-4 w-4 mr-2' />
              {t("savings.strategies.startStrategy")}
            </Button>
            <Button
              variant='outline'
              className='border-2 border-finance-blue text-finance-blue hover:bg-finance-blue hover:text-white transition-all duration-300 h-12 text-base font-medium'
              size={isMobile ? "lg" : "default"}>
              <Calendar className='h-4 w-4 mr-2' />
              {t("savings.strategies.scheduleReminder")}
            </Button>
          </div>
        </div>
      </AccordionContent>
    </Card>
  );
};

export default StrategyCard;
