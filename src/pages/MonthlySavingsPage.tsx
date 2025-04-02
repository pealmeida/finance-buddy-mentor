
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { UserProfile } from '@/types/finance';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import MonthlySavings from '@/components/savings/MonthlySavings';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const MonthlySavingsPage: React.FC = () => {
  const { userProfile, handleProfileUpdate, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleProfileComplete, isSubmitting } = useProfileCompletion(handleProfileUpdate);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !userProfile) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the monthly savings feature.",
        variant: "destructive"
      });
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [userProfile, authLoading, navigate]);
  
  const handleSave = (updatedProfile: UserProfile) => {
    handleProfileComplete(updatedProfile, true);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
        <p>Loading...</p>
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
            {userProfile && (
              <MonthlySavings 
                profile={userProfile} 
                onSave={handleSave} 
                isSaving={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySavingsPage;
