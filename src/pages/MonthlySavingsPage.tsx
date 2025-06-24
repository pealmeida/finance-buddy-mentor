import React from "react";
import Header from "../components/Header";
import { UserProfile } from "../types/finance";
import { useSimpleAuthCheck } from "../hooks/useSimpleAuthCheck";
import MonthlySavings from "../components/savings/MonthlySavings";
import SavingStrategies from "../components/SavingStrategies";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import MobileHeader from "../components/ui/mobile-header";
import MobileBottomNav from "../components/ui/mobile-bottom-nav";
import ResponsiveContainer from "../components/ui/responsive-container";
import { useMonthlySavings } from "../hooks/supabase/useMonthlySavings";

interface MonthlySavingsPageProps {
  userProfile: UserProfile;
}

const MonthlySavingsPage: React.FC<MonthlySavingsPageProps> = ({
  userProfile,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useSimpleAuthCheck(true);
  const { refetch } = useMonthlySavings(
    userProfile.id,
    new Date().getFullYear()
  );

  const handleSave = () => {
    refetch();
  };

  if (authLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center'>
        <div className='flex items-center gap-2'>
          <Loader2 className='h-6 w-6 animate-spin text-blue-500' />
          <p className='text-blue-700 font-medium'>
            {t("auth.checkingAuthentication", "Checking authentication...")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      {/* Desktop Header */}
      <div className='hidden md:block'>
        <Header onboardingComplete={true} />
      </div>

      {/* Mobile Header */}
      <MobileHeader title={t("savings.monthlySavings", "Monthly Savings")} />

      {/* Main Content */}
      <main className='pt-16 pb-20 md:pt-0 md:pb-8'>
        <ResponsiveContainer className='py-4 md:py-8 space-y-8'>
          {/* Page Title - Hidden on mobile (shown in header) */}
          <div className='hidden md:block mb-8'>
            <h1 className='text-3xl font-bold'>
              {t("savings.monthlySavings", "Monthly Savings")}
            </h1>
          </div>

          {/* Monthly Savings Tracking Section */}
          <div
            className='bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-lg p-4 md:p-8'
            style={{ marginTop: "0px" }}>
            <MonthlySavings profile={userProfile} onSave={handleSave} />
          </div>

          {/* Saving Strategies Section */}
          <div className='w-full'>
            <SavingStrategies userProfile={userProfile} />
          </div>
        </ResponsiveContainer>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MonthlySavingsPage;
