import { UserProfile } from '@/types/finance';

// Debug mode disabled - using production requirements
const DEBUG_MODE = false;

/**
 * Centralized function to check if a user profile is complete enough for app navigation
 * Now only requires Personal Info and Risk Profile for basic functionality
 */
export const isProfileComplete = (profile: UserProfile | Partial<UserProfile> | null): boolean => {
    if (!profile) {
        console.log('Profile completion check: No profile provided');
        return false;
    }

    // In debug mode, use minimum requirements to help troubleshoot
    if (DEBUG_MODE) {
        console.log('DEBUG MODE: Using minimum profile requirements');
        return hasMinimumProfileData(profile);
    }

    // New simplified requirements: Only Personal Info + Risk Profile needed for app navigation
    const checks = {
        hasName: !!profile.name,
        hasAge: !!profile.age && profile.age > 0,
        hasIncome: !!profile.monthlyIncome && profile.monthlyIncome > 0,
        hasRiskProfile: profile.riskProfile !== undefined,
        hasEmergencyFundStatus: profile.hasEmergencyFund !== undefined
    };

    console.log('Profile completion checks (simplified):', checks);
    console.log('Profile data:', {
        name: profile.name,
        age: profile.age,
        monthlyIncome: profile.monthlyIncome,
        riskProfile: profile.riskProfile,
        hasEmergencyFund: profile.hasEmergencyFund
    });

    const isComplete = Object.values(checks).every(check => check === true);
    console.log('Profile is complete for app navigation:', isComplete);

    return isComplete;
};

/**
 * Check if a profile has the minimum required fields (for basic functionality)
 * Same as isProfileComplete now - Personal Info + Risk Profile
 */
export const hasMinimumProfileData = (profile: UserProfile | Partial<UserProfile> | null): boolean => {
    if (!profile) return false;

    const isMinimal = !!(
        profile.name &&
        profile.age && profile.age > 0 &&
        profile.monthlyIncome && profile.monthlyIncome > 0 &&
        profile.riskProfile !== undefined &&
        profile.hasEmergencyFund !== undefined
    );

    console.log('Profile has minimum data:', isMinimal);
    return isMinimal;
};

/**
 * Check if the full onboarding is complete (all steps)
 * This is for showing completion status, not for app navigation
 */
export const isFullOnboardingComplete = (profile: UserProfile | Partial<UserProfile> | null): boolean => {
    if (!profile) {
        console.log('Full onboarding check: No profile provided');
        return false;
    }

    const fullChecks = {
        hasName: !!profile.name,
        hasAge: !!profile.age && profile.age > 0,
        hasIncome: !!profile.monthlyIncome && profile.monthlyIncome > 0,
        hasRiskProfile: profile.riskProfile !== undefined,
        hasEmergencyFundStatus: profile.hasEmergencyFund !== undefined,
        hasExpenses: !!profile.monthlyExpenses && profile.monthlyExpenses.data && profile.monthlyExpenses.data.length > 0,
        hasSavings: !!profile.monthlySavings && profile.monthlySavings.data && profile.monthlySavings.data.length > 0,
        hasGoals: !!profile.financialGoals && profile.financialGoals.length > 0,
        hasInvestments: !!profile.investments && profile.investments.length > 0
    };

    console.log('Full onboarding completion checks:', fullChecks);

    const isFullyComplete = Object.values(fullChecks).every(check => check === true);
    console.log('Full onboarding is complete:', isFullyComplete);

    return isFullyComplete;
}; 