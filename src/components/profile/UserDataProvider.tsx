
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface UserDataProviderProps {
  children: (props: {
    profile: UserProfile;
    userName: string;
    handleInputChange: (field: keyof UserProfile, value: any) => void;
  }) => React.ReactNode;
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const UserDataProvider: React.FC<UserDataProviderProps> = ({ 
  children, 
  userProfile, 
  onProfileUpdate
}) => {
  // Ensure we have a valid default profile with all required fields
  const createDefaultProfile = useCallback((baseProfile: Partial<UserProfile> = {}): UserProfile => ({
    id: baseProfile.id || 'default-id',
    email: baseProfile.email || '',
    name: baseProfile.name || '',
    age: baseProfile.age || 0,
    monthlyIncome: baseProfile.monthlyIncome || 0,
    riskProfile: baseProfile.riskProfile || 'moderate',
    hasEmergencyFund: baseProfile.hasEmergencyFund || false,
    hasDebts: baseProfile.hasDebts || false,
    financialGoals: baseProfile.financialGoals || [],
    investments: baseProfile.investments || [],
    debtDetails: baseProfile.debtDetails || []
  }), []);

  // Initialize with a complete profile
  const [profile, setProfile] = useState<UserProfile>(createDefaultProfile(userProfile));
  const [userName, setUserName] = useState<string>(userProfile.name || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { toast } = useToast();
  const { fetchUserProfile } = useSupabaseData();
  
  // Fetch current user email and name from Supabase auth
  useEffect(() => {
    // Prevent multiple fetches after the initial load
    if (hasLoaded) return;

    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        
        if (session?.user) {
          const { email, user_metadata, id } = session.user;
          
          // Get profile data from Supabase
          const supabaseProfile = await fetchUserProfile(id);
          
          // If we have Supabase profile data, use it
          if (supabaseProfile) {
            console.log('Loaded profile from Supabase:', supabaseProfile);
            // Create a complete profile with all required fields
            const completeProfile = createDefaultProfile({
              ...supabaseProfile,
              id: supabaseProfile.id || id,
              email: supabaseProfile.email || email || '',
              name: supabaseProfile.name || (user_metadata?.name as string) || 'User',
            });
            
            setProfile(completeProfile);
            setUserName(completeProfile.name);
            // Update app-level profile state
            onProfileUpdate(completeProfile);
          } else {
            // Fallback to localStorage data with session user data
            const updatedProfile = createDefaultProfile({
              ...profile,
              id,
              email: email || profile.email,
              name: (user_metadata?.name as string) || profile.name,
            });
            
            setProfile(updatedProfile);
            setUserName(updatedProfile.name);
          }
        } else {
          console.log('No active session found, using provided profile data');
          // No active session, but continue with the provided profile data
          const defaultProfile = createDefaultProfile(userProfile);
          setProfile(defaultProfile);
          setUserName(defaultProfile.name || 'User');
        }
        
        setHasLoaded(true);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        
        toast({
          title: "Error loading profile",
          description: err instanceof Error ? err.message : "Failed to load user profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userProfile, hasLoaded, createDefaultProfile, fetchUserProfile, onProfileUpdate, profile, toast]);
  
  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => {
      const updatedProfile = {
        ...prev,
        [field]: value
      };
      
      // Update userName if name field changes
      if (field === 'name') {
        setUserName(value || '');
      }
      
      return updatedProfile;
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-md">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}. Please try refreshing the page or signing in again.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      {children({ profile, userName, handleInputChange })}
    </>
  );
};

export default UserDataProvider;
