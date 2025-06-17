import { useState } from "react";
import { UserProfile, Investment } from "@/types/finance";
import { useInvestmentsData } from "@/hooks/investments/useInvestmentsData";
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
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);

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

  console.log(
    "useInvestmentActions: Profile investments:",
    profile?.investments
  );
  console.log("useInvestmentActions: Fetched investments:", fetchedInvestments);
  console.log("useInvestmentActions: Using investments:", investments);

  const handleAddInvestment = async (investment: Omit<Investment, "id">) => {
    console.log("handleAddInvestment called with:", investment);
    const success = await addInvestment(investment);
    console.log("addInvestment result:", success);

    if (success) {
      console.log("Investment added successfully, refreshing data...");
      // Force refresh the investments data
      await fetchInvestments();
      setIsAddingInvestment(false);

      // Don't call onSave - the investment is already saved to database
      // The profile system will pick up the changes through fetchInvestments
      console.log("Investment added, skipping profile save to avoid conflicts");
    }

    return success;
  };

  const handleEditInvestment = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsEditDialogOpen(true);
  };

  const handleUpdateInvestment = async (updatedInvestment: Investment) => {
    console.log("handleUpdateInvestment called with:", updatedInvestment);
    const success = await updateInvestment(updatedInvestment);
    console.log("updateInvestment result:", success);

    if (success) {
      console.log("Investment updated successfully, refreshing data...");
      // Force refresh the investments data
      await fetchInvestments();
      setIsEditDialogOpen(false);
      setSelectedInvestment(null);

      // Don't call onSave - the investment is already saved to database
      console.log(
        "Investment updated, skipping profile save to avoid conflicts"
      );
    }

    return success;
  };

  const handleDeleteInvestment = async (id: string) => {
    if (deleteConfirmationId === id) {
      console.log("handleDeleteInvestment called with id:", id);
      const success = await deleteInvestment(id);
      console.log("deleteInvestment result:", success);

      if (success) {
        console.log("Investment deleted successfully, refreshing data...");
        // Force refresh the investments data
        await fetchInvestments();

        // Don't call onSave - the investment is already deleted from database
        console.log(
          "Investment deleted, skipping profile save to avoid conflicts"
        );
      }

      setDeleteConfirmationId(null);
    } else {
      setDeleteConfirmationId(id);

      // Auto-reset confirmation after 3 seconds
      setTimeout(() => {
        setDeleteConfirmationId(null);
      }, 3000);
    }
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
    deleteConfirmationId,
    handleAddInvestment,
    handleEditInvestment,
    handleUpdateInvestment,
    handleDeleteInvestment,
    fetchInvestments,
  };
};
