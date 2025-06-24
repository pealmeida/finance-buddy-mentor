import { supabase } from "../../integrations/supabase/client";
import { UserProfile, RiskProfile, MonthlyAmount, Currency, Language } from "../../types/finance";
import { validateRiskProfile } from "./profileValidation";
import { convertToTypedSavingsData } from "../../hooks/supabase/utils/savingsUtils";
import { Json } from "../../integrations/supabase/types";

/**
 * Get preferred currency from localStorage or default to USD
 */
const getPreferredCurrency = (): Currency => {
  const saved = localStorage.getItem('currency');
  return (saved as Currency) || 'USD';
};

/**
 * Get preferred language from localStorage or default to en
 */
const getPreferredLanguage = (): Language => {
  const saved = localStorage.getItem('language');
  return (saved as Language) || 'en';
};

/**
 * Save currency preference to localStorage and update currency context
 */
const savePreferredCurrency = (currency: Currency) => {
  localStorage.setItem('currency', currency);
  // Trigger currency context update if available
  window.dispatchEvent(new CustomEvent('currencyChange', { detail: currency }));
};

/**
 * Save language preference to localStorage and update i18n
 */
const savePreferredLanguage = (language: Language) => {
  localStorage.setItem('language', language);
  // Trigger i18n language change if available
  window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
};

/**
 * Convert raw JSON data to typed MonthlyAmount array for expenses
 */
const convertToTypedExpensesData = (data: Json | null, year: number = new Date().getFullYear()): MonthlyAmount[] => {
  if (!data || typeof data !== 'object' || !Array.isArray(data)) {
    return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, year, amount: 0 }));
  }

  try {
    const typedData = data.map(item => {
      if (typeof item === 'object' && item !== null) {
        const itemObj = item as Record<string, unknown>;
        const month = typeof itemObj.month === 'number' ? itemObj.month : 0;
        const amount = typeof itemObj.amount === 'number' ? itemObj.amount : 0;
        const itemYear = typeof itemObj.year === 'number' ? itemObj.year : year;
        return { month, year: itemYear, amount };
      }
      return { month: 0, year, amount: 0 };
    }).filter(item => item.month >= 1 && item.month <= 12);

    if (typedData.length !== 12) {
      const completeData = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, year, amount: 0 }));
      typedData.forEach(item => {
        if (item.month >= 1 && item.month <= 12) {
          completeData[item.month - 1] = item;
        }
      });
      return completeData;
    }

    return typedData.sort((a, b) => a.month - b.month);
  } catch (error) {
    console.error("Error converting JSON to typed expenses data:", error);
    return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, year, amount: 0 }));
  }
};

/**
 * Fetches user profile data from Supabase
 */
export const fetchUserProfileFromSupabase = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Fetch basic profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    // Fetch financial profile
    const { data: financialProfileData, error: financialProfileError } = await supabase
      .from('financial_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (financialProfileError && financialProfileError.code !== 'PGRST116') {
      throw new Error(`Error fetching financial profile: ${financialProfileError.message}`);
    }

    // Create a new profile if it doesn't exist
    if (!profileData) {
      return null;
    }

    // Fetch the related data
    const { data: goalsData } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId);

    const { data: investmentsData } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId);

    const { data: debtDetailsData } = await supabase
      .from('debt_details')
      .select('*')
      .eq('user_id', userId);

    // Fetch monthly expenses data
    const { data: monthlyExpensesData } = await supabase
      .from('monthly_expenses')
      .select('*')
      .eq('user_id', userId);

    // Fetch monthly savings data
    const { data: monthlySavingsData } = await supabase
      .from('monthly_savings')
      .select('*')
      .eq('user_id', userId);

    // Transform goals data
    const financialGoals = goalsData ? goalsData.map((goal: any) => ({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      targetDate: new Date(goal.target_date),
      priority: goal.priority as 'low' | 'medium' | 'high'
    })) : [];

    // Transform investments data
    const investments = investmentsData ? investmentsData.map((investment: any) => ({
      id: investment.id,
      type: investment.type as 'stocks' | 'bonds' | 'realEstate' | 'cash' | 'crypto' | 'other',
      name: investment.name,
      value: investment.value,
      annualReturn: investment.annual_return
    })) : [];



    // Transform debt details data
    const debtDetails = debtDetailsData ? debtDetailsData.map((debt: any) => ({
      id: debt.id,
      type: debt.type as 'credit_card' | 'loan' | 'mortgage' | 'other',
      name: debt.name,
      amount: debt.amount,
      interestRate: debt.interest_rate,
      minimumPayment: debt.minimum_payment
    })) : [];

    // Transform monthly expenses data
    const monthlyExpenses = monthlyExpensesData && monthlyExpensesData.length > 0 ? {
      userId: userId,
      year: monthlyExpensesData[0].year,
      data: convertToTypedExpensesData(monthlyExpensesData[0].data, monthlyExpensesData[0].year)
    } : undefined;

    // Transform monthly savings data
    const monthlySavings = monthlySavingsData && monthlySavingsData.length > 0 ? {
      id: monthlySavingsData[0].id,
      userId: userId,
      year: monthlySavingsData[0].year,
      data: convertToTypedSavingsData(monthlySavingsData[0].data)
    } : undefined;



    // Ensure riskProfile is a valid RiskProfile type
    const riskProfile = validateRiskProfile(financialProfileData?.risk_profile ?? null);

    // Get preferences from localStorage or database, with localStorage taking priority
    const preferredCurrency = (profileData as any)?.preferred_currency as Currency || getPreferredCurrency();
    const preferredLanguage = (profileData as any)?.preferred_language as Language || getPreferredLanguage();



    // Save preferences to localStorage to ensure consistency
    if (preferredCurrency) savePreferredCurrency(preferredCurrency);
    if (preferredLanguage) savePreferredLanguage(preferredLanguage);

    // Combine data from both tables into a user profile object
    return {
      id: profileData.id || userId,
      email: profileData.email || 'user@example.com',
      name: profileData.name || 'User',
      age: profileData.age || 0,
      monthlyIncome: financialProfileData?.monthly_income || 0,
      riskProfile: riskProfile,
      hasEmergencyFund: financialProfileData?.has_emergency_fund || false,
      emergencyFundMonths: financialProfileData?.emergency_fund_months ?? undefined,
      hasDebts: financialProfileData?.has_debts || false,
      preferredCurrency,
      preferredLanguage,
      financialGoals,
      investments,
      debtDetails,
      monthlyExpenses,
      monthlySavings,
    };
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
};
