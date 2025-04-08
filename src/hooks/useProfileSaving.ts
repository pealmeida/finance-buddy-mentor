
import { useState } from 'react';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { saveUserProfile } from '@/services/profileService';

export function useProfileSaving() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async (profile: UserProfile): Promise<boolean> => {
    setIsSaving(true);
    try {
      await saveUserProfile(profile);
      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving profile",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveProfile, isSaving };
}
