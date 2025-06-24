import React, { useState, useMemo } from "react";
import { UserProfile } from "../../types/finance";
import { Alert, AlertDescription } from "../ui/alert";
import { useTranslation } from "react-i18next";
import InvestmentHeader from "./InvestmentHeader";
import InvestmentGrid from "./InvestmentGrid";
import InvestmentError from "./InvestmentError";
import InvestmentLoading from "./InvestmentLoading";
import EmptyInvestments from "./EmptyInvestments";
import EditInvestmentDialog from "./EditInvestmentDialog";
import AddInvestmentDialog from "./AddInvestmentDialog";
import InvestmentDeleteConfirmDialog from "./InvestmentDeleteConfirmDialog";
import EmergencyFundInvestmentDialog from "../dashboard/EmergencyFundInvestmentDialog";
import { useInvestmentActions } from "./hooks/useInvestmentActions";

interface InvestmentsProps {
  profile: UserProfile;
  onSave?: (updatedProfile: UserProfile) => void;
  isSaving?: boolean;
}

const Investments: React.FC<InvestmentsProps> = ({
  profile,
  onSave,
  isSaving = false,
}) => {
  const { t } = useTranslation();
  const [showEmergencyFundDialog, setShowEmergencyFundDialog] = useState(false);
  const [emergencyFundInitialValues, setEmergencyFundInitialValues] =
    useState<any>(null);

  const {
    investments,
    isLoading,
    error,
    isAddingInvestment,
    setIsAddingInvestment,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedInvestment,
    setSelectedInvestment,
    deleteDialogOpen,
    setDeleteDialogOpen,
    investmentToDelete,
    handleAddInvestment,
    handleEditInvestment,
    handleUpdateInvestment,
    handleDeleteInvestment,
    handleConfirmDelete,
  } = useInvestmentActions(profile, onSave);

  // Calculate emergency fund amount
  const emergencyFundAmount = useMemo(() => {
    if (
      profile.hasEmergencyFund &&
      profile.emergencyFundMonths &&
      profile.monthlyIncome
    ) {
      return profile.monthlyIncome * profile.emergencyFundMonths;
    }
    return 0;
  }, [
    profile.hasEmergencyFund,
    profile.emergencyFundMonths,
    profile.monthlyIncome,
  ]);

  // Check if emergency fund should be shown as option
  const shouldShowEmergencyFundOption = useMemo(() => {
    return (
      profile.hasEmergencyFund &&
      emergencyFundAmount > 0 &&
      !investments.some(
        (inv) =>
          inv.name.toLowerCase().includes("emergency") ||
          inv.name.toLowerCase().includes("emergência")
      )
    );
  }, [profile.hasEmergencyFund, emergencyFundAmount, investments]);

  const handleAddEmergencyFundToInvestments = () => {
    // Set initial values for emergency fund investment
    setEmergencyFundInitialValues({
      name: t("investments.emergencyFundInvestment", "Emergency Fund"),
      type: "cash",
      value: emergencyFundAmount,
      isEmergencyFund: true,
      purchaseDate: new Date().toISOString().split("T")[0],
    });

    // Open the regular add investment dialog with pre-filled values
    setIsAddingInvestment(true);
    setShowEmergencyFundDialog(false);
  };

  if (!profile || !profile.id) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>
          {t(
            "investments.userProfileError",
            "User profile is not available. Please log in to view your investments."
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-8'>
      <InvestmentHeader
        onAddClick={() => setIsAddingInvestment(true)}
        isLoading={isLoading}
        isSaving={isSaving}
        onAddEmergencyFund={() => setShowEmergencyFundDialog(true)}
        showEmergencyFundOption={shouldShowEmergencyFundOption}
      />

      {error ? (
        <InvestmentError error={error} />
      ) : isLoading ? (
        <InvestmentLoading />
      ) : (
        <>
          <AddInvestmentDialog
            isOpen={isAddingInvestment}
            onOpenChange={(open) => {
              setIsAddingInvestment(open);
              if (!open) {
                setEmergencyFundInitialValues(null);
              }
            }}
            onSubmit={handleAddInvestment}
            isSubmitting={isSaving}
            initialValues={emergencyFundInitialValues}
            userPreferredCurrency={profile.preferredCurrency}
          />

          {investments.length === 0 && !isAddingInvestment ? (
            <EmptyInvestments onAddClick={() => setIsAddingInvestment(true)} />
          ) : (
            <InvestmentGrid
              investments={investments}
              onEdit={handleEditInvestment}
              onDelete={handleDeleteInvestment}
            />
          )}
        </>
      )}

      <EditInvestmentDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        investment={selectedInvestment}
        onSubmit={handleUpdateInvestment}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setSelectedInvestment(null);
        }}
        isSaving={isSaving}
        userPreferredCurrency={profile.preferredCurrency}
      />

      {/* Delete Confirmation Dialog */}
      <InvestmentDeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        investment={investmentToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isSaving}
      />

      {/* Emergency Fund Investment Dialog */}
      <EmergencyFundInvestmentDialog
        isOpen={showEmergencyFundDialog}
        onClose={() => setShowEmergencyFundDialog(false)}
        emergencyFundAmount={emergencyFundAmount}
        onOpenInvestmentDialog={handleAddEmergencyFundToInvestments}
      />
    </div>
  );
};

export default Investments;
