
import { useState } from 'react';
import { UserProfile, Investment } from '@/types/finance';
import { useInvestmentsData } from '@/hooks/investments/useInvestmentsData';
import { useTranslation } from 'react-i18next';

export const useInvestmentActions = (profile: UserProfile, onSave?: (updatedProfile: UserProfile) => void) => {
  const { t } = useTranslation();
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  
  const {
    investments,
    isLoading,
    error,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    fetchInvestments
  } = useInvestmentsData(profile?.id);

  const handleAddInvestment = async (investment: Omit<Investment, 'id'>) => {
    const success = await addInvestment(investment);
    
    if (success) {
      setIsAddingInvestment(false);
      
      if (onSave) {
        onSave({
          ...profile,
          investments: [...investments, investment as Investment]
        });
      }
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
      setIsEditDialogOpen(false);
      setSelectedInvestment(null);
      
      if (onSave) {
        const updatedInvestments = investments.map(inv => 
          inv.id === updatedInvestment.id ? updatedInvestment : inv
        );
        
        onSave({
          ...profile,
          investments: updatedInvestments
        });
      }
    }
    
    return success;
  };

  const handleDeleteInvestment = async (id: string) => {
    if (deleteConfirmationId === id) {
      const success = await deleteInvestment(id);
      
      if (success && onSave) {
        const updatedInvestments = investments.filter(inv => inv.id !== id);
        
        onSave({
          ...profile,
          investments: updatedInvestments
        });
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
    fetchInvestments
  };
};
