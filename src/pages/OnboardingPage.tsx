
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import UserOnboarding from '@/components/UserOnboarding';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingPageProps {
  onProfileComplete: (profile: UserProfile) => void;
  userProfile?: UserProfile;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onProfileComplete, userProfile }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(userProfile);
  
  // Save profile to Supabase database
  const saveProfileToSupabase = async (profile: UserProfile): Promise<boolean> => {
    try {
      const { id: userId, email, name, age } = profile;
      
      if (!userId) {
        throw new Error("Profile must have a valid ID");
      }
      
      console.log('Saving profile for user:', userId);
      console.log('Profile data:', profile);
      
      // Validate important profile data
      if (!name) throw new Error("Name is required");
      if (!email) throw new Error("Email is required");
      if (!profile.riskProfile) throw new Error("Risk profile is required");
      
      // Upsert basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          name, 
          email,
          age: age || 0
        }, {
          onConflict: 'id'
        });
      
      if (profileError) throw new Error(`Error saving profile: ${profileError.message}`);
      console.log('Basic profile saved successfully');
      
      // Upsert financial profile
      const { error: financialProfileError } = await supabase
        .from('financial_profiles')
        .upsert({
          id: userId,
          monthly_income: profile.monthlyIncome || 0,
          risk_profile: profile.riskProfile,
          has_emergency_fund: profile.hasEmergencyFund,
          emergency_fund_months: profile.emergencyFundMonths,
          has_debts: profile.hasDebts
        }, {
          onConflict: 'id'
        });
      
      if (financialProfileError) throw new Error(`Error saving financial profile: ${financialProfileError.message}`);
      console.log('Financial profile saved successfully');
      
      // Handle financial goals
      if (profile.financialGoals && profile.financialGoals.length > 0) {
        // First delete existing goals to avoid duplications
        const { error: deleteGoalsError } = await supabase
          .from('financial_goals')
          .delete()
          .eq('user_id', userId);
        
        if (deleteGoalsError) throw new Error(`Error clearing existing goals: ${deleteGoalsError.message}`);
        
        // Now insert new goals
        const goalsToInsert = profile.financialGoals.map(goal => ({
          id: goal.id,
          user_id: userId,
          name: goal.name,
          priority: goal.priority,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          target_date: goal.targetDate instanceof Date 
            ? goal.targetDate.toISOString().split('T')[0] 
            : new Date(goal.targetDate).toISOString().split('T')[0]
        }));
        
        const { error: goalsError } = await supabase
          .from('financial_goals')
          .insert(goalsToInsert);
        
        if (goalsError) throw new Error(`Error saving financial goals: ${goalsError.message}`);
        console.log('Financial goals saved successfully');
      }
      
      // Handle investments
      if (profile.investments && profile.investments.length > 0) {
        // First delete existing investments
        const { error: deleteInvestmentsError } = await supabase
          .from('investments')
          .delete()
          .eq('user_id', userId);
        
        if (deleteInvestmentsError) throw new Error(`Error clearing existing investments: ${deleteInvestmentsError.message}`);
        
        // Now insert new investments
        const investmentsToInsert = profile.investments.map(investment => ({
          id: investment.id,
          user_id: userId,
          type: investment.type,
          name: investment.name,
          value: investment.value,
          annual_return: investment.annualReturn
        }));
        
        const { error: investmentsError } = await supabase
          .from('investments')
          .insert(investmentsToInsert);
        
        if (investmentsError) throw new Error(`Error saving investments: ${investmentsError.message}`);
        console.log('Investments saved successfully');
      }
      
      // Handle debt details
      if (profile.debtDetails && profile.debtDetails.length > 0) {
        // First delete existing debt details
        const { error: deleteDebtDetailsError } = await supabase
          .from('debt_details')
          .delete()
          .eq('user_id', userId);
        
        if (deleteDebtDetailsError) throw new Error(`Error clearing existing debt details: ${deleteDebtDetailsError.message}`);
        
        // Now insert new debt details
        const debtDetailsToInsert = profile.debtDetails.map(debt => ({
          id: debt.id,
          user_id: userId,
          type: debt.type,
          name: debt.name,
          amount: debt.amount,
          interest_rate: debt.interestRate
        }));
        
        const { error: debtDetailsError } = await supabase
          .from('debt_details')
          .insert(debtDetailsToInsert);
        
        if (debtDetailsError) throw new Error(`Error saving debt details: ${debtDetailsError.message}`);
        console.log('Debt details saved successfully');
      }
      
      return true;
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw error;
    }
  };
  
  // Check if we're editing an existing profile or creating a new one
  const handleProfileComplete = async (profile: UserProfile) => {
    try {
      if (isSubmitting) return; // Prevent duplicate submissions
      
      setIsSubmitting(true);
      
      // Check for authenticated user first
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Create updated profile with auth user info if available
      let profileWithId: UserProfile = { ...profile };
      
      if (session?.user) {
        console.log('Session user found, using their ID for the profile:', session.user.id);
        profileWithId = {
          ...profile,
          id: session.user.id,
          email: session.user.email || profile.email || 'user@example.com',
          name: profile.name || (session.user.user_metadata?.name as string) || 'User',
        };
        
        // Save profile to Supabase
        console.log('About to save profile to Supabase:', profileWithId);
        const success = await saveProfileToSupabase(profileWithId);
        
        if (!success) {
          throw new Error("Failed to save profile to database");
        }
        console.log('Profile saved to Supabase successfully');
      } else {
        // No auth session, use existing ID if available or placeholder
        console.log('No session found, using local profile data');
        profileWithId = {
          ...profile,
          id: (isEditMode && userProfile?.id) ? userProfile.id : 'user-id',
          email: profile.email || (isEditMode && userProfile?.email ? userProfile.email : 'user@example.com'),
        };
      }
      
      // Pass the profile to parent component
      onProfileComplete(profileWithId);
      
      // Show success message
      toast({
        title: isEditMode ? "Profile updated!" : "Profile completed!",
        description: isEditMode 
          ? "Your financial profile has been updated successfully."
          : "Your financial profile has been set up successfully.",
        duration: 3000,
      });
      
      // Navigate to the appropriate page
      navigate(isEditMode ? '/profile' : '/dashboard');
    } catch (err) {
      console.error("Error completing profile:", err);
      toast({
        title: "Error saving profile",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={isEditMode} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isEditMode ? "Update Your Financial Profile" : "Complete Your Financial Profile"}
            </h1>
            <p className="text-gray-600">
              {isEditMode 
                ? "Make changes to your financial information and preferences" 
                : "Let's collect some information to personalize your financial recommendations"}
            </p>
          </div>
          
          <UserOnboarding 
            onComplete={handleProfileComplete} 
            existingProfile={userProfile} 
            isEditMode={isEditMode}
            isSaving={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
