
import { UserProfile, FinancialGoal, Investment, DebtDetail } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { logger } from '@/utils/logger';

/**
 * Service for handling profile-related operations
 */
export class ProfileService {
  /**
   * Loads a user profile from Supabase
   */
  static async loadProfile(userId: string): Promise<UserProfile | null> {
    try {
      logger.info("Loading profile for user:", userId);
      
      // Check if user exists in auth
      const { data: authData, error: authError } = await supabase.auth.getUser(userId);
      
      if (authError) {
        logger.error("Auth error:", authError);
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      // Fetch basic profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is okay - we'll create a new profile
        logger.error("Profile fetch error:", profileError);
        throw new Error(`Profile error: ${profileError.message}`);
      }
      
      // Fetch financial profile
      const { data: financialProfile, error: financialError } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (financialError && financialError.code !== 'PGRST116') {
        logger.error("Financial profile fetch error:", financialError);
        throw new Error(`Financial profile error: ${financialError.message}`);
      }
      
      // Fetch related data
      const [goals, investments, debts] = await Promise.all([
        this.loadFinancialGoals(userId),
        this.loadInvestments(userId),
        this.loadDebtDetails(userId)
      ]);
      
      // Combine all data into a comprehensive profile
      const userProfile: UserProfile = {
        id: userId,
        email: profile?.email || authData.user?.email || 'user@example.com',
        name: profile?.name || (authData.user?.user_metadata?.name as string) || 'User',
        age: profile?.age || 0,
        monthlyIncome: financialProfile?.monthly_income || 0,
        riskProfile: (financialProfile?.risk_profile as any) || 'moderate',
        hasEmergencyFund: financialProfile?.has_emergency_fund || false,
        hasDebts: financialProfile?.has_debts || false,
        financialGoals: goals,
        investments: investments,
        debtDetails: debts
      };
      
      logger.info("Profile loaded successfully");
      return userProfile;
    } catch (err) {
      logger.error("Error loading profile:", err);
      toast({
        title: "Failed to load profile",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      return null;
    }
  }
  
  /**
   * Saves a user profile to Supabase
   */
  static async saveProfile(profile: UserProfile): Promise<boolean> {
    try {
      logger.info("Saving profile for user:", profile.id);
      
      // Save basic profile info
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          age: profile.age || 0
        }, { onConflict: 'id' });
        
      if (profileError) {
        throw new Error(`Error saving basic profile: ${profileError.message}`);
      }
      
      // Save financial profile
      const { error: financialError } = await supabase
        .from('financial_profiles')
        .upsert({
          id: profile.id,
          monthly_income: profile.monthlyIncome || 0,
          risk_profile: profile.riskProfile || 'moderate',
          has_emergency_fund: profile.hasEmergencyFund || false,
          has_debts: profile.hasDebts || false
        }, { onConflict: 'id' });
        
      if (financialError) {
        throw new Error(`Error saving financial profile: ${financialError.message}`);
      }
      
      // Save related data
      await Promise.all([
        this.saveFinancialGoals(profile.id, profile.financialGoals || []),
        this.saveInvestments(profile.id, profile.investments || []),
        this.saveDebtDetails(profile.id, profile.debtDetails || [])
      ]);
      
      logger.info("Profile saved successfully");
      return true;
    } catch (err) {
      logger.error("Error saving profile:", err);
      toast({
        title: "Failed to save profile",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  }
  
  /**
   * Load financial goals for a user
   */
  private static async loadFinancialGoals(userId: string): Promise<FinancialGoal[]> {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw new Error(`Error loading goals: ${error.message}`);
      
      return (data || []).map(goal => ({
        id: goal.id,
        name: goal.name,
        targetAmount: goal.target_amount,
        currentAmount: goal.current_amount || 0,
        targetDate: new Date(goal.target_date),
        priority: goal.priority as 'low' | 'medium' | 'high'
      }));
    } catch (err) {
      logger.error("Error loading goals:", err);
      return [];
    }
  }
  
  /**
   * Load investments for a user
   */
  private static async loadInvestments(userId: string): Promise<Investment[]> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw new Error(`Error loading investments: ${error.message}`);
      
      return (data || []).map(investment => ({
        id: investment.id,
        type: investment.type as 'stocks' | 'bonds' | 'realEstate' | 'cash' | 'crypto' | 'other',
        name: investment.name,
        value: investment.value,
        annualReturn: investment.annual_return
      }));
    } catch (err) {
      logger.error("Error loading investments:", err);
      return [];
    }
  }
  
  /**
   * Load debt details for a user
   */
  private static async loadDebtDetails(userId: string): Promise<DebtDetail[]> {
    try {
      const { data, error } = await supabase
        .from('debt_details')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw new Error(`Error loading debts: ${error.message}`);
      
      return (data || []).map(debt => ({
        id: debt.id,
        type: debt.type as 'creditCard' | 'personalLoan' | 'studentLoan' | 'other',
        name: debt.name,
        amount: debt.amount,
        interestRate: debt.interest_rate
      }));
    } catch (err) {
      logger.error("Error loading debts:", err);
      return [];
    }
  }
  
  /**
   * Save financial goals for a user
   */
  private static async saveFinancialGoals(userId: string, goals: FinancialGoal[]): Promise<void> {
    try {
      // First delete existing goals
      await supabase
        .from('financial_goals')
        .delete()
        .eq('user_id', userId);
        
      if (goals.length === 0) return;
      
      // Insert new goals
      const { error } = await supabase
        .from('financial_goals')
        .insert(goals.map(goal => ({
          id: goal.id,
          user_id: userId,
          name: goal.name,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount || 0,
          target_date: goal.targetDate instanceof Date 
            ? goal.targetDate.toISOString().split('T')[0] 
            : new Date(goal.targetDate).toISOString().split('T')[0],
          priority: goal.priority
        })));
        
      if (error) throw new Error(`Error saving goals: ${error.message}`);
    } catch (err) {
      logger.error("Error saving goals:", err);
      throw err;
    }
  }
  
  /**
   * Save investments for a user
   */
  private static async saveInvestments(userId: string, investments: Investment[]): Promise<void> {
    try {
      // First delete existing investments
      await supabase
        .from('investments')
        .delete()
        .eq('user_id', userId);
        
      if (investments.length === 0) return;
      
      // Insert new investments
      const { error } = await supabase
        .from('investments')
        .insert(investments.map(investment => ({
          id: investment.id,
          user_id: userId,
          type: investment.type,
          name: investment.name,
          value: investment.value,
          annual_return: investment.annualReturn || 0
        })));
        
      if (error) throw new Error(`Error saving investments: ${error.message}`);
    } catch (err) {
      logger.error("Error saving investments:", err);
      throw err;
    }
  }
  
  /**
   * Save debt details for a user
   */
  private static async saveDebtDetails(userId: string, debts: DebtDetail[]): Promise<void> {
    try {
      // First delete existing debts
      await supabase
        .from('debt_details')
        .delete()
        .eq('user_id', userId);
        
      if (debts.length === 0) return;
      
      // Insert new debts
      const { error } = await supabase
        .from('debt_details')
        .insert(debts.map(debt => ({
          id: debt.id,
          user_id: userId,
          type: debt.type,
          name: debt.name,
          amount: debt.amount,
          interest_rate: debt.interestRate || 0
        })));
        
      if (error) throw new Error(`Error saving debts: ${error.message}`);
    } catch (err) {
      logger.error("Error saving debts:", err);
      throw err;
    }
  }
}
