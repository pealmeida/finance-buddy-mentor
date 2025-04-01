
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, RiskProfile } from "@/types/finance";

// Helper function to validate risk profile type
const validateRiskProfile = (profile: string | null): RiskProfile => {
  if (profile === 'conservative' || profile === 'moderate' || profile === 'aggressive') {
    return profile as RiskProfile;
  }
  return 'moderate'; // Default to moderate if invalid value
};

// Helper function to get user profile from Supabase
const fetchUserProfileFromSupabase = async (userId: string) => {
  try {
    // Fetch basic profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }
    
    // Fetch financial profile
    const { data: financialProfileData, error: financialProfileError } = await supabase
      .from('financial_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (financialProfileError && financialProfileError.code !== 'PGRST116') {
      throw new Error(`Error fetching financial profile: ${financialProfileError.message}`);
    }
    
    // Create a new profile if it doesn't exist
    if (!profileData) {
      return null;
    }
    
    // Fetch the related data
    const { data: goalsData } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId);
      
    const { data: investmentsData } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId);
      
    const { data: debtDetailsData } = await supabase
      .from('debt_details')
      .select('*')
      .eq('user_id', userId);
    
    // Transform goals data
    const financialGoals = goalsData ? goalsData.map((goal: any) => ({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      targetDate: new Date(goal.target_date),
      priority: goal.priority as 'low' | 'medium' | 'high'
    })) : [];
    
    // Transform investments data
    const investments = investmentsData ? investmentsData.map((investment: any) => ({
      id: investment.id,
      type: investment.type as 'stocks' | 'bonds' | 'realEstate' | 'cash' | 'crypto' | 'other',
      name: investment.name,
      value: investment.value,
      annualReturn: investment.annual_return
    })) : [];
    
    // Transform debt details data
    const debtDetails = debtDetailsData ? debtDetailsData.map((debt: any) => ({
      id: debt.id,
      type: debt.type as 'creditCard' | 'personalLoan' | 'studentLoan' | 'other',
      name: debt.name,
      amount: debt.amount,
      interestRate: debt.interest_rate
    })) : [];
    
    // Ensure riskProfile is a valid RiskProfile type
    const riskProfile = validateRiskProfile(financialProfileData?.risk_profile);
    
    // Combine data from both tables into a user profile object
    return {
      id: profileData.id || userId,
      email: profileData.email || 'user@example.com',
      name: profileData.name || 'User',
      age: profileData.age || 0,
      monthlyIncome: financialProfileData?.monthly_income || 0,
      riskProfile: riskProfile,
      hasEmergencyFund: financialProfileData?.has_emergency_fund || false,
      emergencyFundMonths: financialProfileData?.emergency_fund_months,
      hasDebts: financialProfileData?.has_debts || false,
      financialGoals,
      investments,
      debtDetails,
    };
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
};

export function useAuth() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (event === 'SIGNED_IN' && session?.user) {
              try {
                // Allow a small delay to ensure the database has been updated
                setTimeout(async () => {
                  const profile = await fetchUserProfileFromSupabase(session.user.id);
                  
                  if (profile) {
                    console.log('Profile loaded after sign in:', profile);
                    // Check if profile is complete enough to skip onboarding
                    const profileIsComplete = 
                      profile.monthlyIncome > 0 && 
                      profile.age > 0 && 
                      profile.riskProfile !== undefined;
                    
                    setIsProfileComplete(profileIsComplete);
                    setUserProfile(profile);
                    localStorage.setItem('userProfile', JSON.stringify(profile));
                  } else {
                    // If no profile exists yet, create a minimal one with auth data
                    const minimalProfile: UserProfile = {
                      id: session.user.id,
                      email: session.user.email || '',
                      name: session.user.user_metadata?.name || '',
                      age: 0,
                      monthlyIncome: 0,
                      riskProfile: 'moderate',
                      hasEmergencyFund: false,
                      hasDebts: false,
                      financialGoals: [],
                      investments: [],
                      debtDetails: [],
                    };
                    console.log('Creating minimal profile:', minimalProfile);
                    setIsProfileComplete(false);
                    setUserProfile(minimalProfile);
                    localStorage.setItem('userProfile', JSON.stringify(minimalProfile));
                  }
                }, 500);
              } catch (error) {
                console.error('Error loading profile after auth change:', error);
              }
            } else if (event === 'SIGNED_OUT') {
              console.log('User signed out, clearing profile');
              setUserProfile(null);
              setIsProfileComplete(false);
              localStorage.removeItem('userProfile');
            }
          }
        );
        
        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          console.log('Existing session found for user:', session.user.id);
          
          // Try to get their profile from Supabase
          const profile = await fetchUserProfileFromSupabase(session.user.id);
          
          if (profile) {
            console.log('Existing profile loaded:', profile);
            // Check if profile is complete enough to skip onboarding
            const profileIsComplete = 
              profile.monthlyIncome > 0 && 
              profile.age > 0 && 
              profile.riskProfile !== undefined;
            
            setIsProfileComplete(profileIsComplete);
            setUserProfile(profile);
            localStorage.setItem('userProfile', JSON.stringify(profile));
          } else {
            // No profile in Supabase, check localStorage as fallback
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
              try {
                const parsedProfile = JSON.parse(savedProfile);
                // Ensure the profile has the user's ID and valid riskProfile
                parsedProfile.id = session.user.id;
                
                // Validate the riskProfile
                parsedProfile.riskProfile = validateRiskProfile(parsedProfile.riskProfile);
                
                console.log('Using local profile:', parsedProfile);
                
                // Check if profile is complete enough to skip onboarding
                const profileIsComplete = 
                  parsedProfile.monthlyIncome > 0 && 
                  parsedProfile.age > 0 && 
                  parsedProfile.riskProfile !== undefined;
                
                setIsProfileComplete(profileIsComplete);
                setUserProfile(parsedProfile);
              } catch (e) {
                console.error("Error parsing stored profile", e);
                toast({
                  title: "Error loading profile",
                  description: "There was a problem loading your saved profile. Please complete your profile again.",
                  variant: "destructive",
                });
                setIsProfileComplete(false);
              }
            } else {
              // Create a minimal profile with auth data
              const minimalProfile: UserProfile = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || '',
                age: 0,
                monthlyIncome: 0,
                riskProfile: 'moderate',
                hasEmergencyFund: false,
                hasDebts: false,
                financialGoals: [],
                investments: [],
                debtDetails: [],
              };
              console.log('Creating minimal profile from session:', minimalProfile);
              setIsProfileComplete(false);
              setUserProfile(minimalProfile);
              localStorage.setItem('userProfile', JSON.stringify(minimalProfile));
            }
          }
        } else {
          // No authenticated user, check for localStorage fallback
          const savedProfile = localStorage.getItem('userProfile');
          if (savedProfile) {
            try {
              const parsedProfile = JSON.parse(savedProfile);
              
              // Validate the riskProfile
              parsedProfile.riskProfile = validateRiskProfile(parsedProfile.riskProfile);
              
              console.log('Using local profile (no auth):', parsedProfile);
              setUserProfile(parsedProfile);
              
              // Check if profile is complete
              const profileIsComplete = 
                parsedProfile.monthlyIncome > 0 && 
                parsedProfile.age > 0 && 
                parsedProfile.riskProfile !== undefined;
              
              setIsProfileComplete(profileIsComplete);
            } catch (e) {
              console.error("Error parsing stored profile", e);
              setUserProfile(null);
              setIsProfileComplete(false);
            }
          } else {
            console.log('No profile found, user needs to sign in');
            setUserProfile(null);
            setIsProfileComplete(false);
          }
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (e) {
        console.error("Error checking auth or loading profile:", e);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile. Please try logging in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, []);

  const handleProfileComplete = (profile: UserProfile) => {
    // Save profile in state and localStorage
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    // Update profile in state and localStorage
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return {
    userProfile,
    isLoading,
    isProfileComplete,
    authChecked,
    handleProfileComplete,
    handleProfileUpdate
  };
}
