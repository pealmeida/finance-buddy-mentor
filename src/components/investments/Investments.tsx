
import React, { useState } from 'react';
import { UserProfile, Investment } from '@/types/finance';
import { useInvestmentsData } from '@/hooks/useInvestmentsData';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import InvestmentForm from './InvestmentForm';
import InvestmentCard from './InvestmentCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

interface InvestmentsProps {
  profile: UserProfile;
  onSave?: (updatedProfile: UserProfile) => void;
  isSaving?: boolean;
}

const Investments: React.FC<InvestmentsProps> = ({
  profile,
  onSave,
  isSaving = false
}) => {
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

  if (!profile || !profile.id) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {t('investments.userProfileError', 'User profile is not available. Please log in to view your investments.')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{t('investments.portfolioTitle', 'Investment Portfolio')}</h2>
          <p className="text-gray-600">
            {t('investments.portfolioDescription', 'Manage your investments and track their performance.')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddingInvestment(true)}
            disabled={isLoading || isSaving}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('investments.addInvestment', 'Add Investment')}
          </Button>
          
          <Button
            variant="outline"
            onClick={fetchInvestments}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? t('common.loading', 'Loading...') : t('common.refresh', 'Refresh')}
          </Button>
        </div>
      </div>
      
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">{t('investments.loadingData', 'Loading investments data...')}</span>
        </div>
      ) : (
        <>
          {isAddingInvestment && (
            <InvestmentForm
              onSubmit={handleAddInvestment}
              onCancel={() => setIsAddingInvestment(false)}
              isSubmitting={isSaving}
            />
          )}
          
          {investments.length === 0 && !isAddingInvestment ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <h3 className="text-gray-600 font-medium mb-2">{t('investments.noInvestmentsYet', 'No Investments Yet')}</h3>
              <p className="text-gray-500 mb-4">{t('investments.startBuilding', 'Start building your portfolio by adding your first investment.')}</p>
              <Button 
                onClick={() => setIsAddingInvestment(true)}
                variant="outline"
                className="bg-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('investments.addFirstInvestment', 'Add Your First Investment')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {investments.map((investment) => (
                <InvestmentCard
                  key={investment.id}
                  investment={investment}
                  onEdit={handleEditInvestment}
                  onDelete={handleDeleteInvestment}
                  deleteConfirmationId={deleteConfirmationId}
                />
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Edit Investment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('investments.editInvestment', 'Edit Investment')}</DialogTitle>
          </DialogHeader>
          {selectedInvestment && (
            <InvestmentForm
              initialInvestment={selectedInvestment}
              onSubmit={handleUpdateInvestment}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedInvestment(null);
              }}
              isSubmitting={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Investments;
