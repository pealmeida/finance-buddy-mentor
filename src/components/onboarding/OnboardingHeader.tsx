
import React from 'react';
import { useTranslation } from 'react-i18next';

interface OnboardingHeaderProps {
  isEditMode?: boolean;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ isEditMode = false }) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEditMode ? t('onboarding.editProfileHeader') : t('onboarding.onboardingHeader')}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {isEditMode ? t('onboarding.editProfileSubheader') : t('onboarding.onboardingSubheader')}
      </p>
    </div>
  );
};

export default OnboardingHeader;
