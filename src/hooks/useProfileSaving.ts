
import { useState } from 'react';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { ProfileService } from '@/services/profileService';
import { logger } from '@/utils/logger';

export function useProfileSaving() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async (profile: UserProfile): Promise<boolean> => {
    if (isSaving) {
      logger.warn('Profile save already in progress, skipping duplicate request');
      return false;
    }
    
    setIsSaving(true);
    
    try {
      logger.info('Starting profile save operation');
      
      if (!profile.id) {
        throw new Error("Profile must have a valid ID");
      }
      
      const result = await ProfileService.saveProfile(profile);
      
      if (result) {
        toast({
          title: "Profile saved",
          description: "Your profile has been saved successfully.",
          duration: 3000,
        });
      }
      
      return result;
    } catch (error) {
      logger.error("Error saving profile:", error);
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
