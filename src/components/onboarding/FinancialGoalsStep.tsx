
import React from 'react';
import { DollarSign, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useOnboarding } from '@/context/OnboardingContext';

const FinancialGoalsStep: React.FC = () => {
  const { 
    profile, 
    currentGoal, 
    updateCurrentGoal, 
    addGoal, 
    removeGoal
  } = useOnboarding();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Financial Goals</h2>
      <p className="text-gray-600 mb-6">Add your short-term and long-term financial goals</p>
      
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="goalName">Goal Name</Label>
          <Input 
            id="goalName" 
            value={currentGoal.name} 
            onChange={(e) => updateCurrentGoal({ name: e.target.value })}
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
              onChange={(e) => updateCurrentGoal({ targetAmount: parseInt(e.target.value) || 0 })}
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
            onChange={(e) => updateCurrentGoal({
              targetDate: new Date(e.target.value)
            })}
            className="transition-all duration-300 focus:ring-2 focus:ring-finance-blue"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Priority</Label>
          <RadioGroup 
            value={currentGoal.priority} 
            onValueChange={(value: any) => updateCurrentGoal({ priority: value })}
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
          onClick={addGoal}
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
                onClick={() => removeGoal(goal.id)}
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
  );
};

export default FinancialGoalsStep;
