
/**
 * Secure storage utilities with encryption for sensitive data
 */

// Simple encryption/decryption using base64 for demonstration
// In production, use proper encryption libraries like crypto-js
const STORAGE_KEY_PREFIX = 'finance_buddy_';

/**
 * Simple encryption function (for demonstration - use proper encryption in production)
 */
const encrypt = (data: string): string => {
  try {
    return btoa(encodeURIComponent(data));
  } catch {
    return data;
  }
};

/**
 * Simple decryption function (for demonstration - use proper encryption in production)
 */
const decrypt = (encryptedData: string): string => {
  try {
    return decodeURIComponent(atob(encryptedData));
  } catch {
    return encryptedData;
  }
};

/**
 * Securely store data in localStorage with encryption
 */
export const secureSetItem = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    const encryptedValue = encrypt(serializedValue);
    localStorage.setItem(STORAGE_KEY_PREFIX + key, encryptedValue);
  } catch (error) {
    console.error('Error storing secure data:', error);
  }
};

/**
 * Securely retrieve data from localStorage with decryption
 */
export const secureGetItem = <T = any>(key: string): T | null => {
  try {
    const encryptedValue = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!encryptedValue) return null;
    
    const decryptedValue = decrypt(encryptedValue);
    return JSON.parse(decryptedValue) as T;
  } catch (error) {
    console.error('Error retrieving secure data:', error);
    return null;
  }
};

/**
 * Securely remove data from localStorage
 */
export const secureRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + key);
  } catch (error) {
    console.error('Error removing secure data:', error);
  }
};

/**
 * Clear all secure storage data
 */
export const secureClearAll = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing secure storage:', error);
  }
};

/**
 * Check if secure storage is available
 */
export const isSecureStorageAvailable = (): boolean => {
  try {
    const testKey = STORAGE_KEY_PREFIX + 'test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};
