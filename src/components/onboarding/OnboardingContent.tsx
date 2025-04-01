
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserProfile, RiskProfile } from '@/types/finance';
import { useOnboarding } from '@/context/OnboardingContext';
import StepIndicator from './StepIndicator';
import PersonalInfoStep from './PersonalInfoStep';
import RiskProfileStep from './RiskProfileStep';
import FinancialGoalsStep from './FinancialGoalsStep';
import InvestmentsStep from './InvestmentsStep';
import ReviewStep from './ReviewStep';
import OnboardingNavigation from './OnboardingNavigation';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingContentProps {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile;
  isEditMode?: boolean;
  isSaving?: boolean;
}

const TOTAL_STEPS = 5;

// Helper function to validate risk profile type
const validateRiskProfile = (profile: string | undefined): RiskProfile => {
  if (profile === 'conservative' || profile === 'moderate' || profile === 'aggressive') {
    return profile as RiskProfile;
  }
  return 'moderate'; // Default to moderate if invalid value
};

const OnboardingContent: React.FC<OnboardingContentProps> = ({ 
  onComplete, 
  existingProfile, 
  isEditMode,
  isSaving = false 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { profile, updateProfile } = useOnboarding();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileInitialized, setProfileInitialized] = useState(false);

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

  // Initialize onboarding context with existing profile data if in edit mode
  useEffect(() => {
    if (isEditMode && existingProfile && !profileInitialized) {
      console.log('Initializing onboarding with existing profile:', existingProfile);
      updateProfile(existingProfile);
      setProfileInitialized(true);
    }
  }, [isEditMode, existingProfile, updateProfile, profileInitialized]);
  
  // Check if there's a target step in the location state
  useEffect(() => {
    const state = location.state as { targetStep?: number } | undefined;
    if (state && state.targetStep && state.targetStep <= TOTAL_STEPS) {
      setStep(state.targetStep);
    }
  }, [location]);

  const handleNextStep = () => {
    if (step < TOTAL_STEPS) {
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
    navigate('/profile');
  };
  
  const handleComplete = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions
    
    setIsSubmitting(true);
    
    try {
      if (!profile) {
        toast({
          title: "Error Saving Profile",
          description: "Profile data is missing. Please complete all required fields.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

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
      onComplete(completeProfile);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error Saving Profile",
        description: error instanceof Error ? error.message : "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Combine our internal isSubmitting state with any parent-provided isSaving state
  const isLoading = isSubmitting || isSaving;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
      
      <div className="glass-panel rounded-2xl p-8 mb-8 animate-scale-in">
        {step === 1 && <PersonalInfoStep />}
        {step === 2 && <RiskProfileStep />}
        {step === 3 && <FinancialGoalsStep />}
        {step === 4 && <InvestmentsStep />}
        {step === 5 && <ReviewStep />}
      </div>
      
      <OnboardingNavigation 
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        onNext={handleNextStep}
        onPrevious={handlePrevStep}
        onComplete={handleComplete}
        onCancel={isEditMode ? handleCancel : undefined}
        isEditMode={isEditMode}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OnboardingContent;
