
import React from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowRight } from 'lucide-react';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { Link } from 'react-router-dom';
import { MONTHS } from '@/constants/months';

interface ExpensesSummaryProps {
  userProfile: UserProfile;
  expensesRatio: number;
}

const ExpensesSummary: React.FC<ExpensesSummaryProps> = ({ 
  userProfile,
  expensesRatio
}) => {
  const { calculateAverageExpenses } = useMonthlyExpenses();
  const [expensesData, setExpensesData] = React.useState<MonthlyAmount[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchExpensesData = async () => {
      if (!userProfile?.id) return;
      
      try {
        const { useGetMonthlyExpenses } = await import('@/hooks/supabase/useGetMonthlyExpenses');
        const { fetchMonthlyExpenses } = useGetMonthlyExpenses();
        
        const currentYear = new Date().getFullYear();
        const lastThreeMonths = [];
        
        // Get current month (1-indexed)
        const currentMonth = new Date().getMonth() + 1;
        
        // Fetch expenses for the current year
        const expenses = await fetchMonthlyExpenses(userProfile.id, currentYear);
        
        if (expenses && expenses.data) {
          // Ensure we convert any JSON data to the proper MonthlyAmount type
          const typedData: MonthlyAmount[] = Array.isArray(expenses.data) 
            ? expenses.data.map(item => ({
                month: typeof item.month === 'number' ? item.month : parseInt(String(item.month)),
                amount: typeof item.amount === 'number' ? item.amount : parseFloat(String(item.amount))
              }))
            : [];
          
          // Get last three months of data
          for (let i = 0; i < 3; i++) {
            // Calculate month considering wrap-around to previous year
            const month = currentMonth - i > 0 ? currentMonth - i : 12 + (currentMonth - i);
            const monthData = typedData.find(item => item.month === month);
            
            if (monthData) {
              lastThreeMonths.unshift({
                ...monthData,
                monthName: MONTHS[month - 1]
              });
            }
          }
          
          setExpensesData(lastThreeMonths);
        }
      } catch (error) {
        console.error("Error fetching expenses data for dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpensesData();
  }, [userProfile?.id]);
  
  const chartData = expensesData.map(item => ({
    month: MONTHS[item.month - 1].substring(0, 3),
    amount: item.amount
  }));
  
  // Get status and color based on expenses ratio
  const getStatusInfo = () => {
    if (expensesRatio > 70) {
      return { label: 'High', color: 'destructive' as const };
    } else if (expensesRatio > 50) {
      return { label: 'Moderate', color: 'secondary' as const };
    } else {
      return { label: 'Low', color: 'outline' as const };
    }
  };
  
  const status = getStatusInfo();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-red-500" />
            Recent Expenses
          </div>
        </CardTitle>
        <Badge variant={status.color}>
          {status.label} Spending
        </Badge>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-gray-500">Loading expense data...</p>
          </div>
        ) : expensesData.length > 0 ? (
          <div className="h-[200px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Amount']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-gray-500">No recent expense data available</p>
          </div>
        )}
        
        <div className="mt-4">
          <Link 
            to="/monthly-expenses" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            View detailed expenses <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesSummary;
