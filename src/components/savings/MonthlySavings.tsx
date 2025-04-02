
import React, { useEffect, useRef } from 'react';
import { UserProfile } from '@/types/finance';
import { useMonthlySavingsState } from '@/hooks/useMonthlySavingsState';
import MonthlySavingsHeader from './MonthlySavingsHeader';
import MonthlySavingsContent from './MonthlySavingsContent';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
  // Track if we've already done an initial refresh
  const hasRefreshed = useRef(false);
  
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
    refreshData,
    setEditingMonth
  } = useMonthlySavingsState(profile, onSave, isSaving);

  // Effect to trigger a refresh when profile ID changes, but only once
  useEffect(() => {
    if (profile?.id && authChecked && !hasRefreshed.current && !loadingData) {
      hasRefreshed.current = true;
      // No need to call refreshData() here - let the initial load in the hook handle it
    }
    
    return () => {
      // Reset the flag when component unmounts
      hasRefreshed.current = false;
    };
  }, [profile?.id, authChecked, loadingData]);

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
      <div className="flex justify-between items-center">
        <MonthlySavingsHeader
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          onSaveAll={handleSaveAll}
          disabled={isSaving || savingsLoading || loadingData || !profile?.id}
          isSaving={isSaving || savingsLoading}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={loadingData || !profile?.id}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <MonthlySavingsContent
        loadingData={loadingData}
        savingsData={savingsData || []}
        editingMonth={editingMonth}
        onEditMonth={handleEditMonth}
        onSaveAmount={handleSaveAmount}
        onCancelEdit={() => setEditingMonth(null)}
        error={error}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default MonthlySavings;
