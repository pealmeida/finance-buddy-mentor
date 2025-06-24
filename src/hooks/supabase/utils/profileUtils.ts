import { supabase } from '@/integrations/supabase/client';
import { UserProfile, RiskProfile } from '@/types/finance';

/**
 * Validates if a risk profile is of the correct type
 * @param profile Risk profile string
 * @returns A valid RiskProfile value
 */
export const validateRiskProfile = (profile: string | undefined): RiskProfile => {
  if (profile === 'conservative' || profile === 'moderate' || profile === 'aggressive') {
    return profile as RiskProfile;
  }
  return 'moderate'; // Default to moderate if invalid value
};

/**
 * Updates a user's phone number in the auth profile
 * Note: This function doesn't handle verification. In a real app,
 * you would need to implement the verification flow.
 * 
 * @param phone The phone number to update
 * @returns Success status
 */
export const updateUserPhone = async (phone: string): Promise<boolean> => {
  try {
    // In a real implementation, this would trigger a verification flow
    // For now, we'll just log that we would update the phone
    console.log(`Would update phone to ${phone}`);

    // This is commented out because it requires verification flow
    // const { error } = await supabase.auth.updateUser({
    //   phone: phone
    // });

    // if (error) {
    //   console.error('Error updating phone:', error);
    //   return false;
    // }

    return true;
  } catch (err) {
    console.error('Error updating phone:', err);
    return false;
  }
};

/**
 * Sends a WhatsApp verification code to the user's WhatsApp number
 * In a real implementation, this would integrate with WhatsApp Business API
 * 
 * @param whatsAppNumber The WhatsApp number to verify
 * @returns Success status
 */
export const sendWhatsAppVerificationCode = async (whatsAppNumber: string): Promise<boolean> => {
  try {
    // In a real implementation, this would call WhatsApp Business API
    // to send a verification code via WhatsApp message
    console.log(`Would send WhatsApp verification code to ${whatsAppNumber}`);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For now, always return true (success)
    return true;
  } catch (err) {
    console.error('Error sending WhatsApp verification code:', err);
    return false;
  }
};

/**
 * Verifies a WhatsApp verification code
 * In a real implementation, this would validate the code against the one sent
 * 
 * @param whatsAppNumber The WhatsApp number being verified
 * @param code The verification code entered by user
 * @returns Success status
 */
export const verifyWhatsAppCode = async (whatsAppNumber: string, code: string): Promise<boolean> => {
  try {
    // In a real implementation, this would validate the code
    console.log(`Would verify code ${code} for WhatsApp number ${whatsAppNumber}`);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo purposes, accept any 4+ digit code
    if (code.length >= 4) {
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error verifying WhatsApp code:', err);
    return false;
  }
};

/**
 * Updates WhatsApp verification status and agent configuration in local storage
 * Note: In a real implementation, you would add WhatsApp columns to your database schema
 * 
 * @param userId User ID
 * @param whatsAppNumber The verified WhatsApp number
 * @param agentEnabled Whether to enable the WhatsApp agent
 * @returns Success status
 */
export const updateWhatsAppProfile = async (
  userId: string,
  whatsAppNumber: string,
  agentEnabled: boolean = true
): Promise<boolean> => {
  try {
    // For now, store WhatsApp info in localStorage (in a real app, you'd add DB columns)
    const whatsAppData = {
      userId,
      whatsAppNumber,
      whatsAppVerified: true,
      whatsAppAgentEnabled: agentEnabled,
      whatsAppAgentConfig: {
        dailyUpdates: true,
        weeklyReports: true,
        goalReminders: true,
        expenseAlerts: true,
        investmentUpdates: false,
        spendingLimitAlerts: true,
        emergencyFundAlerts: true,
        customAlertThreshold: 500,
        preferredUpdateTime: '09:00'
      }
    };

    localStorage.setItem(`whatsapp_config_${userId}`, JSON.stringify(whatsAppData));
    console.log('WhatsApp configuration stored locally for user:', userId);

    return true;
  } catch (err) {
    console.error('Error updating WhatsApp profile:', err);
    return false;
  }
};

/**
 * Save basic profile and financial profile data
 * @param userId User ID
 * @param profile User profile data
 */
export const saveBasicProfile = async (userId: string, profile: UserProfile) => {
  // Upsert basic profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      name: profile.name || '',
      email: profile.email || '',
      age: profile.age || 0
    }, { onConflict: 'id' });

  if (profileError) throw new Error(`Error updating profile: ${profileError.message}`);

  // Validate and ensure risk profile is correct
  const validRiskProfile = validateRiskProfile(profile.riskProfile);

  // Upsert financial profile
  const { error: financialProfileError } = await supabase
    .from('financial_profiles')
    .upsert({
      id: userId,
      monthly_income: profile.monthlyIncome || 0,
      risk_profile: validRiskProfile,
      has_emergency_fund: profile.hasEmergencyFund || false,
      emergency_fund_months: profile.emergencyFundMonths || 0,
      has_debts: profile.hasDebts || false
    }, { onConflict: 'id' });

  if (financialProfileError) throw new Error(`Error updating financial profile: ${financialProfileError.message}`);

  // Update phone number if provided
  if (profile.phone) {
    try {
      // Get current user data to check if phone has changed
      const { data: userData } = await supabase.auth.getUser();

      // Only update if the phone number has changed
      if (userData?.user && userData.user.phone !== profile.phone) {
        await updateUserPhone(profile.phone);
      }
    } catch (err) {
      console.error('Error handling phone update:', err);
      // Don't throw error here, as we still want to save the rest of the profile
    }
  }
};
