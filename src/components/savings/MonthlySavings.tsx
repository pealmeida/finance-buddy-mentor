
import React from 'react';
import { UserProfile } from '@/types/finance';
import { useMonthlySavingsState } from '@/hooks/useMonthlySavingsState';
import MonthlySavingsHeader from './savings-components/MonthlySavingsHeader';
import MonthlySavingsContent from './MonthlySavingsContent';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MonthlySavingsProps {
  profile: UserProfile;
  onSave?: (updatedProfile: UserProfile) => void;
  isSaving?: boolean;
}

const MonthlySavings: React.FC<MonthlySavingsProps> = ({
  profile,
  onSave,
  isSaving = false
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
    refreshData,
    setEditingMonth
  } = useMonthlySavingsState(
    profile,
    onSave || (() => {}),
    isSaving
  );

  if (!profile || !profile.id) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          User profile is not available. Please log in to view your savings data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
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
        onRefresh={refreshData}
        error={error}
      />
    </div>
  );
};

export default MonthlySavings;
