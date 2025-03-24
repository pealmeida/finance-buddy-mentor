
import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, CreditCard, DollarSign, LineChart, PiggyBank, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserProfile, SavingStrategy } from '@/types/finance';

interface SavingStrategiesProps {
  userProfile: UserProfile;
}

const SavingStrategies: React.FC<SavingStrategiesProps> = ({ userProfile }) => {
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);

  // Generate saving strategies based on user profile
  const getStrategies = (): SavingStrategy[] => {
    const { monthlyIncome, hasDebts, hasEmergencyFund } = userProfile;
    
    const strategies: SavingStrategy[] = [];
    
    // Strategy 1: 50/30/20 Budget Rule
    strategies.push({
      id: '1',
      title: 'Implement the 50/30/20 Budget Rule',
      description: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt payments.',
      potentialSaving: monthlyIncome * 0.05, // Assumes user can save an additional 5% through better budgeting
      difficulty: 'medium',
      timeFrame: 'immediate',
      steps: [
        'Track your expenses for a month to understand spending patterns',
        'Categorize expenses as needs (rent, utilities, groceries), wants (dining out, entertainment), and savings/debt',
        'Adjust spending to meet the 50/30/20 allocation',
        'Use automated transfers to ensure the savings portion is consistently set aside'
      ]
    });
    
    // Strategy 2: Reduce recurring subscriptions
    strategies.push({
      id: '2',
      title: 'Audit and Reduce Subscription Services',
      description: 'Review and cancel unused or unnecessary subscription services to reduce monthly expenses.',
      potentialSaving: 50, // Assumes $50/month in potential savings
      difficulty: 'easy',
      timeFrame: 'immediate',
      steps: [
        'List all subscription services and their monthly costs',
        'Identify overlapping services (multiple streaming platforms, etc.)',
        'Cancel services you rarely use or can consolidate',
        'Negotiate better rates on services you decide to keep',
        'Consider sharing subscription costs with family members when possible'
      ]
    });
    
    // Strategy 3: Emergency fund if they don't have one
    if (!hasEmergencyFund) {
      strategies.push({
        id: '3',
        title: 'Build an Emergency Fund',
        description: 'Create a dedicated savings fund covering 3-6 months of essential expenses for financial security.',
        potentialSaving: 0, // This is about building savings, not reducing expenses
        difficulty: 'medium',
        timeFrame: 'long-term',
        steps: [
          'Calculate your essential monthly expenses (housing, utilities, food, etc.)',
          'Set a target of 3-6 months of these expenses',
          'Open a high-yield savings account specifically for your emergency fund',
          'Set up automatic transfers to gradually build the fund',
          'Only use the emergency fund for genuine emergencies (job loss, medical issues, etc.)'
        ]
      });
    }
    
    // Strategy 4: High-interest debt payoff if they have debt
    if (hasDebts) {
      strategies.push({
        id: '4',
        title: 'High-Interest Debt Elimination Strategy',
        description: 'Focus on paying off high-interest debt to reduce interest payments and improve financial health.',
        potentialSaving: monthlyIncome * 0.10, // Assumes 10% of income going to interest payments that could be saved
        difficulty: 'hard',
        timeFrame: 'long-term',
        steps: [
          'List all debts with their interest rates and minimum payments',
          'Prioritize debts by interest rate (highest first)',
          'Pay minimum on all debts, but allocate extra funds to the highest-interest debt',
          'Once the highest-interest debt is paid off, move to the next highest (debt avalanche method)',
          'Consider balance transfer or debt consolidation for better interest rates'
        ]
      });
    }
    
    // Strategy 5: Automated savings
    strategies.push({
      id: '5',
      title: 'Set Up Automated Savings',
      description: 'Create automatic transfers to savings accounts on payday to ensure consistent savings before spending.',
      potentialSaving: monthlyIncome * 0.08, // Assumes 8% of income could be saved through automation
      difficulty: 'easy',
      timeFrame: 'immediate',
      steps: [
        'Determine a realistic savings amount (start with 5-10% of income)',
        'Open a high-yield savings account if you don't already have one',
        'Set up automatic transfers to occur on payday',
        'Create separate automated savings for different goals (retirement, home, travel, etc.)',
        'Gradually increase the percentage saved as your income increases'
      ]
    });
    
    // Strategy 6: Meal planning
    strategies.push({
      id: '6',
      title: 'Implement Meal Planning and Grocery Optimization',
      description: 'Reduce food expenses through strategic meal planning and smarter grocery shopping.',
      potentialSaving: 200, // Assumes $200/month in potential savings
      difficulty: 'medium',
      timeFrame: 'short-term',
      steps: [
        'Plan meals for the week before grocery shopping',
        'Create a shopping list based on planned meals and stick to it',
        'Buy in bulk for non-perishable items you use regularly',
        'Use cashback apps and loyalty programs for additional savings',
        'Limit eating out to special occasions'
      ]
    });
    
    // Strategy 7: Energy efficiency
    strategies.push({
      id: '7',
      title: 'Reduce Utility Costs Through Energy Efficiency',
      description: 'Lower monthly utility bills by implementing energy-saving practices and upgrades.',
      potentialSaving: 100, // Assumes $100/month in potential savings
      difficulty: 'medium',
      timeFrame: 'short-term',
      steps: [
        'Install a programmable thermostat to optimize heating and cooling',
        'Switch to LED light bulbs throughout your home',
        'Use power strips for electronics and turn them off when not in use',
        'Seal windows and doors to prevent air leaks',
        'Consider energy-efficient appliances when replacements are needed'
      ]
    });
    
    return strategies;
  };

  const strategies = getStrategies();

  const toggleStrategy = (id: string) => {
    if (expandedStrategy === id) {
      setExpandedStrategy(null);
    } else {
      setExpandedStrategy(id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'hard':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeFrameColor = (timeFrame: string) => {
    switch (timeFrame) {
      case 'immediate':
        return 'bg-finance-green-light text-finance-green-dark';
      case 'short-term':
        return 'bg-finance-blue-light text-finance-blue-dark';
      case 'long-term':
        return 'bg-finance-purple-light text-finance-purple-dark';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconForStrategy = (id: string) => {
    switch (id) {
      case '1':
        return <DollarSign className="h-5 w-5 text-finance-blue" />;
      case '2':
        return <Smartphone className="h-5 w-5 text-finance-purple" />;
      case '3':
        return <PiggyBank className="h-5 w-5 text-finance-green" />;
      case '4':
        return <CreditCard className="h-5 w-5 text-red-500" />;
      case '5':
        return <LineChart className="h-5 w-5 text-finance-blue" />;
      default:
        return <PiggyBank className="h-5 w-5 text-finance-green" />;
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Money-Saving Strategies</h2>
        <Button variant="outline" className="text-finance-blue border-finance-blue hover:bg-finance-blue hover:text-white transition-all duration-300">
          See All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="finance-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-finance-green-light flex items-center justify-center">
                    {getIconForStrategy(strategy.id)}
                  </div>
                  <div>
                    <h3 className="font-medium">{strategy.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className={getDifficultyColor(strategy.difficulty)}>
                        {strategy.difficulty}
                      </Badge>
                      <Badge variant="secondary" className={getTimeFrameColor(strategy.timeFrame)}>
                        {strategy.timeFrame}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStrategy(strategy.id)}
                  className="text-gray-500"
                >
                  {expandedStrategy === strategy.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{strategy.description}</p>
              
              <div className="flex items-center">
                <PiggyBank className="h-5 w-5 text-finance-green mr-2" />
                <p className="text-sm">
                  <span className="font-medium">Potential Monthly Savings:</span> ${strategy.potentialSaving.toLocaleString()}
                </p>
              </div>
              
              {expandedStrategy === strategy.id && (
                <div className="mt-6 animate-scale-in">
                  <h4 className="font-medium mb-3">Implementation Steps</h4>
                  <div className="space-y-3">
                    {strategy.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-finance-green-light flex items-center justify-center mt-0.5">
                          <Check className="h-3 w-3 text-finance-green" />
                        </div>
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full bg-finance-green hover:bg-finance-green-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover">
                      Add to My Plan
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavingStrategies;
