
import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import MonthlyExpenses from '@/components/expenses/MonthlyExpenses';
import { UserProfile } from '@/types/finance';

const MonthlyExpensesStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();
  
  const handleSave = (updatedProfile: UserProfile) => {
    if (updatedProfile.monthlyExpenses) {
      updateProfile({
        ...profile as UserProfile,
        monthlyExpenses: updatedProfile.monthlyExpenses
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Monthly Expenses</h2>
      <p className="text-gray-600">
        Track your monthly expenses to better understand your spending habits.
      </p>
      
      <MonthlyExpenses 
        profile={profile as UserProfile} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default MonthlyExpensesStep;
