
import React from 'react';
import { UserProfile } from '@/types/finance';
import MonthlyExpenses from '@/components/expenses/MonthlyExpenses';

interface MonthlyExpensesTabProps {
  profile: UserProfile;
  isSubmitting: boolean;
  onSave: (updatedProfile: UserProfile) => void;
}

const MonthlyExpensesTab: React.FC<MonthlyExpensesTabProps> = ({ 
  profile, 
  isSubmitting, 
  onSave 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <MonthlyExpenses
          profile={profile}
          onSave={onSave}
          isSaving={isSubmitting}
        />
      </div>
    </div>
  );
};

export default MonthlyExpensesTab;
