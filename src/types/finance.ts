export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  age?: number;
  monthlyIncome?: number;
  riskProfile?: RiskProfile;
  hasEmergencyFund?: boolean;
  emergencyFundMonths?: number;
  hasDebts?: boolean;
  debtDetails?: DebtDetail[];
  monthlyExpenses?: {
    userId: string;
    year: number;
    data: MonthlyAmount[];
  };
  monthlySavings?: MonthlySavings;
  financialGoals?: FinancialGoal[];
  investments?: Investment[];
}

export interface MonthlySavings {
  id: string;
  userId: string;
  year: number;
  data: MonthlyAmount[];
}

export interface MonthlyExpenses {
  id: string;
  userId: string;
  year: number;
  data: MonthlyAmount[];
}

export interface MonthlyAmount {
  month: number;
  amount: number;
  items?: ExpenseItem[];
}

export interface ExpenseItem {
  id: string;
  date: string;
  amount: number;
  category: 'housing' | 'food' | 'transportation' | 'utilities' | 'entertainment' | 'healthcare' | 'other';
  description?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface Investment {
  id: string;
  type: 'stocks' | 'bonds' | 'realEstate' | 'cash' | 'crypto' | 'other';
  name: string;
  value: number;
  annualReturn?: number;
}

export interface InvestmentRecommendation {
  id: string;
  title: string;
  description: string;
  riskLevel: RiskProfile;
  expectedReturn: string;
  timeHorizon: string;
  allocation: AllocationItem[];
}

export interface AllocationItem {
  type: string;
  percentage: number;
  color: string;
}

export interface SavingStrategy {
  id: string;
  title: string;
  description: string;
  potentialSaving: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeFrame: 'immediate' | 'short-term' | 'long-term';
  steps: string[];
}

export interface DebtDetail {
  id: string;
  type: 'credit_card' | 'loan' | 'mortgage' | 'other';
  amount: number;
  interestRate: number;
  minimumPayment: number;
}

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'index' | 'stock' | 'cryptocurrency' | 'commodity';
  lastUpdated: Date;
}

export interface MarketDataUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}
