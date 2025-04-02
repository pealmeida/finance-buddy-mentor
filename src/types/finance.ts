export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  monthlyIncome: number;
  riskProfile: RiskProfile;
  hasEmergencyFund: boolean;
  emergencyFundMonths?: number;
  hasDebts: boolean;
  debtDetails?: DebtDetail[];
  financialGoals: FinancialGoal[];
  investments: Investment[];
  monthlySavings?: MonthlySavings;
}

export interface MonthlySavings {
  id: string;
  userId: string;
  year: number;
  data: MonthlyAmount[];
}

export interface MonthlyAmount {
  month: number; // 1-12 representing Jan-Dec
  amount: number;
}

export interface DebtDetail {
  id: string;
  type: 'creditCard' | 'personalLoan' | 'studentLoan' | 'other';
  name: string;
  amount: number;
  interestRate: number;
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
