
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import MonthlySavings from '@/components/savings/MonthlySavings';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface MonthlySavingsPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const MonthlySavingsPage: React.FC<MonthlySavingsPageProps> = ({
  userProfile,
  onProfileUpdate
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleProfileComplete, isSubmitting } = useProfileCompletion(onProfileUpdate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Check if auth session is valid and refresh token if needed
  useEffect(() => {
    const checkSession = async () => {
      setCheckingAuth(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        // If there's an error or no session, redirect to login
        if (error || !data.session) {
          throw new Error("Authentication required to access monthly savings");
        }
        
        // Session exists but check if token needs refresh
        if (data.session) {
          const expiresAt = data.session.expires_at;
          const currentTime = Math.floor(Date.now() / 1000);
          
          // If token expires in less than 10 minutes, refresh it
          if (expiresAt && expiresAt - currentTime < 600) {
            console.log("Token expiring soon, refreshing...");
            await supabase.auth.refreshSession();
          }
        }
      } catch (err) {
        console.error("Session error:", err);
        setError("Authentication required to access monthly savings");
        toast({
          title: "Authentication Required",
          description: "Please log in to access the monthly savings feature.",
          variant: "destructive"
        });
        
        // Give the toast time to be seen before redirecting
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkSession();
  }, [navigate, toast]);
  
  // Check if profile is valid once auth check is complete
  useEffect(() => {
    if (!checkingAuth) {
      if (!userProfile || !userProfile.id) {
        setError("Authentication required to access monthly savings");
        toast({
          title: "Authentication Required",
          description: "Please log in to access the monthly savings feature.",
          variant: "destructive"
        });
        
        // Give the toast time to be seen before redirecting
        const redirectTimer = setTimeout(() => {
          navigate("/login");
        }, 2000);
        
        return () => clearTimeout(redirectTimer);
      }
      
      // Set loading to false after we've confirmed the user is authenticated
      setLoading(false);
    }
  }, [userProfile, checkingAuth, navigate, toast]);
  
  const handleSave = (updatedProfile: UserProfile) => {
    try {
      if (!updatedProfile || !updatedProfile.id) {
        throw new Error("Cannot save: Profile is not valid");
      }
      
      handleProfileComplete(updatedProfile);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile data");
      toast({
        title: "Save Error",
        description: "Failed to save your profile data. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show loading state
  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p>Loading savings data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header onboardingComplete={true} />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onboardingComplete={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Monthly Savings</h1>
          
          <div className="glass-panel rounded-2xl p-8 mb-8">
            <MonthlySavings 
              profile={userProfile} 
              onSave={handleSave} 
              isSaving={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySavingsPage;
