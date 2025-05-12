import React, { useState, useEffect } from 'react';
import { useSimpleAuthCheck } from '@/hooks/useSimpleAuthCheck';
import { useProfileData } from '@/hooks/useProfileData';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { MonthlyAmount } from '@/types/finance';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { Loader2 } from 'lucide-react';
import SavingsAnalysisHeader from '@/components/savings/analysis/SavingsAnalysisHeader';
import SavingsAnalysisStats from '@/components/savings/analysis/SavingsAnalysisStats';
import SavingsAnalysisTabs from '@/components/savings/analysis/SavingsAnalysisTabs';
import { logger } from '@/utils/logger';
import { useMonthlyDataProcessor } from '@/hooks/useMonthlyDataProcessor';
import { ensureCompleteMonthlyData } from '@/utils/dataUtils';

const SavingsAnalysisPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useSimpleAuthCheck(true);
  const { profile, loading: profileLoading } = useProfileData();
  const { toast } = useToast();
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    fetchMonthlySavings, 
    loading, 
    error: fetchError
  } = useMonthlySavings();
  
  const { total: totalSaved, average: averageSaved } = useMonthlyDataProcessor(savingsData);
  
  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError]);
  
  useEffect(() => {
    const loadData = async () => {
      if (!profile?.id) return;
      
      setLoadingData(true);
      
      try {
        const data = await fetchMonthlySavings(profile.id, selectedYear);
        
        if (data && data.data) {
          logger.info("Savings data loaded successfully for year:", selectedYear);
          const completeSavingsData = ensureCompleteMonthlyData(data.data);
          setSavingsData(completeSavingsData);
        } else {
          setSavingsData([]);
          toast({
            title: "No Data Found",
            description: "No savings data found for the selected year.",
          });
        }
      } catch (err) {
        logger.error("Error loading savings data:", err);
        setError(err instanceof Error ? err.message : "Failed to load savings data");
        toast({
          title: "Error",
          description: "Failed to load savings data.",
          variant: "destructive"
        });
      } finally {
        setLoadingData(false);
      }
    };
    
    loadData();
  }, [profile?.id, selectedYear, fetchMonthlySavings, toast]);
  
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const refreshData = async () => {
    if (!profile?.id) return;
    setLoadingData(true);
    try {
      const data = await fetchMonthlySavings(profile.id, selectedYear);
      if (data && data.data) {
        const completeSavingsData = ensureCompleteMonthlyData(data.data);
        setSavingsData(completeSavingsData);
        toast({
          title: "Data Refreshed",
          description: "Savings data has been refreshed successfully.",
        });
      }
    } catch (err) {
      logger.error("Error refreshing data:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh data");
      toast({
        title: "Error",
        description: "Failed to refresh data.",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };
  
  if (profileLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-blue-700">Loading profile data...</span>
      </div>
    );
  }

  return (
    <>
      <Header onboardingComplete={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <SavingsAnalysisHeader 
            selectedYear={selectedYear}
            handleYearChange={handleYearChange}
            loadingData={loadingData}
          />
          
          <SavingsAnalysisStats 
            totalSaved={totalSaved}
            averageSaved={averageSaved}
            profile={profile}
            selectedYear={selectedYear}
          />
          
          <SavingsAnalysisTabs 
            loadingData={loadingData}
            savingsData={savingsData}
            averageSaved={averageSaved}
            selectedYear={selectedYear}
            error={error}
            refreshData={refreshData}
          />
        </div>
      </div>
    </>
  );
};

export default SavingsAnalysisPage;
