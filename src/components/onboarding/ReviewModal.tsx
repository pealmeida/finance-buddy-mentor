import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { useTranslation } from "react-i18next";
import {
  UserProfile,
  FinancialGoal,
  MonthlySavings,
  Investment,
} from "../../types/finance";

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  profileData: Partial<UserProfile>;
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profileData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSave = async () => {
    setIsLoading(true);
    await onSave();
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md p-6'>
        <h2 className='text-xl font-bold mb-4'>
          {t("onboarding.reviewModalTitle")}
        </h2>

        <div className='mb-6 p-4 text-lg text-gray-700 border border-blue-300 bg-blue-50 rounded-md'>
          <p>
            <strong>{t("onboarding.reviewModalMessage1")}</strong>
          </p>
          <br />
          <p>{t("onboarding.reviewModalMessage2")}</p>
        </div>

        <div className='flex justify-end space-x-3'>
          <Button variant='secondary' onClick={onClose} disabled={isLoading}>
            {t("common.continueEditing")}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Progress className='w-4 h-4' /> : t("common.save")}
          </Button>
        </div>
      </Card>
    </div>
  );
};
