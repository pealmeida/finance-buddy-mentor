import React, { useEffect, useState } from "react";
import { UserProfile, MonthlyAmount } from "../../types/finance";
import InvestmentDistribution from "./InvestmentDistribution";
import EmergencyFund from "./EmergencyFund";
import FinancialCardGrid from "./FinancialCardGrid";
import { useTranslation } from "react-i18next";

interface FinancialOverviewProps {
  userProfile: UserProfile;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  userProfile,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

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

  // Calculate emergency fund target (6 months of expenses)
  const monthlyExpenses =
    userProfile.monthlyExpenses?.data.reduce(
      (sum, item) => sum + item.amount,
      0
    ) || (monthlyIncome ?? 0) * 0.7; // Use actual monthly expenses or assume 70% of income
  const emergencyFundTarget = monthlyExpenses * 6;

  // Calculate current emergency fund amount based on profile data
  const emergencyFundPercentage = userProfile.hasEmergencyFund
    ? ((userProfile.emergencyFundMonths || 0) / 6) * 100
    : userProfile.emergencyFundMonths === 0
    ? 0
    : 30; // If 0 months, set to 0, otherwise default to 30%
  const currentEmergencyFund =
    (emergencyFundPercentage / 100) * emergencyFundTarget;

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
        <span className='text-sm text-gray-500'>
          {new Date().toLocaleDateString()}
        </span>
      </div>

      <FinancialCardGrid
        monthlyIncome={monthlyIncome ?? 0}
        totalInvestments={totalInvestments ?? 0}
        hasInvestments={hasInvestments ?? false}
      />

      <div className='mt-6 space-y-6'>
        <EmergencyFund
          currentEmergencyFund={currentEmergencyFund}
          emergencyFundTarget={emergencyFundTarget}
          emergencyFundPercentage={emergencyFundPercentage}
          hasEmergencyFundData={userProfile.hasEmergencyFund}
        />

        <InvestmentDistribution
          userProfile={userProfile}
          investmentDistribution={investmentDistribution}
          hasInvestmentData={hasInvestments ?? false}
        />
      </div>
    </div>
  );
};

export default FinancialOverview;
