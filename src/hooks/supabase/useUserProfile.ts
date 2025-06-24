
import { useSupabaseBase } from './useSupabaseBase';
import { UserProfile } from '@/types/finance';
import { 
  fetchFinancialGoals, 
  fetchInvestments, 
  fetchDebtDetails, 
  fetchProfileData, 
  createMinimalProfile 
} from './utils/profileQueries';

/**
 * Hook for fetching and managing user profile data
 */
export function useUserProfile() {
  const { loading, setLoading, handleError, toast } = useSupabaseBase();

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      setLoading(true);
      // Fetch basic profile and financial profile data
      const profileData = await fetchProfileData(userId);
      
      // Create a new profile if it doesn't exist
      if (!profileData) {
        toast({
          title: "Profile not found",
          description: "Creating a new profile for you",
        });
        
        // Create a minimal profile with the user ID
        return createMinimalProfile(userId);
      }
      
      // Now fetch the related data
      const financialGoals = await fetchFinancialGoals(userId);
      const investments = await fetchInvestments(userId);
      const debtDetails = await fetchDebtDetails(userId);
      // Complete the user profile
      return {
        ...profileData,
        financialGoals,
        investments,
        debtDetails,
      } as UserProfile;
      
    } catch (err) {
      return handleError(err, "Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchUserProfile
  };
}
