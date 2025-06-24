import { useState } from "react";
import { UserProfile, Investment } from "../../../types/finance";
import { useInvestmentsData } from "../../../hooks/investments/useInvestmentsData";
import { useTranslation } from "react-i18next";

export const useInvestmentActions = (
  profile: UserProfile,
  onSave?: (updatedProfile: UserProfile) => void
) => {
  const { t } = useTranslation();
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] =
    useState<Investment | null>(null);

  const {
    investments: fetchedInvestments,
    isLoading,
    error,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    fetchInvestments,
  } = useInvestmentsData(profile?.id);

  // Prioritize profile investments over fetched investments
  // Use profile data if available, otherwise fall back to fetched data
  const investments =
    profile?.investments && profile.investments.length > 0
      ? profile.investments
      : fetchedInvestments;
  const handleAddInvestment = async (investment: Omit<Investment, "id">) => {
    const success = await addInvestment(investment);
    if (success) {
      console.log("Investment added successfully, refreshing entire page...");
      // Refresh the entire page to ensure all data is up to date
      window.location.reload();
    }

    return success;
  };

  const handleEditInvestment = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsEditDialogOpen(true);
  };

  const handleUpdateInvestment = async (updatedInvestment: Investment) => {
    const success = await updateInvestment(updatedInvestment);
    if (success) {
      console.log("Investment updated successfully, refreshing entire page...");
      // Refresh the entire page to ensure all data is up to date
      window.location.reload();
    }

    return success;
  };

  const handleDeleteInvestment = (investment: Investment) => {
    setInvestmentToDelete(investment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!investmentToDelete) return;
    const success = await deleteInvestment(investmentToDelete.id);
    if (success) {
      console.log("Investment deleted successfully, refreshing entire page...");
      // Refresh the entire page to ensure all data is up to date
      window.location.reload();
    }

    setDeleteDialogOpen(false);
    setInvestmentToDelete(null);
  };

  return {
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
  };
};
