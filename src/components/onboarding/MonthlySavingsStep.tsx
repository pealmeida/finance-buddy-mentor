import React from "react";
import { useOnboarding } from "../../context/OnboardingContext";
import MonthlySavings from "../savings/MonthlySavings";
import { UserProfile } from "../../types/finance";
import { useTranslation } from "react-i18next";

const MonthlySavingsStep: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();

  const handleSave = (updatedProfile: UserProfile) => {
    if (updatedProfile.monthlySavings) {
      updateProfile({
        ...(profile as UserProfile),
        monthlySavings: updatedProfile.monthlySavings,
      });
    }
  };

  return (
    <MonthlySavings profile={profile as UserProfile} onSave={handleSave} />
  );
};

export default MonthlySavingsStep;
