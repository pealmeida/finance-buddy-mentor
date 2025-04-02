
import React from 'react';
import { UserProfile } from '@/types/finance';
import { useMonthlySavingsState } from '@/hooks/useMonthlySavingsState';
import MonthlySavingsHeader from './MonthlySavingsHeader';
import MonthlySavingsContent from './MonthlySavingsContent';

interface MonthlySavingsProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
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
    savingsLoading,
    error,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    handleYearChange,
    setEditingMonth
  } = useMonthlySavingsState(profile, onSave, isSaving);

  return (
    <div className="space-y-6">
      <MonthlySavingsHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        onSaveAll={handleSaveAll}
        disabled={isSaving || savingsLoading || loadingData}
        isSaving={isSaving || savingsLoading}
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
