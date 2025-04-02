
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import MonthlySavings from '@/components/savings/MonthlySavings';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  
  useEffect(() => {
    // Check if user is authenticated
    if (!userProfile || !userProfile.id) {
      setError("Authentication required to access monthly savings");
      toast({
        title: "Authentication Required",
        description: "Please log in to access the monthly savings feature.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    // Set loading to false after we've confirmed the user is authenticated
    setLoading(false);
  }, [userProfile, navigate, toast]);
  
  const handleSave = (updatedProfile: UserProfile) => {
    try {
      handleProfileComplete(updatedProfile, true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p>Loading savings data...</p>
        </div>
      </div>
    );
  }

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
