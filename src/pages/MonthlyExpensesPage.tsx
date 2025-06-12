import React from "react";
import Header from "../components/Header";
import { UserProfile } from "../types/finance";
import { useSimpleAuthCheck } from "../hooks/useSimpleAuthCheck";
import MonthlyExpenses from "../components/expenses/MonthlyExpenses";
import { useProfileCompletion } from "../hooks/useProfileCompletion";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import MobileHeader from "../components/ui/mobile-header";
import MobileBottomNav from "../components/ui/mobile-bottom-nav";
import ResponsiveContainer from "../components/ui/responsive-container";

interface MonthlyExpensesPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const MonthlyExpensesPage: React.FC<MonthlyExpensesPageProps> = ({
  userProfile,
  onProfileUpdate,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useSimpleAuthCheck(true);
  const { handleProfileComplete, isSubmitting } =
    useProfileCompletion(onProfileUpdate);

  const handleSave = (updatedProfile: UserProfile) => {
    handleProfileComplete(updatedProfile);
  };

  if (authLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex justify-center items-center'>
        <div className='flex items-center gap-2'>
          <Loader2 className='h-6 w-6 animate-spin text-red-500' />
          <p className='text-red-700 font-medium'>
            {t("common.loading", "Checking authentication...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-red-50'>
      {/* Desktop Header */}
      <div className='hidden md:block'>
        <Header onboardingComplete={true} />
      </div>

      {/* Mobile Header */}
      <MobileHeader
        title={t("expenses.monthlyExpenses", "Monthly Expenses")}
        showMenu={true}
      />

      {/* Main Content */}
      <main className='pb-20 md:pb-8'>
        <ResponsiveContainer className='py-4 md:py-8'>
          {/* Page Title - Hidden on mobile (shown in header) */}
          <div className='hidden md:block mb-8'>
            <h1 className='text-3xl font-bold'>
              {t("expenses.monthlyExpenses", "Monthly Expenses")}
            </h1>
          </div>

          {/* Content Card */}
          <div className='bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-lg p-4 md:p-8'>
            <MonthlyExpenses
              profile={userProfile}
              onSave={handleSave}
              isSaving={isSubmitting}
            />
          </div>
        </ResponsiveContainer>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MonthlyExpensesPage;
