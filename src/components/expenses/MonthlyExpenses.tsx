
import React, { useState } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlyExpensesState } from '@/hooks/useMonthlyExpensesState';
import { MONTHS } from '@/constants/months';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import MonthlyExpensesHeader from './MonthlyExpensesHeader';
import MonthlyExpensesContent from './MonthlyExpensesContent';

interface MonthlyExpensesProps {
  profile: UserProfile;
  onSave?: (updatedProfile: UserProfile) => void;
  isSaving?: boolean;
}

const MonthlyExpenses: React.FC<MonthlyExpensesProps> = ({
  profile,
  onSave,
  isSaving = false
}) => {
  const {
    selectedYear,
    expensesData,
    editingMonth,
    loadingData,
    expensesLoading,
    error,
    authChecked,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    handleYearChange,
    refreshData,
    setEditingMonth
  } = useMonthlyExpensesState(profile, onSave || (() => {}), isSaving);

  if (!profile || !profile.id) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          User profile is not available. Please log in to view your expenses data.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <MonthlyExpensesHeader
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        onSaveAll={handleSaveAll}
        disabled={loadingData || isSaving || expensesLoading}
        isSaving={isSaving}
      />
      
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loadingData ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <span className="ml-2">Loading expenses data...</span>
        </div>
      ) : (
        <MonthlyExpensesContent
          loadingData={loadingData}
          expensesData={expensesData}
          editingMonth={editingMonth}
          onEditMonth={handleEditMonth}
          onSaveAmount={handleSaveAmount}
          onCancelEdit={() => setEditingMonth(null)}
          onRefresh={refreshData}
          error={error}
        />
      )}
    </div>
  );
};

export default MonthlyExpenses;
