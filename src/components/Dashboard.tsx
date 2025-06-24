import React, { useState } from "react";
import { UserProfile } from "../types/finance";
import FinancialOverview from "./dashboard/FinancialOverview";
import FinancialGoals from "./dashboard/FinancialGoals";
import PersonalizedInsights from "./dashboard/PersonalizedInsights";
import MarketTrends from "./dashboard/MarketTrends";
import ExpensesSummary from "./dashboard/ExpensesSummary";
import OnboardingChecklist from "./dashboard/OnboardingChecklist";
import DashboardCustomizationModal from "./dashboard/DashboardCustomizationModal";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../hooks/use-mobile";
import { useFinancialMetrics } from "../hooks/useFinancialMetrics";
import { useDashboard } from "../context/DashboardContext";

interface DashboardProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  onProfileUpdate,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { savingsProgress, expensesRatio } = useFinancialMetrics({
    userProfile,
    onProfileUpdate,
  });
  const { isComponentVisible } = useDashboard();
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] =
    useState(false);

  return (
    <div className='w-full max-w-[1400px] mx-auto py-4 px-4 sm:px-6 animate-fade-in'>
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='w-full md:w-3/5 space-y-8'>
          {isComponentVisible("financial-overview") && (
            <FinancialOverview
              userProfile={userProfile}
              onConfigureClick={() => setIsCustomizationModalOpen(true)}
            />
          )}
          {isComponentVisible("financial-goals") && (
            <FinancialGoals userProfile={userProfile} />
          )}
          {isComponentVisible("expenses-summary") && (
            <ExpensesSummary
              userProfile={userProfile}
              expensesRatio={expensesRatio}
            />
          )}
        </div>

        <div className='w-full md:w-2/5 space-y-8'>
          {isComponentVisible("personalized-insights") && (
            <PersonalizedInsights
              userProfile={userProfile}
              savingsProgress={savingsProgress}
              expensesRatio={expensesRatio}
            />
          )}
          {isComponentVisible("market-trends") && <MarketTrends />}
        </div>
      </div>

      {/* Floating Onboarding Checklist */}
      {isComponentVisible("onboarding-checklist") && (
        <OnboardingChecklist userProfile={userProfile} isMobile={isMobile} />
      )}

      {/* Dashboard Customization Modal */}
      <DashboardCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
