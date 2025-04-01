
import { useUserProfile } from './supabase/useUserProfile';
import { useProfileSave } from './supabase/useProfileSave';
import { UserProfile } from '@/types/finance';

/**
 * Main hook that combines all Supabase data operations
 * IMPORTANT: This hook must only be used inside React functional components
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
