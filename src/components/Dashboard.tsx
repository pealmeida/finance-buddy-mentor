import React, { useState, useEffect, useCallback } from "react";
import { UserProfile } from "../types/finance";
import FinancialOverview from "./dashboard/FinancialOverview";
import FinancialGoals from "./dashboard/FinancialGoals";
import PersonalizedInsights from "./dashboard/PersonalizedInsights";
import MarketTrends from "./dashboard/MarketTrends";
import ExpensesSummary from "./dashboard/ExpensesSummary";
import OnboardingChecklist from "./dashboard/OnboardingChecklist";
import { useTranslation } from "react-i18next";
import { useMonthlySavings } from "../hooks/supabase/useMonthlySavings";
import { useExpenses } from "../hooks/supabase/useExpenses";

interface DashboardProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  onProfileUpdate,
}) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const {
    monthlySavingsData,
    isLoading: monthlySavingsLoading,
    error: monthlySavingsError,
    calculateAverageSavings,
  } = useMonthlySavings(userProfile.id, currentYear);
  const {
    monthlyExpensesData,
    isLoading: monthlyExpensesLoading,
    error: monthlyExpensesError,
    getMonthlyExpensesSummary,
  } = useExpenses(userProfile.id, currentYear);
  const [savingsProgress, setSavingsProgress] = useState<number>(0); // Default value changed to 0
  const [expensesRatio, setExpensesRatio] = useState<number>(50); // Default value
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state to trigger refresh

  // Calculate key metrics for child components
  const monthlyIncome = userProfile.monthlyIncome;
  const recommendedSavings = monthlyIncome ? monthlyIncome * 0.2 : 0;

  const calculateAverageExpenses = useCallback(
    (
      monthlyExpenses: { month: number; amount: number }[] | undefined
    ): number => {
      if (!monthlyExpenses || monthlyExpenses.length === 0) return 0;

      // Filter out months with zero expenses
      const nonZeroMonths = monthlyExpenses.filter((month) => month.amount > 0);
      if (nonZeroMonths.length === 0) return 0;

      const totalExpenses = nonZeroMonths.reduce(
        (sum, month) => sum + month.amount,
        0
      );
      return totalExpenses / nonZeroMonths.length;
    },
    []
  );

  useEffect(() => {
    const calculateFinancialMetrics = async () => {
      if (!userProfile.id) return;

      try {
        // Fetch savings data
        if (!monthlySavingsData || !monthlySavingsData.data) {
          // If no monthlySavingsData or it's empty, set savingsProgress to 0
          setSavingsProgress(0);
          console.log(
            "Dashboard: monthlySavingsData is null/undefined or data is empty. Setting savingsProgress to 0."
          );
        } else {
          console.log(
            "Dashboard: monthlySavingsData received:",
            monthlySavingsData
          );
          // Ensure we convert any JSON data to the proper MonthlyAmount type
          const typedSavingsData = Array.isArray(monthlySavingsData.data)
            ? monthlySavingsData.data.map((item) => ({
                month:
                  typeof item.month === "number"
                    ? item.month
                    : parseInt(String(item.month)),
                amount:
                  typeof item.amount === "number"
                    ? item.amount
                    : parseFloat(String(item.amount)),
              }))
            : [];

          const avgSavings = calculateAverageSavings(typedSavingsData);
          console.log("Dashboard: avgSavings:", avgSavings);
          console.log("Dashboard: recommendedSavings:", recommendedSavings);
          const progress =
            avgSavings === 0 // Check if average savings is 0
              ? 0
              : Math.min((avgSavings / recommendedSavings) * 100, 100);
          setSavingsProgress(progress);
          console.log("Dashboard: savingsProgress set to:", progress);

          // Only update userProfile if monthlySavings data has actually changed
          if (
            JSON.stringify(userProfile.monthlySavings?.data) !==
            JSON.stringify(typedSavingsData)
          ) {
            console.log(
              "Dashboard: Calling onProfileUpdate for monthlySavings. Old userProfile:",
              userProfile
            );
            const updatedProfileWithSavings = {
              ...userProfile,
              monthlySavings: {
                id: userProfile.id,
                userId: userProfile.id,
                year: currentYear,
                data: typedSavingsData,
              },
            };
            onProfileUpdate(updatedProfileWithSavings);
            console.log(
              "Dashboard: onProfileUpdate called for monthlySavings. New userProfile (should contain savings):",
              updatedProfileWithSavings
            );
            setRefreshTrigger((prev) => prev + 1); // Trigger refresh
          }
        }

        // Fetch expenses data
        if (monthlyExpensesData && monthlyExpensesData.length > 0) {
          const typedExpensesData = Array.isArray(monthlyExpensesData)
            ? monthlyExpensesData.map((item) => ({
                month:
                  typeof item.month === "number"
                    ? item.month
                    : parseInt(String(item.month)),
                amount:
                  typeof item.amount === "number"
                    ? item.amount
                    : parseFloat(String(item.amount)),
              }))
            : [];
          console.log(
            "Dashboard: Typed expensesData after mapping:",
            typedExpensesData
          );

          const avgExpenses = calculateAverageExpenses(typedExpensesData);

          // Calculate what percentage of income is being spent
          if (monthlyIncome && monthlyIncome > 0) {
            const expenseRatio = Math.min(
              (avgExpenses / monthlyIncome) * 100,
              100
            );
            setExpensesRatio(expenseRatio);
          }

          // Only update userProfile if monthlyExpenses data has actually changed
          if (
            JSON.stringify(userProfile.monthlyExpenses?.data) !==
            JSON.stringify(typedExpensesData)
          ) {
            console.log(
              "Dashboard: Calling onProfileUpdate for monthlyExpenses. Old userProfile:",
              userProfile
            );
            const updatedProfileWithExpenses = {
              ...userProfile,
              monthlyExpenses: {
                id: userProfile.id,
                userId: userProfile.id,
                year: currentYear,
                data: typedExpensesData,
              },
            };
            onProfileUpdate(updatedProfileWithExpenses);
            console.log(
              "Dashboard: onProfileUpdate called for monthlyExpenses. New userProfile (should contain expenses):",
              updatedProfileWithExpenses
            );
            setRefreshTrigger((prev) => prev + 1); // Trigger refresh
          }
        } else {
          console.log(
            "Dashboard: expensesData is null, undefined, or expensesData.data is missing/empty."
          );
        }
      } catch (error) {
        console.error(t("errors.errorCalculating"), error);
      }
    };

    calculateFinancialMetrics();
  }, [
    userProfile.id,
    recommendedSavings,
    monthlyIncome,
    calculateAverageExpenses,
    t,
    onProfileUpdate,
    refreshTrigger, // Add refreshTrigger as a dependency
    monthlySavingsData, // Add monthlySavingsData as a dependency
    monthlyExpensesData, // Add monthlyExpensesData as a dependency
  ]);

  return (
    <div className='w-full max-w-[1400px] mx-auto py-8 px-4 sm:px-6 animate-fade-in'>
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='w-full md:w-3/5 space-y-8'>
          <FinancialOverview userProfile={userProfile} />
          <FinancialGoals userProfile={userProfile} />
          <ExpensesSummary
            userProfile={userProfile}
            expensesRatio={expensesRatio}
          />
        </div>

        <div className='w-full md:w-2/5 space-y-8'>
          <PersonalizedInsights
            userProfile={userProfile}
            savingsProgress={savingsProgress}
            expensesRatio={expensesRatio}
          />
          <MarketTrends />
        </div>
      </div>

      {/* Floating Onboarding Checklist */}
      <OnboardingChecklist userProfile={userProfile} />
    </div>
  );
};

export default Dashboard;
