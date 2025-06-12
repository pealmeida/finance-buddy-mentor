import React from "react";
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
    deleteConfirmationId,
    handleAddInvestment,
    handleEditInvestment,
    handleUpdateInvestment,
    handleDeleteInvestment,
  } = useInvestmentActions(profile, onSave);

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
      />

      {error ? (
        <InvestmentError error={error} />
      ) : isLoading ? (
        <InvestmentLoading />
      ) : (
        <>
          <AddInvestmentDialog
            isOpen={isAddingInvestment}
            onOpenChange={setIsAddingInvestment}
            onSubmit={handleAddInvestment}
            isSubmitting={isSaving}
          />

          {investments.length === 0 && !isAddingInvestment ? (
            <EmptyInvestments onAddClick={() => setIsAddingInvestment(true)} />
          ) : (
            <InvestmentGrid
              investments={investments}
              onEdit={handleEditInvestment}
              onDelete={handleDeleteInvestment}
              deleteConfirmationId={deleteConfirmationId}
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
      />
    </div>
  );
};

export default Investments;
