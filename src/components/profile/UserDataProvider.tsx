
import React, { useState, useEffect } from 'react';
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
  // Ensure we start with a complete UserProfile by providing default values for all required fields
  const [profile, setProfile] = useState<UserProfile>({
    ...userProfile,
    id: userProfile.id,
    email: userProfile.email || '',
    name: userProfile.name || '',
    age: userProfile.age || 0,
    monthlyIncome: userProfile.monthlyIncome || 0,
    riskProfile: userProfile.riskProfile || 'moderate',
    hasEmergencyFund: userProfile.hasEmergencyFund || false,
    hasDebts: userProfile.hasDebts || false,
    financialGoals: userProfile.financialGoals || [],
    investments: userProfile.investments || [],
    debtDetails: userProfile.debtDetails || []
  });
  const [userName, setUserName] = useState<string>(userProfile.name || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { fetchUserProfile } = useSupabaseData();
  
  // Fetch current user email and name from Supabase auth
  useEffect(() => {
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
            // Ensure we have all required fields with defaults if needed
            const completeProfile: UserProfile = {
              ...supabaseProfile,
              id: supabaseProfile.id || id,
              email: supabaseProfile.email || email || '',
              name: supabaseProfile.name || (user_metadata?.name as string) || 'User',
              age: supabaseProfile.age || 0,
              monthlyIncome: supabaseProfile.monthlyIncome || 0,
              riskProfile: supabaseProfile.riskProfile || 'moderate',
              hasEmergencyFund: supabaseProfile.hasEmergencyFund || false,
              hasDebts: supabaseProfile.hasDebts || false,
              financialGoals: supabaseProfile.financialGoals || [],
              investments: supabaseProfile.investments || [],
              debtDetails: supabaseProfile.debtDetails || []
            };
            setProfile(completeProfile);
            setUserName(completeProfile.name);
            // Update app-level profile state
            onProfileUpdate(completeProfile);
          } else {
            // Fallback to localStorage data with session user data
            const updatedProfile: UserProfile = {
              ...profile,
              id,
              email: email || profile.email || '',
              name: (user_metadata?.name as string) || profile.name || 'User',
            };
            setProfile(updatedProfile);
            setUserName(updatedProfile.name);
          }
        } else {
          console.log('No active session found, using provided profile data');
          // No active session, but continue with the provided profile data
          setProfile(userProfile);
          setUserName(userProfile.name || 'User');
        }
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
  }, [userProfile]);
  
  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => {
      const updatedProfile = {
        ...prev,
        [field]: value
      };
      
      // Update userName if name field changes
      if (field === 'name') {
        setUserName(value);
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
