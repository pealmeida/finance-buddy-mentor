
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfileSaving } from './useProfileSaving';

export function useProfileCompletion(onProfileComplete: (profile: UserProfile) => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveProfile } = useProfileSaving();

  const handleProfileComplete = async (profile: UserProfile, isEditMode: boolean = false) => {
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
        const success = await saveProfile(profileWithId);
        
        if (!success) {
          throw new Error("Failed to save profile to database");
        }
        console.log('Profile saved to Supabase successfully');
      } else {
        // No auth session, use existing ID if available or placeholder
        console.log('No session found, using local profile data');
        profileWithId = {
          ...profile,
          id: profile.id || 'user-id',
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
      
      // Fixed navigation: Only redirect if not in edit mode or explicitly requested
      // This prevents the navigation loop when updating profile
      if (!isEditMode) {
        // Navigate to the dashboard page after completing the onboarding
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      }
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

  return { handleProfileComplete, isSubmitting };
}
