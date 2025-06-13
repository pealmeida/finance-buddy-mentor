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
    loadingData,
    error,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
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

  return (
    <div className='space-y-8'>
      <MonthlySavingsHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        onSaveAll={handleSaveAll}
        disabled={loadingData || isSaving}
        isSaving={isSaving}
      />

      <MonthlySavingsContent
        loadingData={loadingData}
        savingsData={savingsData}
        editingMonth={editingMonth}
        onEditMonth={handleEditMonth}
        onSaveAmount={handleSaveAmount}
        onCancelEdit={() => setEditingMonth(null)}
        error={error}
      />
    </div>
  );
};

export default MonthlySavings;
