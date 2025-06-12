import React from "react";
import { useOnboarding } from "../../context/OnboardingContext";
import MonthlyExpenses from "../expenses/MonthlyExpenses";
import { UserProfile } from "../../types/finance";
import { useTranslation } from "react-i18next";

const MonthlyExpensesStep: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();

  const handleSave = (updatedProfile: UserProfile) => {
    if (updatedProfile.monthlyExpenses) {
      updateProfile({
        ...(profile as UserProfile),
        monthlyExpenses: updatedProfile.monthlyExpenses,
      });
    }
  };

  return (
    <MonthlyExpenses
      profile={profile as UserProfile}
      onUpdateProfile={handleSave}
    />
  );
};

export default MonthlyExpensesStep;
