
import React, { useState } from "react";
import { DebtDetail } from "@/types/finance";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import DebtDetailItem from "./DebtDetailItem";
import { useOnboarding } from "@/context/OnboardingContext";
import { v4 as uuidv4 } from "uuid";

const DebtDetailsForm: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile } = useOnboarding();
  const [currentDebt, setCurrentDebt] = useState<Omit<DebtDetail, "id">>({
    type: "creditCard",
    name: "",
    amount: 0,
    interestRate: 0,
  });

  const handleDebtChange = (
    field: keyof Omit<DebtDetail, "id">,
    value: string | number
  ) => {
    setCurrentDebt((prev) => ({
      ...prev,
      [field]:
        field === "amount" || field === "interestRate" ? Number(value) : value,
    }));
  };

  const addDebt = () => {
    if (!currentDebt.name || currentDebt.amount <= 0) return;

    const newDebt: DebtDetail = {
      id: uuidv4(),
      ...currentDebt,
    };

    updateProfile({
      debtDetails: [...(profile.debtDetails || []), newDebt],
    });

    setCurrentDebt({
      type: "creditCard",
      name: "",
      amount: 0,
      interestRate: 0,
    });
  };

  const removeDebt = (id: string) => {
    updateProfile({
      debtDetails: profile.debtDetails?.filter((debt) => debt.id !== id) || [],
    });
  };

  return (
    <div className='px-8 pt-2 pb-4 border rounded-lg bg-gray-50 mt-4'>
      <h3 className='text-base font-medium mb-4'>{t('onboarding.yourDebts')}</h3>

      {profile.debtDetails && profile.debtDetails.length > 0 && (
        <div className='mb-4'>
          {profile.debtDetails.map((debt) => (
            <DebtDetailItem key={debt.id} debt={debt} onRemove={removeDebt} />
          ))}
        </div>
      )}

      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='debt-type'>{t('onboarding.debtType')}</Label>
            <Select
              value={currentDebt.type}
              onValueChange={(value) => handleDebtChange("type", value)}>
              <SelectTrigger id='debt-type'>
                <SelectValue placeholder={t('onboarding.selectDebtType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='creditCard'>{t('onboarding.creditCard')}</SelectItem>
                <SelectItem value='personalLoan'>{t('onboarding.personalLoan')}</SelectItem>
                <SelectItem value='studentLoan'>{t('onboarding.studentLoan')}</SelectItem>
                <SelectItem value='other'>{t('onboarding.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='debt-name'>{t('onboarding.debtName')}</Label>
            <Input
              id='debt-name'
              value={currentDebt.name}
              onChange={(e) => handleDebtChange("name", e.target.value)}
              placeholder={t('onboarding.debtNamePlaceholder')}
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='debt-amount'>{t('onboarding.debtAmount')}</Label>
            <Input
              id='debt-amount'
              type='number'
              min='0'
              step='100'
              value={currentDebt.amount || ""}
              onChange={(e) => handleDebtChange("amount", e.target.value)}
              placeholder='0'
            />
          </div>

          <div>
            <Label htmlFor='debt-interest'>{t('onboarding.debtInterestRate')}</Label>
            <Input
              id='debt-interest'
              type='number'
              min='0'
              step='0.1'
              value={currentDebt.interestRate || ""}
              onChange={(e) => handleDebtChange("interestRate", e.target.value)}
              placeholder='0'
            />
          </div>
        </div>

        <Button
          type='button'
          variant='outline'
          onClick={addDebt}
          disabled={!currentDebt.name || currentDebt.amount <= 0}
          className='w-full flex items-center gap-2'>
          <PlusCircle className='h-4 w-4' /> {t('onboarding.addDebt')}
        </Button>
      </div>
    </div>
  );
};

export default DebtDetailsForm;
