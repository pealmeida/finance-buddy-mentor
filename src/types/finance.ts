export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export type Currency = 'USD' | 'EUR' | 'BRL';
export type Language = 'en' | 'pt-BR';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  phoneVerified?: boolean;
  whatsAppNumber?: string;
  whatsAppVerified?: boolean;
  whatsAppAgentEnabled?: boolean;
  whatsAppAgentConfig?: WhatsAppAgentConfig;
  birthdate?: string;
  age?: number;
  monthlyIncome?: number;
  riskProfile?: RiskProfile;
  hasEmergencyFund?: boolean;
  emergencyFundMonths?: number;
  hasDebts?: boolean;
  preferredCurrency?: Currency;
  preferredLanguage?: Language;
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
  year: number;
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
  type: 'stocks' | 'bonds' | 'fixedIncome' | 'realEstate' | 'cash' | 'crypto' | 'other';
  name: string;
  value: number;
  annualReturn?: number;
  isEmergencyFund?: boolean;
  purchaseDate?: string;
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

export interface WhatsAppAgentConfig {
  dailyUpdates: boolean;
  weeklyReports: boolean;
  goalReminders: boolean;
  expenseAlerts: boolean;
  investmentUpdates: boolean;
  spendingLimitAlerts: boolean;
  emergencyFundAlerts: boolean;
  customAlertThreshold?: number;
  preferredUpdateTime?: string; // HH:MM format
}
