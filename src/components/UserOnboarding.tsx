
import React, { useState } from 'react';
import { ArrowRight, CheckCircle, ChevronRight, DollarSign, LineChart, Percent, PiggyBank, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { UserProfile, RiskProfile } from '@/types/finance';

interface UserOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 0,
    monthlyIncome: 0,
    riskProfile: 'moderate',
    hasEmergencyFund: false,
    hasDebts: false,
    financialGoals: [],
    investments: []
  });

  const [currentGoal, setCurrentGoal] = useState({
    name: '',
    targetAmount: 0,
    targetDate: new Date(),
    priority: 'medium' as const
  });

  const [currentInvestment, setCurrentInvestment] = useState({
    type: 'stocks' as const,
    name: '',
    value: 0
  });

  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      onComplete(profile as UserProfile);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleAddGoal = () => {
    if (currentGoal.name && currentGoal.targetAmount > 0) {
      const newGoal = {
        id: Date.now().toString(),
        ...currentGoal,
        currentAmount: 0
      };
      
      setProfile({
        ...profile,
        financialGoals: [...(profile.financialGoals || []), newGoal]
      });
      
      setCurrentGoal({
        name: '',
        targetAmount: 0,
        targetDate: new Date(),
        priority: 'medium' as const
      });
    }
  };

  const handleAddInvestment = () => {
    if (currentInvestment.name && currentInvestment.value > 0) {
      const newInvestment = {
        id: Date.now().toString(),
        ...currentInvestment
      };
      
      setProfile({
        ...profile,
        investments: [...(profile.investments || []), newInvestment]
      });
      
      setCurrentInvestment({
        type: 'stocks' as const,
        name: '',
        value: 0
      });
    }
  };

  const handleRemoveGoal = (id: string) => {
    setProfile({
      ...profile,
      financialGoals: profile.financialGoals?.filter(goal => goal.id !== id) || []
    });
  };

  const handleRemoveInvestment = (id: string) => {
    setProfile({
      ...profile,
      investments: profile.investments?.filter(investment => investment.id !== id) || []
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map(stepNumber => (
          <div 
            key={stepNumber}
            className={`relative flex items-center justify-center h-10 w-10 rounded-full 
              ${stepNumber < step ? 'bg-finance-green text-white' : 
                stepNumber === step ? 'bg-finance-blue text-white' : 
                'bg-gray-200 text-gray-500'} 
              transition-all duration-300`}
          >
            {stepNumber < step ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <span className="text-sm font-medium">{stepNumber}</span>
            )}
            
            {stepNumber < 5 && (
              <div 
                className={`absolute top-5 -right-full h-0.5 w-full 
                  ${stepNumber < step ? 'bg-finance-green' : 'bg-gray-200'} 
                  transition-all duration-300`} 
              />
            )}
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-8 mb-8 animate-scale-in">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="John Doe"
                  className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={profile.age || ''} 
                  onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                  placeholder="30"
                  className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="income">Monthly Income ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="income" 
                    type="number" 
                    value={profile.monthlyIncome || ''} 
                    onChange={(e) => setProfile({...profile, monthlyIncome: parseInt(e.target.value) || 0})}
                    placeholder="5000"
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Risk Profile</h2>
            <p className="text-gray-600 mb-6">How comfortable are you with investment risk?</p>
            
            <RadioGroup 
              value={profile.riskProfile} 
              onValueChange={(value) => setProfile({...profile, riskProfile: value as RiskProfile})}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-300">
                <RadioGroupItem value="conservative" id="conservative" className="mt-1" />
                <div>
                  <Label htmlFor="conservative" className="text-base font-medium">Conservative</Label>
                  <p className="text-sm text-gray-500">Prioritize preserving capital with lower returns and minimal risk</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-300">
                <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
                <div>
                  <Label htmlFor="moderate" className="text-base font-medium">Moderate</Label>
                  <p className="text-sm text-gray-500">Balance between growth and capital preservation with medium risk</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-300">
                <RadioGroupItem value="aggressive" id="aggressive" className="mt-1" />
                <div>
                  <Label htmlFor="aggressive" className="text-base font-medium">Aggressive</Label>
                  <p className="text-sm text-gray-500">Maximize long-term growth with higher risk tolerance</p>
                </div>
              </div>
            </RadioGroup>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emergency" 
                  checked={profile.hasEmergencyFund} 
                  onCheckedChange={(checked) => setProfile({...profile, hasEmergencyFund: !!checked})}
                />
                <Label htmlFor="emergency" className="text-base">I have an emergency fund (3-6 months of expenses)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="debts" 
                  checked={profile.hasDebts} 
                  onCheckedChange={(checked) => setProfile({...profile, hasDebts: !!checked})}
                />
                <Label htmlFor="debts" className="text-base">I have high-interest debts (credit cards, personal loans)</Label>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Financial Goals</h2>
            <p className="text-gray-600 mb-6">Add your short-term and long-term financial goals</p>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input 
                  id="goalName" 
                  value={currentGoal.name} 
                  onChange={(e) => setCurrentGoal({...currentGoal, name: e.target.value})}
                  placeholder="Buy a house, Retirement, etc."
                  className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goalAmount">Target Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="goalAmount" 
                    type="number" 
                    value={currentGoal.targetAmount || ''} 
                    onChange={(e) => setCurrentGoal({...currentGoal, targetAmount: parseInt(e.target.value) || 0})}
                    placeholder="50000"
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goalDate">Target Date</Label>
                <Input 
                  id="goalDate" 
                  type="date" 
                  value={currentGoal.targetDate.toISOString().split('T')[0]} 
                  onChange={(e) => setCurrentGoal({
                    ...currentGoal, 
                    targetDate: new Date(e.target.value)
                  })}
                  className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <RadioGroup 
                  value={currentGoal.priority} 
                  onValueChange={(value: any) => setCurrentGoal({...currentGoal, priority: value})}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                onClick={handleAddGoal}
                disabled={!currentGoal.name || currentGoal.targetAmount <= 0}
                className="w-full bg-finance-blue hover:bg-finance-blue-dark transition-all duration-300"
              >
                Add Goal
              </Button>
            </div>
            
            <Separator className="my-6" />
            
            {profile.financialGoals && profile.financialGoals.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium">Your Goals</h3>
                {profile.financialGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-finance-purple" />
                      <div>
                        <p className="font-medium">{goal.name}</p>
                        <p className="text-sm text-gray-500">
                          ${goal.targetAmount.toLocaleString()} by {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No goals added yet
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Current Investments</h2>
            <p className="text-gray-600 mb-6">List your existing investments</p>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="investmentType">Investment Type</Label>
                <select
                  id="investmentType"
                  value={currentInvestment.type}
                  onChange={(e) => setCurrentInvestment({
                    ...currentInvestment, 
                    type: e.target.value as any
                  })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="stocks">Stocks</option>
                  <option value="bonds">Bonds</option>
                  <option value="realEstate">Real Estate</option>
                  <option value="cash">Cash / Savings</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investmentName">Investment Name</Label>
                <Input 
                  id="investmentName" 
                  value={currentInvestment.name} 
                  onChange={(e) => setCurrentInvestment({...currentInvestment, name: e.target.value})}
                  placeholder="S&P 500 ETF, Bitcoin, etc."
                  className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investmentValue">Current Value ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="investmentValue" 
                    type="number" 
                    value={currentInvestment.value || ''} 
                    onChange={(e) => setCurrentInvestment({...currentInvestment, value: parseInt(e.target.value) || 0})}
                    placeholder="10000"
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleAddInvestment}
                disabled={!currentInvestment.name || currentInvestment.value <= 0}
                className="w-full bg-finance-blue hover:bg-finance-blue-dark transition-all duration-300"
              >
                Add Investment
              </Button>
            </div>
            
            <Separator className="my-6" />
            
            {profile.investments && profile.investments.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium">Your Investments</h3>
                {profile.investments.map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <LineChart className="h-5 w-5 text-finance-green" />
                      <div>
                        <p className="font-medium">{investment.name}</p>
                        <p className="text-sm text-gray-500">
                          {investment.type.charAt(0).toUpperCase() + investment.type.slice(1)} | ${investment.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveInvestment(investment.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No investments added yet
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Review & Complete</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Personal Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="flex justify-between py-1">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{profile.name}</span>
                  </p>
                  <p className="flex justify-between py-1">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{profile.age}</span>
                  </p>
                  <p className="flex justify-between py-1">
                    <span className="text-gray-600">Monthly Income:</span>
                    <span className="font-medium">${profile.monthlyIncome?.toLocaleString()}</span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Risk Profile</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="flex justify-between py-1">
                    <span className="text-gray-600">Risk Tolerance:</span>
                    <span className="font-medium capitalize">{profile.riskProfile}</span>
                  </p>
                  <p className="flex justify-between py-1">
                    <span className="text-gray-600">Emergency Fund:</span>
                    <span className="font-medium">{profile.hasEmergencyFund ? 'Yes' : 'No'}</span>
                  </p>
                  <p className="flex justify-between py-1">
                    <span className="text-gray-600">High Interest Debts:</span>
                    <span className="font-medium">{profile.hasDebts ? 'Yes' : 'No'}</span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Financial Goals</h3>
                {profile.financialGoals && profile.financialGoals.length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    {profile.financialGoals.map((goal) => (
                      <div key={goal.id} className="py-1">
                        <p className="font-medium">{goal.name}</p>
                        <p className="text-sm text-gray-600">
                          ${goal.targetAmount.toLocaleString()} by {new Date(goal.targetDate).toLocaleDateString()} | 
                          <span className="capitalize"> {goal.priority} priority</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-500">No goals added</div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Current Investments</h3>
                {profile.investments && profile.investments.length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    {profile.investments.map((investment) => (
                      <div key={investment.id} className="py-1">
                        <p className="font-medium">{investment.name}</p>
                        <p className="text-sm text-gray-600">
                          {investment.type.charAt(0).toUpperCase() + investment.type.slice(1)} | 
                          ${investment.value.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-500">No investments added</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handlePrevStep} className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Previous
          </Button>
        ) : (
          <div></div>
        )}
        
        <Button 
          onClick={handleNextStep} 
          className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover"
        >
          {step < 5 ? 'Next' : 'Complete'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserOnboarding;
