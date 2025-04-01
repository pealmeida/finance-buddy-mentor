export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface UserProfile {
  id?: string;
  email: string; // Added email field that will be used as ID
  name: string;
  age: number;
  monthlyIncome: number;
  riskProfile: RiskProfile;
  hasEmergencyFund: boolean;
  emergencyFundMonths?: number; // Added this property
  hasDebts: boolean;
  debtDetails?: DebtDetail[]; // Added this property to store debt information
  financialGoals: FinancialGoal[];
  investments: Investment[];
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
