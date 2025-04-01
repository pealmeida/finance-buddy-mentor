
import { useUserProfile } from './supabase/useUserProfile';
import { useProfileSave } from './supabase/useProfileSave';
import { UserProfile } from '@/types/finance';

/**
 * Main hook that combines all Supabase data operations
 */
export function useSupabaseData() {
  const { loading: profileLoading, fetchUserProfile } = useUserProfile();
  const { loading: saveLoading, saveUserProfile } = useProfileSave();

  const loading = profileLoading || saveLoading;

  return {
    loading,
    error: null, // Errors are now handled with toasts in each hook
    fetchUserProfile,
    saveUserProfile
  };
}
