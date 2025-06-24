import React from "react";
import { Shield } from "lucide-react";
import { Progress } from "../ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";
import { formatNumber } from "../../lib/utils";
import { useIsMobile } from "../../hooks/use-mobile";

interface EmergencyFundProps {
  currentEmergencyFund: number;
  monthlyIncome: number;
  emergencyFundPercentage: number;
  hasEmergencyFundData: boolean | undefined;
  monthlyExpenses?: number;
  displaySettings?: {
    showCurrencySymbols?: boolean;
    showPercentages?: boolean;
    showRecommendations?: boolean;
  };
}

const EmergencyFund: React.FC<EmergencyFundProps> = ({
  currentEmergencyFund,
  monthlyIncome,
  emergencyFundPercentage,
  hasEmergencyFundData,
  monthlyExpenses,
  displaySettings,
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const isMobile = useIsMobile();

  // Calculate emergency fund target based on income (3-6 months of income is recommended)
  // We'll use 6 months of income as the standard recommendation
  const emergencyFundTarget = monthlyIncome * 6;

  // Alternative calculation using expenses if available (6 months of expenses)
  const expenseBasedTarget = monthlyExpenses ? monthlyExpenses * 6 : 0;

  // Use the lower of the two targets (more conservative approach)
  const recommendedTarget =
    expenseBasedTarget > 0
      ? Math.min(emergencyFundTarget, expenseBasedTarget)
      : emergencyFundTarget;

  // Calculate progress based on the recommended target
  const actualProgress =
    recommendedTarget > 0
      ? Math.min((currentEmergencyFund / recommendedTarget) * 100, 100)
      : 0;

  // Determine the basis for recommendation text
  const isIncomeBasedRecommendation =
    !monthlyExpenses || emergencyFundTarget <= expenseBasedTarget;
  const recommendationMonths = 6;

  const content = (
    <>
      {displaySettings?.showCurrencySymbols !== false ? (
        <>
          {formatCurrency(currentEmergencyFund)} {t("common.of")}{" "}
          {formatCurrency(recommendedTarget)}
        </>
      ) : (
        <>
          {formatNumber(currentEmergencyFund, 2)} {t("common.of")}{" "}
          {formatNumber(recommendedTarget, 2)}
        </>
      )}
    </>
  );

  return (
    <>
      {hasEmergencyFundData ? (
        isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <div className='group p-4 rounded-lg transition-all duration-500 ease-out hover:bg-gray-50/50 hover:shadow-sm hover:border hover:border-gray-100/50 cursor-pointer'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center space-x-2'>
                    <Shield className='h-4 w-4 text-finance-blue transition-transform duration-500 ease-out group-hover:scale-105' />
                    <p className='font-medium transition-colors duration-500 ease-out group-hover:text-finance-blue/80'>
                      {t("dashboard.emergencyFund", "Emergency Fund")}
                    </p>
                  </div>
                </div>
                <Progress
                  value={actualProgress}
                  className='h-2 progress-animation'
                />
                <div className='mt-1 flex items-center justify-between'>
                  <p className='text-xs text-gray-500 transition-colors duration-500 ease-out group-hover:text-gray-600'>
                    {actualProgress < 100
                      ? displaySettings?.showPercentages !== false
                        ? `${Math.round(actualProgress)}% ${t(
                            "dashboard.emergencyFundProgressShort",
                            "of target"
                          )}`
                        : t(
                            "dashboard.emergencyFundProgress",
                            "of 6 months target"
                          )
                      : t(
                          "dashboard.emergencyFundTarget",
                          "Emergency fund complete!"
                        )}
                  </p>
                  {displaySettings?.showRecommendations !== false && (
                    <p className='text-xs text-finance-blue transition-all duration-500 ease-out group-hover:text-finance-blue/90 group-hover:transform group-hover:translate-y-[-1px]'>
                      {isIncomeBasedRecommendation
                        ? t(
                            "dashboard.emergencyFundRecommendedIncome",
                            "Recommended: 6 months of income"
                          )
                        : t(
                            "dashboard.emergencyFundRecommendedExpenses",
                            "Recommended: 6 months of expenses"
                          )}
                    </p>
                  )}
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className='text-center'>
                <Shield className='h-6 w-6 text-finance-blue mx-auto mb-2' />
                <DrawerTitle>
                  {t(
                    "dashboard.emergencyFundDetails",
                    "Emergency Fund Details"
                  )}
                </DrawerTitle>
                <div className='text-center text-sm text-muted-foreground'>
                  <div className='text-base font-semibold mb-1'>{content}</div>
                  <div className='text-sm text-gray-600'>
                    {t("dashboard.currentProgress", "Current Progress:")}{" "}
                    {Math.round(actualProgress)}%
                  </div>
                  {displaySettings?.showRecommendations !== false && (
                    <div className='text-sm text-gray-600 mt-1'>
                      {isIncomeBasedRecommendation
                        ? t(
                            "dashboard.emergencyFundRecommendedIncomeFull",
                            `Recommended: ${recommendationMonths} months of income`,
                            { months: recommendationMonths }
                          )
                        : t(
                            "dashboard.emergencyFundRecommendedExpensesFull",
                            `Recommended: ${recommendationMonths} months of expenses`,
                            { months: recommendationMonths }
                          )}
                    </div>
                  )}
                  {actualProgress < 100 && (
                    <div className='text-sm text-finance-blue mt-2'>
                      {t(
                        "common.emergencyFundCallToAction",
                        "Keep saving to reach your goal!"
                      )}
                    </div>
                  )}
                </div>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <button className='w-full py-2 bg-finance-blue text-white rounded-md'>
                    {t("common.close", "Close")}
                  </button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <div className='group p-4 rounded-lg transition-all duration-500 ease-out hover:bg-gray-50/50 hover:shadow-sm hover:border hover:border-gray-100/50 cursor-pointer'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center space-x-2'>
                    <Shield className='h-4 w-4 text-finance-blue transition-transform duration-500 ease-out group-hover:scale-105' />
                    <p className='font-medium transition-colors duration-500 ease-out group-hover:text-finance-blue/80'>
                      {t("dashboard.emergencyFund", "Emergency Fund")}
                    </p>
                  </div>
                </div>
                <Progress
                  value={actualProgress}
                  className='h-2 progress-animation'
                />
                <div className='mt-1 flex items-center justify-between'>
                  <p className='text-xs text-gray-500 transition-colors duration-500 ease-out group-hover:text-gray-600'>
                    {actualProgress < 100
                      ? displaySettings?.showPercentages !== false
                        ? `${Math.round(actualProgress)}% ${t(
                            "dashboard.emergencyFundProgressShort",
                            "of target"
                          )}`
                        : t(
                            "dashboard.emergencyFundProgress",
                            "of 6 months target"
                          )
                      : t(
                          "dashboard.emergencyFundTarget",
                          "Emergency fund complete!"
                        )}
                  </p>
                  {displaySettings?.showRecommendations !== false && (
                    <p className='text-xs text-finance-blue transition-all duration-500 ease-out group-hover:text-finance-blue/90 group-hover:transform group-hover:translate-y-[-1px]'>
                      {isIncomeBasedRecommendation
                        ? t(
                            "dashboard.emergencyFundRecommendedIncome",
                            "Recommended: 6 months of income"
                          )
                        : t(
                            "dashboard.emergencyFundRecommendedExpenses",
                            "Recommended: 6 months of expenses"
                          )}
                    </p>
                  )}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className='max-w-md'>
              <DialogHeader className='text-center'>
                <Shield className='h-8 w-8 text-finance-blue mx-auto mb-3' />
                <DialogTitle className='text-center'>
                  {t(
                    "dashboard.emergencyFundDetails",
                    "Emergency Fund Details"
                  )}
                </DialogTitle>
                <DialogDescription className='text-center'>
                  {t(
                    "dashboard.emergencyFundDetailsDescription",
                    "View your emergency fund progress and recommendations for financial security."
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className='text-center space-y-4'>
                <div className='text-lg font-semibold'>{content}</div>
                <div className='text-sm text-gray-600'>
                  {t("dashboard.currentProgress", "Current Progress:")}{" "}
                  {Math.round(actualProgress)}%
                </div>
                {displaySettings?.showRecommendations !== false && (
                  <div className='text-sm text-gray-600'>
                    {isIncomeBasedRecommendation
                      ? t(
                          "dashboard.emergencyFundRecommendedIncomeFull",
                          `Recommended: ${recommendationMonths} months of income`,
                          { months: recommendationMonths }
                        )
                      : t(
                          "dashboard.emergencyFundRecommendedExpensesFull",
                          `Recommended: ${recommendationMonths} months of expenses`,
                          { months: recommendationMonths }
                        )}
                  </div>
                )}
                {actualProgress < 100 && (
                  <div className='text-sm text-finance-blue bg-blue-50 p-3 rounded-lg'>
                    {t(
                      "common.emergencyFundCallToAction",
                      "Keep saving to reach your goal!"
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )
      ) : (
        <div className='group p-4 rounded-lg transition-all duration-500 ease-out hover:bg-gray-50/50 hover:shadow-sm hover:border hover:border-gray-100/50'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center space-x-2'>
              <Shield className='h-4 w-4 text-finance-blue transition-transform duration-500 ease-out group-hover:scale-105' />
              <p className='font-medium transition-colors duration-500 ease-out group-hover:text-finance-blue/80'>
                {t("dashboard.emergencyFund", "Emergency Fund")}
              </p>
            </div>
            <p className='text-sm text-gray-500'>
              {t("common.noEmergencyFundData")}
            </p>
          </div>
          <div className='h-2 bg-gray-200 rounded-full'></div>
        </div>
      )}
    </>
  );
};

export default EmergencyFund;
