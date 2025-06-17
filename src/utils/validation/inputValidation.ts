
/**
 * Comprehensive input validation utilities for financial data
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate age input
 */
export const validateAge = (age: number): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof age !== 'number' || isNaN(age)) {
    errors.push('Age must be a valid number');
  } else if (age < 0) {
    errors.push('Age cannot be negative');
  } else if (age > 150) {
    errors.push('Age cannot exceed 150 years');
  } else if (age < 18) {
    errors.push('Must be at least 18 years old');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate monthly income
 */
export const validateMonthlyIncome = (income: number): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof income !== 'number' || isNaN(income)) {
    errors.push('Monthly income must be a valid number');
  } else if (income < 0) {
    errors.push('Monthly income cannot be negative');
  } else if (income > 10000000) {
    errors.push('Monthly income cannot exceed $10,000,000');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate financial amount (for investments, debts, etc.)
 */
export const validateFinancialAmount = (amount: number, fieldName: string = 'Amount'): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof amount !== 'number' || isNaN(amount)) {
    errors.push(`${fieldName} must be a valid number`);
  } else if (amount < 0) {
    errors.push(`${fieldName} cannot be negative`);
  } else if (amount > 100000000) {
    errors.push(`${fieldName} cannot exceed $100,000,000`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate interest rate
 */
export const validateInterestRate = (rate: number): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof rate !== 'number' || isNaN(rate)) {
    errors.push('Interest rate must be a valid number');
  } else if (rate < 0) {
    errors.push('Interest rate cannot be negative');
  } else if (rate > 100) {
    errors.push('Interest rate cannot exceed 100%');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate date input
 */
export const validateDate = (date: Date | string, allowPastDates: boolean = true): ValidationResult => {
  const errors: string[] = [];
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!dateObj || isNaN(dateObj.getTime())) {
    errors.push('Invalid date format');
  } else {
    const now = new Date();
    const minDate = new Date('1900-01-01');
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 50);
    
    if (dateObj < minDate) {
      errors.push('Date cannot be before 1900');
    } else if (dateObj > maxDate) {
      errors.push('Date cannot be more than 50 years in the future');
    } else if (!allowPastDates && dateObj < now) {
      errors.push('Date cannot be in the past');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize text input to prevent XSS
 */
export const sanitizeText = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  } else if (email.length > 254) {
    errors.push('Email is too long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate name input
 */
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('Name is required');
  } else if (name.trim().length < 1) {
    errors.push('Name cannot be empty');
  } else if (name.length > 100) {
    errors.push('Name is too long');
  } else if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
    errors.push('Name contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate all profile data at once
 */
export const validateUserProfile = (profile: any): ValidationResult => {
  const allErrors: string[] = [];
  
  if (profile.name) {
    const nameValidation = validateName(profile.name);
    allErrors.push(...nameValidation.errors);
  }
  
  if (profile.email) {
    const emailValidation = validateEmail(profile.email);
    allErrors.push(...emailValidation.errors);
  }
  
  if (typeof profile.age === 'number') {
    const ageValidation = validateAge(profile.age);
    allErrors.push(...ageValidation.errors);
  }
  
  if (typeof profile.monthlyIncome === 'number') {
    const incomeValidation = validateMonthlyIncome(profile.monthlyIncome);
    allErrors.push(...incomeValidation.errors);
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};
