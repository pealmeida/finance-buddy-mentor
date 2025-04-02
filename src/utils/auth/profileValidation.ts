
import { RiskProfile } from "@/types/finance";

/**
 * Validates risk profile type to ensure it's one of the allowed values
 */
export const validateRiskProfile = (profile: string | null): RiskProfile => {
  if (profile === 'conservative' || profile === 'moderate' || profile === 'aggressive') {
    return profile as RiskProfile;
  }
  return 'moderate'; // Default to moderate if invalid value
};
