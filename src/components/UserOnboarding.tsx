
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types/finance';
import { OnboardingProvider, useOnboarding } from '@/context/OnboardingContext';
import StepIndicator from './onboarding/StepIndicator';
import PersonalInfoStep from './onboarding/PersonalInfoStep';
import RiskProfileStep from './onboarding/RiskProfileStep';
import FinancialGoalsStep from './onboarding/FinancialGoalsStep';
import InvestmentsStep from './onboarding/InvestmentsStep';
import ReviewStep from './onboarding/ReviewStep';
import OnboardingNavigation from './onboarding/OnboardingNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface UserOnboardingProps {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile;
  isEditMode?: boolean;
}

const TOTAL_STEPS = 5;

const OnboardingContent: React.FC<UserOnboardingProps> = ({ onComplete, existingProfile, isEditMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { profile, updateProfile } = useOnboarding();
  const { saveUserProfile } = useSupabaseData();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

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
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    
    checkAuth();
  }, []);

  // Initialize onboarding context with existing profile data if in edit mode
  useEffect(() => {
    if (isEditMode && existingProfile) {
      console.log('Initializing onboarding with existing profile:', existingProfile);
      updateProfile(existingProfile);
    }
  }, [isEditMode, existingProfile, updateProfile]);
  
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
    try {
      if (!profile) {
        toast({
          title: "Error Saving Profile",
          description: "Profile data is missing. Please complete all required fields.",
          variant: "destructive"
        });
        return;
      }

      // Ensure we have all required properties with default values as needed
      const completeProfile: UserProfile = {
        id: userId || (existingProfile?.id || uuidv4()),
        email: profile.email || 'user@example.com',
        name: profile.name || 'User',
        age: profile.age || 0,
        monthlyIncome: profile.monthlyIncome || 0,
        riskProfile: profile.riskProfile || 'moderate',
        hasEmergencyFund: profile.hasEmergencyFund || false,
        hasDebts: profile.hasDebts || false,
        financialGoals: profile.financialGoals || [],
        investments: profile.investments || [],
        debtDetails: profile.debtDetails || [],
        emergencyFundMonths: profile.emergencyFundMonths
      };

      console.log('Completing onboarding with profile:', completeProfile);
      
      // Complete onboarding flow
      onComplete(completeProfile);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error Saving Profile",
        description: "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      />
    </div>
  );
};

const UserOnboarding: React.FC<UserOnboardingProps> = ({ onComplete, existingProfile, isEditMode }) => {
  return (
    <OnboardingProvider>
      <OnboardingContent onComplete={onComplete} existingProfile={existingProfile} isEditMode={isEditMode} />
    </OnboardingProvider>
  );
};

export default UserOnboarding;
