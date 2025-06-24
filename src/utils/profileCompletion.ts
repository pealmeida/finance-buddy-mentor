import { UserProfile } from '@/types/finance';

// Debug mode disabled - using production requirements
const DEBUG_MODE = false;

/**
 * Centralized function to check if a user profile is complete enough for app navigation
 * Now only requires Personal Info and Risk Profile for basic functionality
 */
export const isProfileComplete = (profile: UserProfile | Partial<UserProfile> | null): boolean => {
    if (!profile) {
        return false;
    }

    // In debug mode, use minimum requirements to help troubleshoot
    if (DEBUG_MODE) {
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
    const isComplete = Object.values(checks).every(check => check === true);
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
    const isFullyComplete = Object.values(fullChecks).every(check => check === true);
    return isFullyComplete;
};

/**
 * Calculate age from birthdate string (YYYY-MM-DD format)
 */
export const calculateAge = (birthdateStr: string | null | undefined): number => {
    if (!birthdateStr) return 0;

    try {
        const birthDate = new Date(birthdateStr);
        const today = new Date();

        // Check if the date is valid
        if (isNaN(birthDate.getTime())) return 0;

        let ageYears = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            ageYears--;
        }

        return ageYears >= 0 ? ageYears : 0;
    } catch (error) {
        console.error('Error calculating age:', error);
        return 0;
    }
};

/**
 * Handler to update profile with calculated age from birthdate
 */
export const handleBirthdateChange = (
    birthdate: string,
    onProfileUpdate: (updates: { birthdate: string; age: number }) => void
) => {
    const calculatedAge = calculateAge(birthdate);
    onProfileUpdate({
        birthdate,
        age: calculatedAge
    });
}; 