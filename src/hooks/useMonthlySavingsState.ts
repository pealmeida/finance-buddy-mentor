import { useState, useEffect, useCallback } from 'react';
import { UserProfile, MonthlyAmount, MonthlySavings as MonthlySavingsType } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { MONTHS } from '@/constants/months';
import { supabase } from '@/integrations/supabase/client';

export const useMonthlySavingsState = (
  profile: UserProfile,
  onSave: (updatedProfile: UserProfile) => void,
  isSaving = false
) => {
  const { toast } = useToast();
  const { fetchMonthlySavings, saveMonthlySavings, loading: savingsLoading } = useMonthlySavings();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>([]);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 3;

  // Initialize savings data from profile or create empty data
  const initializeEmptyData = useCallback(() => {
    // Initialize empty data for all months
    const initialData: MonthlyAmount[] = MONTHS.map((_, index) => ({
      month: index + 1,
      amount: 0
    }));
    setSavingsData(initialData);
  }, []);

  // Check authentication status and refresh token if needed
  const checkAndRefreshAuth = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth session error:", error);
        return false;
      }
      
      // If session exists but expires soon, refresh it
      if (data.session) {
        const expiresAt = data.session.expires_at;
        const currentTime = Math.floor(Date.now() / 1000);
        
        // If token expires in less than 10 minutes, refresh it
        if (expiresAt && expiresAt - currentTime < 600) {
          console.log("Token expiring soon, refreshing...");
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Error refreshing token:", refreshError);
            return false;
          }
        }
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error("Auth check error:", err);
      return false;
    }
  }, []);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      if (!profile?.id) {
        setError("Authentication required. Please log in.");
        setAuthChecked(true);
        setLoadingData(false);
        initializeEmptyData();
        return;
      }
      
      const isAuthenticated = await checkAndRefreshAuth();
      
      if (!isAuthenticated) {
        setError("Authentication session expired. Please log in again.");
        setAuthChecked(true);
        setLoadingData(false);
        initializeEmptyData();
        return;
      }
      
      setAuthChecked(true);
    };
    
    checkAuth();
  }, [profile?.id, initializeEmptyData, checkAndRefreshAuth]);

  // Fetch data when year changes or auth is confirmed
  useEffect(() => {
    let isMounted = true;
    
    if (!authChecked || !profile?.id) return;

    const fetchData = async () => {
      // Reset state at the beginning of the fetch
      if (isMounted) {
        setLoadingData(true);
        setError(null);
      }
      
      try {
        // Refresh auth token before fetching data
        await checkAndRefreshAuth();
        
        console.log(`Fetching monthly savings for user ${profile.id} and year ${selectedYear}`);
        // Try to fetch data from Supabase
        const savedData = await fetchMonthlySavings(profile.id, selectedYear);
        
        // Store the fetch time to track data freshness
        const fetchTime = Date.now();
        
        if (!isMounted) return;
        
        setLastFetchTime(fetchTime);
        setFetchAttempts(0); // Reset attempt counter on success
        
        if (savedData && savedData.data) {
          console.log("Setting savings data from fetch:", savedData.data);
          setSavingsData(savedData.data);
          
          // Update profile with fetched data if needed
          if (profile.monthlySavings?.year !== selectedYear || 
              !profile.monthlySavings?.data || 
              JSON.stringify(savedData.data) !== JSON.stringify(profile.monthlySavings.data)) {
            
            const updatedMonthlySavings: MonthlySavingsType = {
              id: savedData.id,
              userId: profile.id,
              year: selectedYear,
              data: savedData.data
            };
            
            const updatedProfile = {
              ...profile,
              monthlySavings: updatedMonthlySavings
            };
            
            onSave(updatedProfile);
          }
        } else {
          console.log("No saved data found, initializing empty data");
          initializeEmptyData();
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error("Error fetching savings data:", err);
        
        // Increment fetch attempts and try again if under max attempts
        if (fetchAttempts < MAX_FETCH_ATTEMPTS) {
          console.log(`Fetch attempt ${fetchAttempts + 1}/${MAX_FETCH_ATTEMPTS} failed, retrying...`);
          setFetchAttempts(prev => prev + 1);
          
          // Retry after a short delay
          setTimeout(() => {
            if (isMounted) {
              fetchData();
            }
          }, 1000);
          
          return;
        }
        
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast({
          title: "Error",
          description: "Failed to load savings data. Please try refreshing the page.",
          variant: "destructive"
        });
        initializeEmptyData();
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    };
    
    fetchData();
    
    // Set up auto-refresh every 5 minutes
    const refreshTimer = setInterval(() => {
      if (Date.now() - lastFetchTime >= 300000) { // 5 minutes
        fetchData();
      }
    }, 60000); // Check every minute
    
    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, [profile?.id, selectedYear, authChecked, fetchMonthlySavings, initializeEmptyData, onSave, profile, toast, lastFetchTime, fetchAttempts, checkAndRefreshAuth]);

  const handleSaveAmount = (month: number, amount: number) => {
    // Create a new array rather than mutating the existing one
    const updatedData = savingsData.map(item => 
      item.month === month ? { ...item, amount } : item
    );
    
    setSavingsData(updatedData);
    setEditingMonth(null);
    
    toast({
      title: "Savings Updated",
      description: `Your savings for ${MONTHS[month - 1]} have been updated.`
    });
  };

  const handleEditMonth = (month: number) => {
    setEditingMonth(month);
  };

  const handleSaveAll = async () => {
    try {
      if (!profile || !profile.id) {
        toast({
          title: "Not Logged In",
          description: "Please log in to save your data.",
          variant: "destructive"
        });
        return;
      }
      
      // Refresh auth token before saving
      const isAuthenticated = await checkAndRefreshAuth();
      if (!isAuthenticated) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Starting save process for monthly savings");
      // Use existing ID or generate a new one
      const monthlySavingsId = profile.monthlySavings?.id || uuidv4();
      
      const updatedSavings: MonthlySavingsType = {
        id: monthlySavingsId,
        userId: profile.id,
        year: selectedYear,
        data: savingsData
      };
      
      console.log("About to save monthly savings:", updatedSavings);
      
      // Save to Supabase
      const success = await saveMonthlySavings(updatedSavings);
      
      if (success) {
        console.log("Monthly savings saved successfully");
        setLastFetchTime(Date.now());  // Update fetch time after successful save
        
        // Update local state
        const updatedProfile = {
          ...profile,
          monthlySavings: updatedSavings
        };
        
        onSave(updatedProfile);
        
        toast({
          title: "Savings Saved",
          description: `Your savings data for ${selectedYear} has been saved successfully.`
        });
      } else {
        throw new Error("Failed to save data");
      }
    } catch (err) {
      console.error("Error saving savings data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast({
        title: "Error",
        description: "There was a problem saving your savings data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setEditingMonth(null);
    // The data fetching will be triggered by the useEffect
  };

  const refreshData = useCallback(async () => {
    if (!profile?.id) return;
    
    // Refresh auth token before fetching data
    const isAuthenticated = await checkAndRefreshAuth();
    if (!isAuthenticated) {
      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please log in again.",
        variant: "destructive"
      });
      return;
    }
    
    setLoadingData(true);
    setError(null);
    
    try {
      const savedData = await fetchMonthlySavings(profile.id, selectedYear);
      setLastFetchTime(Date.now());
      
      if (savedData && savedData.data) {
        setSavingsData(savedData.data);
        toast({
          title: "Data Refreshed",
          description: "Your savings data has been refreshed successfully."
        });
      } else {
        initializeEmptyData();
        toast({
          title: "No Data Found",
          description: "No savings data was found for the selected year."
        });
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast({
        title: "Error",
        description: "Failed to refresh savings data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  }, [checkAndRefreshAuth, fetchMonthlySavings, initializeEmptyData, profile?.id, selectedYear, toast]);

  return {
    selectedYear,
    savingsData,
    editingMonth,
    loadingData,
    savingsLoading,
    error,
    authChecked,
    handleSaveAmount,
    handleEditMonth,
    handleSaveAll,
    handleYearChange,
    refreshData,
    setEditingMonth
  };
};
