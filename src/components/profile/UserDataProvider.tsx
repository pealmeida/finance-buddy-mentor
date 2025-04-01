
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
  const [profile, setProfile] = useState<UserProfile>({...userProfile});
  const [userName, setUserName] = useState<string>('');
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
            setProfile(supabaseProfile);
            setUserName(supabaseProfile.name);
            // Update app-level profile state
            onProfileUpdate(supabaseProfile);
          } else {
            // Fallback to localStorage data
            setProfile(prev => ({
              ...prev,
              id,
              email: email || prev.email
            }));
            
            // Set user name for display
            if (user_metadata && user_metadata.name) {
              setProfile(prev => ({
                ...prev,
                name: user_metadata.name
              }));
              setUserName(user_metadata.name);
            } else if (profile.name) {
              setUserName(profile.name);
            } else if (email) {
              // Use email as fallback if no name is available
              const nameFromEmail = email.split('@')[0];
              setUserName(nameFromEmail);
            }
          }
        } else {
          throw new Error("No active session found.");
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
  }, []);
  
  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update userName if name field changes
    if (field === 'name') {
      setUserName(value);
    }
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
