import { supabase } from "../../integrations/supabase/client";
import { Currency, Language } from "../../types/finance";

/**
 * Update user profile preferences in the database
 */
export const updateProfilePreferences = async (
    userId: string,
    preferences: {
        preferredCurrency?: Currency;
        preferredLanguage?: Language;
    }
): Promise<boolean> => {
    try {
        // Update the profiles table with preferences
        const { error } = await supabase
            .from('profiles')
            .update({
                preferred_currency: preferences.preferredCurrency,
                preferred_language: preferences.preferredLanguage,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) {
            console.error('Error updating profile preferences:', error);
            return false;
        }

        // Also save to localStorage for immediate use
        if (preferences.preferredCurrency) {
            localStorage.setItem('currency', preferences.preferredCurrency);
        }

        if (preferences.preferredLanguage) {
            localStorage.setItem('language', preferences.preferredLanguage);
        }

        console.log('updateProfilePreferences: Successfully updated preferences');
        return true;
    } catch (error) {
        console.error('Error in updateProfilePreferences:', error);
        return false;
    }
};

/**
 * Sync localStorage preferences with the database
 */
export const syncPreferencesToDatabase = async (userId: string): Promise<void> => {
    try {
        const currency = localStorage.getItem('currency') as Currency;
        const language = localStorage.getItem('language') as Language;

        if (currency || language) {
            await updateProfilePreferences(userId, {
                preferredCurrency: currency,
                preferredLanguage: language
            });
        }
    } catch (error) {
        console.error('Error syncing preferences to database:', error);
    }
};

/**
 * Get preferences from localStorage with defaults
 */
export const getLocalPreferences = () => {
    return {
        currency: (localStorage.getItem('currency') as Currency) || 'BRL',
        language: (localStorage.getItem('language') as Language) || 'pt-BR'
    };
}; 