
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

      // Refresh the user token and navigate to the dashboard page
      try {
        // Refresh the session to update the token
        await supabase.auth.refreshSession();

        // Use a small timeout to ensure the UI is updated before navigation
        setTimeout(() => {
          navigate('/dashboard'); // Use React Router navigation to avoid signing out
        }, 300);
      } catch (refreshError) {
        console.error("Error refreshing session:", refreshError);
        // Navigate anyway even if token refresh fails
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Error completing profile:", err);
      toast({
        title: "Error saving profile",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000
      });

      // Try to refresh the token and navigate to dashboard even if there's an error
      try {
        // Refresh the session to update the token
        await supabase.auth.refreshSession();

        // Navigate to dashboard
        navigate('/dashboard');
      } catch (refreshError) {
        console.error("Error refreshing session:", refreshError);
        // Navigate anyway even if token refresh fails
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleProfileComplete, isSubmitting };
}
