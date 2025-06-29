import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { UserProfile } from "../types/finance";
import GoalsManagement from "../components/goals/GoalsManagement";
import { useToast } from "../components/ui/use-toast";
import { useTranslation } from "react-i18next";
import MobileHeader from "../components/ui/mobile-header";
import MobileBottomNav from "../components/ui/mobile-bottom-nav";
import ResponsiveContainer from "../components/ui/responsive-container";

interface GoalsPageProps {
  userProfile: UserProfile;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ userProfile }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      {/* Desktop Header */}
      <div className='hidden md:block'>
        <Header onboardingComplete={true} />
      </div>

      {/* Mobile Header */}
      <MobileHeader title={t("goals.financialGoals", "Financial Goals")} />

      {/* Main Content */}
      <main className='pt-16 pb-20 md:pt-0 md:pb-8'>
        <ResponsiveContainer className='py-4 md:py-8'>
          {/* Desktop Back Button and Title */}
          <div className='hidden md:flex items-center mb-8'>
            <h1 className='text-3xl font-semibold text-gray-800'>
              {t("goals.financialGoals", "Financial Goals")}
            </h1>
          </div>

          {/* Content Card */}
          <div className='bg-white shadow-sm md:shadow-md rounded-lg p-4 md:p-6'>
            <GoalsManagement goals={userProfile.financialGoals ?? []} />
          </div>
        </ResponsiveContainer>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default GoalsPage;
