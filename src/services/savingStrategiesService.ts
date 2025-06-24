import { SavingStrategy, UserProfile } from '@/types/finance';
import i18n from '../i18n';

// Generate saving strategies based on user profile
export const generateSavingStrategies = (userProfile: UserProfile): SavingStrategy[] => {
  const { monthlyIncome = 0, hasDebts, hasEmergencyFund } = userProfile;

  const strategies: SavingStrategy[] = [];

  // Strategy 1: 50/30/20 Budget Rule
  strategies.push({
    id: '1',
    title: i18n.t('savings.strategies.strategyTitles.budgetRule', 'Implement the 50/30/20 Budget Rule'),
    description: i18n.t('savings.strategies.strategyDescriptions.budgetRule', 'Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt payments.'),
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
    title: i18n.t('savings.strategies.strategyTitles.subscriptions', 'Audit and Reduce Subscription Services'),
    description: i18n.t('savings.strategies.strategyDescriptions.subscriptions', 'Review and cancel unused or unnecessary subscription services to reduce monthly expenses.'),
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
      title: i18n.t('savings.strategies.strategyTitles.emergencyFund', 'Build an Emergency Fund'),
      description: i18n.t('savings.strategies.strategyDescriptions.emergencyFund', 'Create a dedicated savings fund covering 3-6 months of essential expenses for financial security.'),
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
      title: i18n.t('savings.strategies.strategyTitles.debtElimination', 'High-Interest Debt Elimination Strategy'),
      description: i18n.t('savings.strategies.strategyDescriptions.debtElimination', 'Focus on paying off high-interest debt to reduce interest payments and improve financial health.'),
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
    title: i18n.t('savings.strategies.strategyTitles.automatedSavings', 'Set Up Automated Savings'),
    description: i18n.t('savings.strategies.strategyDescriptions.automatedSavings', 'Create automatic transfers to savings accounts on payday to ensure consistent savings before spending.'),
    potentialSaving: monthlyIncome * 0.08, // Assumes 8% of income could be saved through automation
    difficulty: 'easy',
    timeFrame: 'immediate',
    steps: [
      'Determine a realistic savings amount (start with 5-10% of income)',
      "Open a high-yield savings account if you don't already have one",
      'Set up automatic transfers to occur on payday',
      'Create separate automated savings for different goals (retirement, home, travel, etc.)',
      'Gradually increase the percentage saved as your income increases'
    ]
  });

  // Strategy 6: Meal planning
  strategies.push({
    id: '6',
    title: i18n.t('savings.strategies.strategyTitles.mealPlanning', 'Implement Meal Planning and Grocery Optimization'),
    description: i18n.t('savings.strategies.strategyDescriptions.mealPlanning', 'Reduce food expenses through strategic meal planning and smarter grocery shopping.'),
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
    title: i18n.t('savings.strategies.strategyTitles.energyEfficiency', 'Reduce Utility Costs Through Energy Efficiency'),
    description: i18n.t('savings.strategies.strategyDescriptions.energyEfficiency', 'Lower monthly utility bills by implementing energy-saving practices and upgrades.'),
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
