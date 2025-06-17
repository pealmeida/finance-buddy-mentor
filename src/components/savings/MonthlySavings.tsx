import React, { useEffect } from "react";
import { UserProfile } from "../../types/finance";
import MonthlySavingsHeader from "./MonthlySavingsHeader";
import MonthlySavingsContent from "./MonthlySavingsContent";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useMonthlySavingsState } from "../../hooks/savings/useMonthlySavingsState";

interface MonthlySavingsProps {
  profile: UserProfile;
  onSave?: (updatedProfile: UserProfile) => void;
  isSaving?: boolean;
}

const MonthlySavings: React.FC<MonthlySavingsProps> = ({
  profile,
  onSave,
  isSaving = false,
}) => {
  const {
    selectedYear,
    savingsData,
    editingMonth,
    error,
    handleSaveAmount,
    handleEditMonth,
    handleYearChange,
    setEditingMonth,
  } = useMonthlySavingsState(profile, onSave || (() => {}), isSaving);

  if (!profile || !profile.id) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>
          User profile is not available. Please log in to view your savings
          data.
        </AlertDescription>
      </Alert>
    );
  }

  // Extract financial data for auto-calculation
  const monthlyIncome = profile.monthlyIncome;
  const monthlyExpenses = profile.monthlyExpenses?.data || [];

  return (
    <div className='space-y-8'>
      <MonthlySavingsHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        disabled={isSaving}
      />

      <MonthlySavingsContent
        loadingData={false}
        savingsData={savingsData}
        editingMonth={editingMonth}
        onEditMonth={handleEditMonth}
        onSaveAmount={handleSaveAmount}
        onCancelEdit={() => setEditingMonth(null)}
        error={error}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
      />
    </div>
  );
};

export default MonthlySavings;
