
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, LineChart, PiggyBank, Target, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/finance';
import InvestmentRecommendations from './InvestmentRecommendations';
import SavingStrategies from './SavingStrategies';

interface DashboardProps {
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const totalInvestments = userProfile.investments.reduce((sum, inv) => sum + inv.value, 0);
  const monthlyIncome = userProfile.monthlyIncome;

  // Calculate recommended savings (basic rule: 20% of income)
  const recommendedSavings = monthlyIncome * 0.2;
  
  // Mock data for dashboard
  const currentSavings = monthlyIncome * 0.15; // Assume user is saving 15% for example
  const savingsProgress = Math.min((currentSavings / recommendedSavings) * 100, 100);
  
  // Mock emergency fund calculation (target = 6 months of expenses)
  const emergencyFundTarget = monthlyIncome * 6 * 0.7; // Assuming expenses are 70% of income
  const currentEmergencyFund = userProfile.hasEmergencyFund ? 
    emergencyFundTarget : 
    emergencyFundTarget * 0.3; // If they don't have one, set at 30% for demo
  const emergencyFundProgress = Math.min((currentEmergencyFund / emergencyFundTarget) * 100, 100);

  // Calculate progress for first financial goal if exists
  const firstGoal = userProfile.financialGoals[0];
  const goalProgress = firstGoal ? 
    Math.min((firstGoal.currentAmount / firstGoal.targetAmount) * 100, 100) : 
    0;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/5 space-y-8">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Financial Overview</h2>
              <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="finance-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-full bg-finance-blue-light flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-finance-blue" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-finance-green" />
                  </div>
                  <h3 className="mt-4 font-medium text-gray-500">Monthly Income</h3>
                  <p className="text-2xl font-semibold">${monthlyIncome.toLocaleString()}</p>
                </CardContent>
              </Card>
              
              <Card className="finance-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-full bg-finance-green-light flex items-center justify-center">
                      <LineChart className="h-6 w-6 text-finance-green" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-finance-green" />
                  </div>
                  <h3 className="mt-4 font-medium text-gray-500">Investments</h3>
                  <p className="text-2xl font-semibold">${totalInvestments.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Monthly Savings</p>
                  <p className="text-sm text-gray-500">${currentSavings.toLocaleString()} of ${recommendedSavings.toLocaleString()}</p>
                </div>
                <Progress value={savingsProgress} className="h-2 progress-animation" />
                <p className="mt-1 text-xs text-gray-500">
                  {savingsProgress < 100 ? 
                    `${Math.round(100 - savingsProgress)}% below recommended savings` : 
                    "Meeting recommended savings"}
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Emergency Fund</p>
                  <p className="text-sm text-gray-500">${currentEmergencyFund.toLocaleString()} of ${emergencyFundTarget.toLocaleString()}</p>
                </div>
                <Progress value={emergencyFundProgress} className="h-2 progress-animation" />
                <p className="mt-1 text-xs text-gray-500">
                  {emergencyFundProgress < 100 ? 
                    `${Math.round(emergencyFundProgress)}% of 6 months target` : 
                    "Emergency fund complete!"}
                </p>
              </div>
              
              {firstGoal && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{firstGoal.name}</p>
                    <p className="text-sm text-gray-500">${firstGoal.currentAmount.toLocaleString()} of ${firstGoal.targetAmount.toLocaleString()}</p>
                  </div>
                  <Progress value={goalProgress} className="h-2 progress-animation" />
                  <p className="mt-1 text-xs text-gray-500">
                    Target date: {new Date(firstGoal.targetDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Financial Goals</h2>
              <Link to="/goals">
                <Button variant="ghost" className="text-finance-blue flex items-center gap-1 text-sm">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {userProfile.financialGoals.length > 0 ? (
              <div className="space-y-4">
                {userProfile.financialGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-4 p-4 rounded-xl border hover:bg-gray-50 transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-finance-purple-light flex items-center justify-center">
                      <Target className="h-5 w-5 text-finance-purple" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{goal.name}</h3>
                        <span className="text-sm font-medium text-finance-purple">
                          {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(goal.currentAmount / goal.targetAmount) * 100} 
                        className="h-1.5 mt-2 progress-animation" 
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          By {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Target className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>No financial goals yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4 text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white transition-all duration-300"
                >
                  Add a Goal
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-2/5 space-y-8">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Personalized Insights</h2>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-xl border p-4 hover:bg-gray-50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-2">
                  <LineChart className="h-5 w-5 text-finance-blue" />
                  <h3 className="font-medium">Investment Distribution</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Your investment mix is {userProfile.riskProfile}. This aligns with your risk profile.
                </p>
                <div className="flex items-center">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    {userProfile.investments.length > 0 ? (
                      <div className="flex h-full">
                        <div className="bg-finance-blue h-full" style={{width: '40%'}}></div>
                        <div className="bg-finance-green h-full" style={{width: '25%'}}></div>
                        <div className="bg-finance-purple h-full" style={{width: '20%'}}></div>
                        <div className="bg-yellow-400 h-full" style={{width: '15%'}}></div>
                      </div>
                    ) : (
                      <div className="bg-gray-300 h-full w-full"></div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Stocks</span>
                  <span>Bonds</span>
                  <span>Real Estate</span>
                  <span>Cash</span>
                </div>
              </div>
              
              <div className="rounded-xl border p-4 hover:bg-gray-50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-2">
                  <PiggyBank className="h-5 w-5 text-finance-green" />
                  <h3 className="font-medium">Savings Rate</h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  You're saving approximately <span className="font-medium">15%</span> of your income.
                </p>
                <p className="text-sm text-gray-600">
                  {savingsProgress < 90 ? 
                    "Increasing to 20% can significantly improve your long-term financial security." : 
                    "Great job! You're meeting the recommended savings rate."}
                </p>
                <Link to="/savings">
                  <Button 
                    variant="link" 
                    className="text-finance-blue p-0 mt-2 text-sm flex items-center gap-1 hover:underline"
                  >
                    Improve Savings <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              
              <div className="rounded-xl border p-4 hover:bg-gray-50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="h-5 w-5 text-finance-purple" />
                  <h3 className="font-medium">Next Steps</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  {!userProfile.hasEmergencyFund && (
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-finance-blue"></div>
                      Build emergency fund (3-6 months of expenses)
                    </li>
                  )}
                  {userProfile.hasDebts && (
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-finance-blue"></div>
                      Pay off high-interest debt
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-finance-blue"></div>
                    Increase retirement contributions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-finance-blue"></div>
                    Diversify investment portfolio
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Current Market Trends</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">S&P</span>
                  </div>
                  <div>
                    <p className="font-medium">S&P 500</p>
                    <p className="text-xs text-gray-500">US Index</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">4,385.42</p>
                  <p className="text-xs text-finance-green">+1.2%</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">BTC</span>
                  </div>
                  <div>
                    <p className="font-medium">Bitcoin</p>
                    <p className="text-xs text-gray-500">Cryptocurrency</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$60,142.17</p>
                  <p className="text-xs text-finance-green">+2.4%</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-amber-600">GLD</span>
                  </div>
                  <div>
                    <p className="font-medium">Gold</p>
                    <p className="text-xs text-gray-500">Commodity</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$2,345.80</p>
                  <p className="text-xs text-finance-green">+0.8%</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">10Y</span>
                  </div>
                  <div>
                    <p className="font-medium">10-Year Treasury</p>
                    <p className="text-xs text-gray-500">Bond Yield</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">3.42%</p>
                  <p className="text-xs text-red-500">-0.05%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 space-y-12">
        <InvestmentRecommendations userProfile={userProfile} />
        <SavingStrategies userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Dashboard;
