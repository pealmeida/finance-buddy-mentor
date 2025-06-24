import React from "react";
import { AlertTriangle, TrendingUp, DollarSign, Percent } from "lucide-react";
import { UserProfile } from "../../types/finance";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";
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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useIsMobile } from "../../hooks/use-mobile";

interface InvestmentDistributionProps {
  userProfile: UserProfile;
  investmentDistribution: Array<{
    type: string;
    percentage: number;
  }>;
  hasInvestmentData: boolean;
  displaySettings?: {
    showPercentages?: boolean;
    animatedCharts?: boolean;
  };
}

const InvestmentDistribution: React.FC<InvestmentDistributionProps> = ({
  userProfile,
  investmentDistribution,
  hasInvestmentData,
  displaySettings,
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const isMobile = useIsMobile();

  // Calculate total portfolio value
  const totalPortfolioValue =
    userProfile.investments?.reduce((sum, inv) => sum + inv.value, 0) || 0;

  // Group investments by type
  const groupedInvestments = React.useMemo(() => {
    if (!userProfile.investments) return {};

    const groups: Record<string, any[]> = {};
    userProfile.investments.forEach((investment) => {
      if (!groups[investment.type]) {
        groups[investment.type] = [];
      }
      groups[investment.type].push(investment);
    });
    return groups;
  }, [userProfile.investments]);

  // Calculate type totals and percentages
  const typeDetails = React.useMemo(() => {
    return investmentDistribution.map((item, index) => {
      const investments = groupedInvestments[item.type] || [];
      const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
      const averageReturn =
        investments.length > 0
          ? investments.reduce((sum, inv) => sum + (inv.annualReturn || 0), 0) /
            investments.length
          : 0;

      return {
        ...item,
        investments,
        totalValue,
        averageReturn,
        colorClass:
          index === 0
            ? "bg-finance-blue"
            : index === 1
            ? "bg-finance-green"
            : index === 2
            ? "bg-finance-purple"
            : index === 3
            ? "bg-yellow-400"
            : "bg-gray-400",
      };
    });
  }, [investmentDistribution, groupedInvestments]);

  const distributionContent = (
    <div className='space-y-4'>
      {/* Portfolio Overview */}
      <div className='bg-gray-50 p-4 rounded-lg'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='font-semibold flex items-center'>
            <TrendingUp className='h-4 w-4 mr-2 text-finance-blue' />
            {t("dashboard.portfolioOverview", "Portfolio Overview")}
          </h4>
          <span className='text-lg font-bold text-finance-blue'>
            {formatCurrency(totalPortfolioValue)}
          </span>
        </div>
        <p className='text-sm text-gray-600'>
          {t("dashboard.riskProfile", "Risk Profile:")}{" "}
          <span className='font-medium'>
            {t(`dashboard.riskProfiles.${userProfile.riskProfile}`)}
          </span>
        </p>
      </div>

      {/* Investment Categories */}
      <div className='space-y-3'>
        <h4 className='font-semibold text-sm'>
          {t("dashboard.investmentBreakdown", "Investment Breakdown")}
        </h4>
        {typeDetails.map((category) => (
          <div key={category.type} className='border rounded-lg p-3 space-y-2'>
            {/* Category Header */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div
                  className={`w-4 h-4 rounded-full ${category.colorClass}`}
                />
                <div>
                  <span className='font-medium text-sm'>
                    {t(`dashboard.investmentType.${category.type}`)}
                  </span>
                  <div className='flex items-center space-x-2 text-xs text-gray-500'>
                    <span>{category.percentage}%</span>
                    <span>•</span>
                    <span>{formatCurrency(category.totalValue)}</span>
                    {category.averageReturn > 0 && (
                      <>
                        <span>•</span>
                        <span className='flex items-center'>
                          <Percent className='h-3 w-3 mr-1' />
                          {category.averageReturn.toFixed(1)}%{" "}
                          {t("dashboard.avgReturn")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Investments */}
            {category.investments.length > 0 && (
              <div className='space-y-1 mt-2 pl-7'>
                {category.investments.map((investment) => (
                  <div
                    key={investment.id}
                    className='flex items-center justify-between text-xs'>
                    <div className='flex items-center space-x-2'>
                      <DollarSign className='h-3 w-3 text-gray-400' />
                      <span className='text-gray-700'>{investment.name}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-gray-500'>
                      <span>{formatCurrency(investment.value)}</span>
                      {investment.annualReturn && (
                        <span className='text-green-600'>
                          +{investment.annualReturn}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No investments in category */}
            {category.investments.length === 0 && (
              <div className='text-xs text-gray-400 pl-7 italic'>
                {t(
                  "dashboard.recommendedAllocation",
                  "Recommended allocation - no investments yet"
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Investment Tips */}
      {userProfile.riskProfile && (
        <div className='bg-blue-50 p-3 rounded-lg'>
          <h5 className='font-medium text-sm text-blue-800 mb-1'>
            {t("dashboard.investmentTip", "Investment Tip")}
          </h5>
          <p className='text-xs text-blue-700'>
            {userProfile.riskProfile === "conservative" &&
              t(
                "dashboard.conservativeTip",
                "Focus on bonds and stable investments for capital preservation."
              )}
            {userProfile.riskProfile === "moderate" &&
              t(
                "dashboard.moderateTip",
                "Balance growth and stability with a mix of stocks and bonds."
              )}
            {userProfile.riskProfile === "aggressive" &&
              t(
                "dashboard.aggressiveTip",
                "Maximize growth potential with higher stock allocation."
              )}
          </p>
        </div>
      )}
    </div>
  );

  const simpleDistributionContent = (
    <div className='space-y-2'>
      {typeDetails.map((item) => (
        <div key={item.type} className='flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <div className={`w-3 h-3 rounded-full ${item.colorClass}`} />
            <span className='text-sm'>
              {t(`dashboard.investmentType.${item.type}`)}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>{item.percentage}%</span>
            <span className='text-xs text-gray-500'>
              {formatCurrency(item.totalValue)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {hasInvestmentData && investmentDistribution.length > 0 ? (
        isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <div className='group mt-2 p-4 rounded-lg transition-all duration-500 ease-out hover:bg-gray-50/50 hover:shadow-sm hover:border hover:border-gray-100/50 cursor-pointer'>
                <div className='flex items-center justify-between mb-3'>
                  <p className='font-medium transition-colors duration-500 ease-out group-hover:text-finance-blue/80'>
                    {t("dashboard.investmentDistribution")}
                  </p>
                  <p className='text-xs text-gray-500 transition-colors duration-500 ease-out group-hover:text-gray-600'>
                    {t(`dashboard.riskProfiles.${userProfile.riskProfile}`)}
                  </p>
                </div>
                <div className='flex items-center'>
                  <div className='flex-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div className='flex h-full'>
                      {investmentDistribution.map((item, index) => (
                        <div
                          key={index}
                          className={`h-full ${
                            index === 0
                              ? "bg-finance-blue"
                              : index === 1
                              ? "bg-finance-green"
                              : index === 2
                              ? "bg-finance-purple"
                              : index === 3
                              ? "bg-yellow-400"
                              : "bg-gray-400"
                          }`}
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex justify-between text-xs text-gray-500 mt-1 transition-colors duration-500 ease-out group-hover:text-gray-600'>
                  {investmentDistribution.map((item, index) => (
                    <span key={index}>
                      {displaySettings?.showPercentages !== false
                        ? t("dashboard.investmentItem", {
                            type: t(`dashboard.investmentType.${item.type}`),
                            percentage: item.percentage,
                          })
                        : t(`dashboard.investmentType.${item.type}`)}
                    </span>
                  ))}
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className='text-center'>
                <DrawerTitle>
                  {t(
                    "dashboard.investmentPortfolioDetails",
                    "Investment Portfolio Details"
                  )}
                </DrawerTitle>
                <DrawerDescription>
                  {t(
                    "dashboard.portfolioDistributionDetails",
                    "View detailed breakdown of your investment portfolio allocation and performance."
                  )}
                </DrawerDescription>
              </DrawerHeader>
              <div className='p-4'>{distributionContent}</div>
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
              <div className='group mt-2 p-4 rounded-lg transition-all duration-500 ease-out hover:bg-gray-50/50 hover:shadow-sm hover:border hover:border-gray-100/50 cursor-pointer'>
                <div className='flex items-center justify-between mb-3'>
                  <p className='font-medium transition-colors duration-500 ease-out group-hover:text-finance-blue/80'>
                    {t("dashboard.investmentDistribution")}
                  </p>
                  <p className='text-xs text-gray-500 transition-colors duration-500 ease-out group-hover:text-gray-600'>
                    {t(`dashboard.riskProfiles.${userProfile.riskProfile}`)}
                  </p>
                </div>
                <div className='flex items-center'>
                  <div className='flex-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div className='flex h-full'>
                      {investmentDistribution.map((item, index) => (
                        <div
                          key={index}
                          className={`h-full ${
                            index === 0
                              ? "bg-finance-blue"
                              : index === 1
                              ? "bg-finance-green"
                              : index === 2
                              ? "bg-finance-purple"
                              : index === 3
                              ? "bg-yellow-400"
                              : "bg-gray-400"
                          }`}
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex justify-between text-xs text-gray-500 mt-1 transition-colors duration-500 ease-out group-hover:text-gray-600'>
                  {investmentDistribution.map((item, index) => (
                    <span key={index}>
                      {displaySettings?.showPercentages !== false
                        ? t("dashboard.investmentItem", {
                            type: t(`dashboard.investmentType.${item.type}`),
                            percentage: item.percentage,
                          })
                        : t(`dashboard.investmentType.${item.type}`)}
                    </span>
                  ))}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
              <DialogHeader className='text-center'>
                <DialogTitle className='text-center'>
                  {t(
                    "dashboard.investmentPortfolioDetails",
                    "Investment Portfolio Details"
                  )}
                </DialogTitle>
                <DialogDescription className='text-center'>
                  {t(
                    "dashboard.portfolioDistributionDetails",
                    "View detailed breakdown of your investment portfolio allocation and performance."
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className='text-center'>{distributionContent}</div>
            </DialogContent>
          </Dialog>
        )
      ) : (
        <div className='group mt-2 p-4 rounded-lg transition-all duration-500 ease-out hover:bg-gray-50/50 hover:shadow-sm hover:border hover:border-gray-100/50'>
          <div className='flex items-center justify-between mb-3'>
            <p className='font-medium transition-colors duration-500 ease-out group-hover:text-finance-blue/80'>
              {t("dashboard.investmentDistribution")}
            </p>
            <p className='text-xs text-gray-500 transition-colors duration-500 ease-out group-hover:text-gray-600'>
              {t(`dashboard.riskProfiles.${userProfile.riskProfile}`)}
            </p>
          </div>
          <p className='text-xs text-gray-500 mt-2 flex items-center transition-colors duration-500 ease-out group-hover:text-gray-600'>
            <AlertTriangle className='h-3 w-3 mr-1 text-amber-500 transition-transform duration-500 ease-out group-hover:scale-105' />
            {t("common.noInvestmentData")}
          </p>
        </div>
      )}
    </>
  );
};

export default InvestmentDistribution;
