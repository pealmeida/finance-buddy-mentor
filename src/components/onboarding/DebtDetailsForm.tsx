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
import DebtDetailItem from "./DebtDetailItem";
import { useOnboarding } from "@/context/OnboardingContext";
import { v4 as uuidv4 } from "uuid";

const DebtDetailsForm: React.FC = () => {
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

    // Reset form
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
      <h3 className='text-base font-medium mb-4'>Your Debts</h3>

      {/* List of existing debts */}
      {profile.debtDetails && profile.debtDetails.length > 0 && (
        <div className='mb-4'>
          {profile.debtDetails.map((debt) => (
            <DebtDetailItem key={debt.id} debt={debt} onRemove={removeDebt} />
          ))}
        </div>
      )}

      {/* Add new debt form */}
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='debt-type'>Type</Label>
            <Select
              value={currentDebt.type}
              onValueChange={(value) => handleDebtChange("type", value)}>
              <SelectTrigger id='debt-type'>
                <SelectValue placeholder='Select debt type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='creditCard'>Credit Card</SelectItem>
                <SelectItem value='personalLoan'>Personal Loan</SelectItem>
                <SelectItem value='studentLoan'>Student Loan</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='debt-name'>Name/Description</Label>
            <Input
              id='debt-name'
              value={currentDebt.name}
              onChange={(e) => handleDebtChange("name", e.target.value)}
              placeholder='e.g., Chase Credit Card'
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='debt-amount'>Amount ($)</Label>
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
            <Label htmlFor='debt-interest'>Interest Rate (%)</Label>
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
          <PlusCircle className='h-4 w-4' /> Add Debt
        </Button>
      </div>
    </div>
  );
};

export default DebtDetailsForm;
