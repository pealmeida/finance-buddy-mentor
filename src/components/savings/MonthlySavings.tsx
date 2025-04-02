
import React from 'react';
import { UserProfile } from '@/types/finance';
import { useMonthlySavingsState } from '@/hooks/useMonthlySavingsState';
import MonthlySavingsHeader from './MonthlySavingsHeader';
import MonthlySavingsContent from './MonthlySavingsContent';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  // Initialize the state hook even if profile is not valid
  // This allows us to handle the auth check within the hook
  const {
    selectedYear,
    savingsData,
    editingMonth,
    loadingData,
    savingsLoading,
    error,
    authChecked,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    handleYearChange,
    setEditingMonth
  } = useMonthlySavingsState(profile, onSave, isSaving);

  // Display authentication error if profile is invalid and auth check is complete
  if (authChecked && (!profile || !profile.id)) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            User profile is not available. Please log in to view your savings data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MonthlySavingsHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        onSaveAll={handleSaveAll}
        disabled={isSaving || savingsLoading || loadingData || !profile?.id}
        isSaving={isSaving || savingsLoading}
      />
      
      <MonthlySavingsContent
        loadingData={loadingData}
        savingsData={savingsData || []}
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
