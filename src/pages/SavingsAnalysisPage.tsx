
import React, { useState, useEffect } from 'react';
import { useSimpleAuthCheck } from '@/hooks/useSimpleAuthCheck';
import { useProfileData } from '@/hooks/useProfileData';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import MonthlySavingsContent from '@/components/savings/MonthlySavingsContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import YearSelector from '@/components/savings/YearSelector';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { ensureCompleteSavingsData } from '@/hooks/supabase/utils/savingsUtils';
import { Loader2 } from 'lucide-react';

const SavingsAnalysisPage = () => {
  const { isAuthenticated } = useSimpleAuthCheck();
  const { profile, loading: profileLoading } = useProfileData();
  const { toast } = useToast();
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [totalSaved, setTotalSaved] = useState<number>(0);
  const [averageSaved, setAverageSaved] = useState<number>(0);
  
  const { 
    fetchMonthlySavings, 
    loading, 
    error,
    calculateAverageSavings 
  } = useMonthlySavings();
  
  useEffect(() => {
    const loadData = async () => {
      if (!profile?.id) return;
      
      setLoadingData(true);
      
      try {
        const data = await fetchMonthlySavings(profile.id, selectedYear);
        
        if (data && data.data) {
          const completeSavingsData = ensureCompleteSavingsData(data.data);
          setSavingsData(completeSavingsData);
          
          // Calculate statistics
          const total = completeSavingsData.reduce((sum, item) => sum + item.amount, 0);
          setTotalSaved(total);
          setAverageSaved(calculateAverageSavings(completeSavingsData));
        } else {
          setSavingsData([]);
          setTotalSaved(0);
          setAverageSaved(0);
          toast({
            title: "No Data Found",
            description: "No savings data found for the selected year.",
          });
        }
      } catch (err) {
        console.error("Error loading savings data:", err);
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
  }, [profile?.id, selectedYear, fetchMonthlySavings, calculateAverageSavings, toast]);
  
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Savings Analysis</h1>
              <p className="text-gray-600 mt-1">
                Analyze and track your savings progress over time
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <YearSelector
                selectedYear={selectedYear}
                onYearChange={handleYearChange}
                disabled={loadingData}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Saved</CardTitle>
                <CardDescription>Amount saved in {selectedYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">${totalSaved.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Average</CardTitle>
                <CardDescription>Average savings per month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">${averageSaved.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Yearly Goal</CardTitle>
                <CardDescription>Progress towards your yearly goal</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {profile?.monthlySavings ? "On Track" : "Set a Goal"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="p-4 bg-white rounded-lg shadow">
              <MonthlySavingsContent
                loadingData={loadingData}
                savingsData={savingsData}
                editingMonth={null}
                onEditMonth={() => {}}
                onSaveAmount={() => {}}
                onCancelEdit={() => {}}
                error={error}
              />
            </TabsContent>
            
            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Savings Data</CardTitle>
                  <CardDescription>
                    Detailed breakdown of your savings in {selectedYear}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center items-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <Table>
                      <TableCaption>Monthly savings for {selectedYear}</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Amount Saved</TableHead>
                          <TableHead>Comparison to Average</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savingsData.map(item => (
                          <TableRow key={item.month}>
                            <TableCell className="font-medium">
                              {new Date(0, item.month - 1).toLocaleString('default', { month: 'long' })}
                            </TableCell>
                            <TableCell>${item.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              {item.amount > averageSaved ? (
                                <span className="text-green-600">${(item.amount - averageSaved).toFixed(2)} above average</span>
                              ) : item.amount < averageSaved ? (
                                <span className="text-red-600">${(averageSaved - item.amount).toFixed(2)} below average</span>
                              ) : (
                                <span className="text-gray-600">Average</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SavingsAnalysisPage;
