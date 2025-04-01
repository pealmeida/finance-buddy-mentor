
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserProfile, RiskProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseOnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
  isEditMode?: boolean;
  isSaving?: boolean;
  existingProfile?: UserProfile;
}

// Helper function to validate risk profile type
const validateRiskProfile = (profile: string | undefined): RiskProfile => {
  if (profile === 'conservative' || profile === 'moderate' || profile === 'aggressive') {
    return profile as RiskProfile;
  }
  return 'moderate'; // Default to moderate if invalid value
};

export function useOnboardingFlow({
  onComplete,
  isEditMode = false,
  isSaving = false,
  existingProfile
}: UseOnboardingFlowProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalSteps = 5;

  // Check for authenticated user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('Setting user ID:', session.user.id);
          setUserId(session.user.id);
        } else {
          console.log('No authenticated session found');
          // Show a toast to inform the user they need to be logged in
          toast({
            title: "Authentication Required",
            description: "You need to be logged in to save your profile.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    
    checkAuth();
  }, [toast]);

  // Check if there's a target step in the location state
  useEffect(() => {
    const state = location.state as { targetStep?: number } | undefined;
    if (state && state.targetStep && state.targetStep <= totalSteps) {
      setStep(state.targetStep);
    }
  }, [location]);

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCancel = () => {
    // Navigate to profile page when canceling in edit mode, otherwise go to dashboard
    navigate(isEditMode ? '/profile' : '/dashboard');
  };
  
  const handleComplete = async (profile: UserProfile | undefined) => {
    if (isSubmitting || isSaving || !profile) return; // Prevent duplicate submissions
    
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!session || !session.user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to save your profile. Please log in and try again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Ensure we have all required properties with default values as needed
      const completeProfile: UserProfile = {
        id: session.user.id, // Always use the authenticated user's ID
        email: profile.email || session.user.email || 'user@example.com',
        name: profile.name || (session.user.user_metadata?.name as string || 'User'),
        age: profile.age || 0,
        monthlyIncome: profile.monthlyIncome || 0,
        riskProfile: validateRiskProfile(profile.riskProfile),
        hasEmergencyFund: profile.hasEmergencyFund || false,
        hasDebts: profile.hasDebts || false,
        financialGoals: profile.financialGoals || [],
        investments: profile.investments || [],
        debtDetails: profile.debtDetails || [],
        emergencyFundMonths: profile.emergencyFundMonths
      };

      console.log('Completing onboarding with profile:', completeProfile);
      
      // Complete onboarding flow by calling the parent handler
      await onComplete(completeProfile);
      
      // Navigate to the appropriate page after completing
      navigate(isEditMode ? '/profile' : '/dashboard');
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error Saving Profile",
        description: error instanceof Error ? error.message : "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine our internal isSubmitting state with any parent-provided isSaving state
  const isLoading = isSubmitting || isSaving;

  return {
    step,
    totalSteps,
    handleNextStep,
    handlePrevStep,
    handleCancel,
    handleComplete,
    isEditMode,
    isLoading,
    userId,
  };
}
