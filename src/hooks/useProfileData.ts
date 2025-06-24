import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseData } from '@/hooks/useSupabaseData';

export function useProfileData(initialProfile: UserProfile) {
  // Create a default profile with all required fields - moved up before it's used
  const createDefaultProfile = useCallback((baseProfile: Partial<UserProfile> = {}): UserProfile => ({
    id: baseProfile.id || 'default-id',
    email: baseProfile.email || '',
    name: baseProfile.name || '',
    phone: baseProfile.phone || '',
    phoneVerified: baseProfile.phoneVerified || false,
    age: baseProfile.age || 0,
    monthlyIncome: baseProfile.monthlyIncome || 0,
    riskProfile: baseProfile.riskProfile || 'moderate',
    hasEmergencyFund: baseProfile.hasEmergencyFund ?? false,
    emergencyFundMonths: baseProfile.emergencyFundMonths || 0,
    hasDebts: baseProfile.hasDebts ?? false,
    financialGoals: baseProfile.financialGoals || [],
    investments: baseProfile.investments || [],
    debtDetails: baseProfile.debtDetails || [],
  }), []);

  const [profile, setProfile] = useState<UserProfile>(createDefaultProfile(initialProfile));
  const [userName, setUserName] = useState<string>(initialProfile.name || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { toast } = useToast();
  const { fetchUserProfile } = useSupabaseData();

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => {
      const updatedProfile = {
        ...prev,
        [field]: value
      };

      // Update userName if name field changes
      if (field === 'name') {
        setUserName(value as string || '');
      }

      return updatedProfile;
    });
  };

  // Fetch user data from Supabase
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (session?.user) {
        const { email, user_metadata, id } = session.user;
        const phone = session.user.phone || '';
        const phoneVerified = session.user.phone_confirmed_at ? true : false;

        // Get profile data from Supabase
        const supabaseProfile = await fetchUserProfile(id);

        // If we have Supabase profile data, use it
        if (supabaseProfile) {
          // Create a complete profile with all required fields
          const completeProfile = createDefaultProfile({
            ...supabaseProfile,
            id: supabaseProfile.id || id,
            email: supabaseProfile.email || email || '',
            name: supabaseProfile.name || (user_metadata?.name as string) || 'User',
            phone: phone,
            phoneVerified: phoneVerified,
          });

          setProfile(completeProfile);
          setUserName(completeProfile.name || '');
          return completeProfile;
        } else {
          // Fallback to localStorage data with session user data
          const updatedProfile = createDefaultProfile({
            ...profile,
            id,
            email: email || profile.email,
            name: (user_metadata?.name as string) || profile.name,
            phone: phone || profile.phone,
            phoneVerified: phoneVerified,
          });

          setProfile(updatedProfile);
          setUserName(updatedProfile.name || '');
          return updatedProfile;
        }
      } else {
        console.log('No active session found, using provided profile data');
        // No active session, but continue with the provided profile data
        const defaultProfile = createDefaultProfile(initialProfile);
        setProfile(defaultProfile);
        setUserName(defaultProfile.name || 'User');
        return defaultProfile;
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMsg);

      toast({
        title: "Error loading profile",
        description: err instanceof Error ? err.message : "Failed to load user profile data",
        variant: "destructive"
      });

      return null;
    } finally {
      setLoading(false);
    }
  }, [initialProfile, createDefaultProfile, fetchUserProfile, toast]);

  // Load user data on component mount
  useEffect(() => {
    // Prevent multiple fetches after the initial load
    if (hasLoaded) return;

    fetchUserData().then(updatedProfile => {
      if (updatedProfile) {
        setHasLoaded(true);
      }
    });
  }, [hasLoaded, fetchUserData]);

  return {
    profile,
    userName,
    loading,
    error,
    handleInputChange,
    createDefaultProfile
  };
}
