
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/finance";
import { toast } from "@/components/ui/use-toast";
import { fetchUserProfileFromSupabase } from "@/utils/auth/profileFetcher";
import { validateRiskProfile } from "@/utils/auth/profileValidation";

interface SessionHandlerProps {
  setUserProfile: (profile: UserProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsProfileComplete: (complete: boolean) => void;
  setAuthChecked: (checked: boolean) => void;
}

/**
 * Hook to handle auth session state and changes
 */
export const useSessionHandler = ({
  setUserProfile,
  setIsLoading,
  setIsProfileComplete,
  setAuthChecked
}: SessionHandlerProps) => {
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
  }, [setUserProfile, setIsLoading, setIsProfileComplete, setAuthChecked]);
};
