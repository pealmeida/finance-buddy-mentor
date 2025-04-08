
import { MONTHS } from '@/constants/months';
import { useToast } from '@/components/ui/use-toast';

export const useExpensesToasts = () => {
  const { toast } = useToast();
  
  const showAmountUpdatedToast = (month: number) => {
    toast({
      title: "Expenses Updated",
      description: `Your expenses for ${MONTHS[month - 1]} have been updated.`
    });
  };
  
  const showAuthenticationErrorToast = () => {
    toast({
      title: "Not Logged In",
      description: "Please log in to save your data.",
      variant: "destructive"
    });
  };
  
  const showSessionExpiredToast = () => {
    toast({
      title: "Authentication Error",
      description: "Your session has expired. Please log in again.",
      variant: "destructive"
    });
  };
  
  const showSaveSuccessToast = (year: number) => {
    toast({
      title: "Expenses Saved",
      description: `Your expenses data for ${year} has been saved successfully.`
    });
  };
  
  const showSaveErrorToast = () => {
    toast({
      title: "Error",
      description: "There was a problem saving your expenses data. Please try again.",
      variant: "destructive"
    });
  };
  
  return {
    showAmountUpdatedToast,
    showAuthenticationErrorToast,
    showSessionExpiredToast,
    showSaveSuccessToast,
    showSaveErrorToast
  };
};
