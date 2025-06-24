import React, { useEffect, useState } from "react";
import { UserProfile, MonthlyAmount } from "../../types/finance";
import InvestmentDistribution from "./InvestmentDistribution";
import EmergencyFund from "./EmergencyFund";
import FinancialCardGrid from "./FinancialCardGrid";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import FinancialOverviewConfigModal from "./modals/FinancialOverviewConfigModal";

interface FinancialOverviewProps {
  userProfile: UserProfile;
  onConfigureClick?: () => void;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  userProfile,
  onConfigureClick,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Load financial overview configuration from localStorage
  const [overviewConfig, setOverviewConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("financialOverview-config");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading financial overview config:", error);
    }
    return {
      sections: [
        { id: "monthly-income-card", enabled: true },
        { id: "total-investments-card", enabled: true },
        { id: "emergency-fund", enabled: true },
        { id: "investment-distribution", enabled: true },
      ],
      display: {
        showCurrencySymbols: true,
        compactView: false,
        showPercentages: true,
        showRecommendations: true,
        animatedCharts: true,
      },
    };
  });

  // Helper function to check if a section is enabled
  const isSectionEnabled = (sectionId: string) => {
    const section = overviewConfig.sections?.find(
      (s: any) => s.id === sectionId
    );
    return section?.enabled ?? true;
  };

  // Listen for config changes from the modal
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("financialOverview-config");
        if (saved) {
          setOverviewConfig(JSON.parse(saved));
        }
      } catch (error) {
        console.error(
          "Error loading updated financial overview config:",
          error
        );
      }
    };

    // Create a custom storage event listener
    const handleConfigUpdate = () => {
      handleStorageChange();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "financialOverviewConfigUpdated",
      handleConfigUpdate
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "financialOverviewConfigUpdated",
        handleConfigUpdate
      );
    };
  }, []);

  const handleConfigureClick = () => {
    if (onConfigureClick) {
      onConfigureClick();
    } else {
      setIsConfigModalOpen(true);
    }
  };

  const [investmentDistribution, setInvestmentDistribution] = useState<
    Array<{
      type: string;
      percentage: number;
    }>
  >([]);
  const totalInvestments = userProfile.investments?.reduce(
    (sum, inv) => sum + inv.value,
    0
  );
  const monthlyIncome = userProfile.monthlyIncome;
  const hasInvestments =
    userProfile.investments && userProfile.investments.length > 0;

  // Calculate monthly expenses for emergency fund calculation
  const monthlyExpenses = (() => {
    if (userProfile.monthlyExpenses?.data) {
      // Filter out months with 0 expenses and calculate average
      const nonZeroExpenses = userProfile.monthlyExpenses.data.filter(
        (item) => item.amount > 0
      );
      if (nonZeroExpenses.length > 0) {
        const totalExpenses = nonZeroExpenses.reduce(
          (sum, item) => sum + item.amount,
          0
        );
        return totalExpenses / nonZeroExpenses.length; // Average monthly expenses
      }
    }
    // Fallback to 70% of income if no expense data
    return (monthlyIncome ?? 0) * 0.7;
  })();

  // Calculate current emergency fund amount based on profile data
  // emergencyFundMonths represents months of income the user has saved
  const currentEmergencyFund =
    userProfile.hasEmergencyFund && userProfile.emergencyFundMonths
      ? (monthlyIncome ?? 0) * userProfile.emergencyFundMonths
      : 0;

  // Calculate percentage for display (this will be recalculated in the component based on income/expense target)
  const emergencyFundPercentage = userProfile.hasEmergencyFund
    ? ((userProfile.emergencyFundMonths || 0) / 6) * 100
    : 0;

  useEffect(() => {
    // Generate investment distribution based on risk profile
    const calculateInvestmentDistribution = () => {
      const { riskProfile, investments } = userProfile;
      if (investments && investments.length === 0) {
        // If no investments, use recommended allocation based on risk profile
        if (riskProfile === "conservative") {
          return [
            {
              type: "bonds",
              percentage: 60,
            },
            {
              type: "stocks",
              percentage: 20,
            },
            {
              type: "cash",
              percentage: 15,
            },
            {
              type: "realEstate",
              percentage: 5,
            },
          ];
        } else if (riskProfile === "moderate") {
          return [
            {
              type: "stocks",
              percentage: 50,
            },
            {
              type: "bonds",
              percentage: 30,
            },
            {
              type: "realEstate",
              percentage: 15,
            },
            {
              type: "cash",
              percentage: 5,
            },
          ];
        } else {
          // aggressive
          return [
            {
              type: "stocks",
              percentage: 70,
            },
            {
              type: "realEstate",
              percentage: 15,
            },
            {
              type: "other",
              percentage: 10,
            },
            {
              type: "bonds",
              percentage: 5,
            },
          ];
        }
      } else {
        // Calculate actual distribution from their investments
        const distribution: Record<string, number> = {};
        let total = 0;
        investments?.forEach((inv) => {
          const formattedType = formatInvestmentType(inv.type);
          if (!distribution[formattedType]) distribution[formattedType] = 0;
          distribution[formattedType] += inv.value;
          total += inv.value;
        });
        return Object.entries(distribution)
          .map(([type, value]) => ({
            type,
            percentage: Math.round((value / total) * 100),
          }))
          .sort((a, b) => b.percentage - a.percentage);
      }
    };
    setInvestmentDistribution(calculateInvestmentDistribution());
  }, [userProfile.investments, userProfile.riskProfile]);

  // Format investment type for display
  const formatInvestmentType = (type: string): string => {
    switch (type) {
      case "stocks":
        return "stocks";
      case "bonds":
        return "bonds";
      case "realEstate":
        return "realEstate";
      case "cash":
        return "cash";
      case "crypto":
        return "crypto";
      default:
        return "other";
    }
  };

  return (
    <div className='glass-panel rounded-2xl p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold'>
          {t("dashboard.financialOverview")}
        </h2>
        <Button
          onClick={handleConfigureClick}
          variant='ghost'
          size='sm'
          className='text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          title={t(
            "dashboard.customization.configureFinancialOverview",
            "Configure Financial Overview"
          )}>
          <Settings className='h-4 w-4' />
        </Button>
      </div>

      {/* Conditional rendering based on configuration */}
      {(isSectionEnabled("monthly-income-card") ||
        isSectionEnabled("total-investments-card")) && (
        <FinancialCardGrid
          monthlyIncome={monthlyIncome ?? 0}
          totalInvestments={totalInvestments ?? 0}
          hasInvestments={hasInvestments ?? false}
          showIncomeCard={isSectionEnabled("monthly-income-card")}
          showInvestmentsCard={isSectionEnabled("total-investments-card")}
          displaySettings={overviewConfig.display}
        />
      )}

      {(isSectionEnabled("emergency-fund") ||
        isSectionEnabled("investment-distribution")) && (
        <div className='mt-6 space-y-6'>
          {isSectionEnabled("emergency-fund") && (
            <EmergencyFund
              currentEmergencyFund={currentEmergencyFund}
              monthlyIncome={monthlyIncome ?? 0}
              emergencyFundPercentage={emergencyFundPercentage}
              hasEmergencyFundData={userProfile.hasEmergencyFund}
              displaySettings={overviewConfig.display}
            />
          )}

          {isSectionEnabled("investment-distribution") && (
            <InvestmentDistribution
              userProfile={userProfile}
              investmentDistribution={investmentDistribution}
              hasInvestmentData={hasInvestments ?? false}
              displaySettings={overviewConfig.display}
            />
          )}
        </div>
      )}

      <FinancialOverviewConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
};

export default FinancialOverview;
