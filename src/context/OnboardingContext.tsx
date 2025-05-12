
import React, { createContext, useContext, useState } from "react";
import {
  FinancialGoal,
  Investment,
  RiskProfile,
  UserProfile,
} from "@/types/finance";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/utils/logger";

interface OnboardingContextType {
  profile: Partial<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  currentGoal: {
    name: string;
    targetAmount: number;
    targetDate: Date;
    priority: "low" | "medium" | "high";
  };
  updateCurrentGoal: (updates: Partial<typeof initialCurrentGoal>) => void;
  addGoal: () => void;
  removeGoal: (id: string) => void;
  currentInvestment: {
    type: "stocks" | "bonds" | "realEstate" | "cash" | "crypto" | "other";
    name: string;
    value: number;
  };
  updateCurrentInvestment: (
    updates: Partial<typeof initialCurrentInvestment>
  ) => void;
  addInvestment: () => void;
  removeInvestment: (id: string) => void;
}

const initialProfile: Partial<UserProfile> = {
  email: "",
  name: "",
  age: 0,
  monthlyIncome: 0,
  riskProfile: "moderate",
  hasEmergencyFund: false,
  hasDebts: false,
  financialGoals: [],
  investments: [],
};

const initialCurrentGoal = {
  name: "",
  targetAmount: 0,
  targetDate: new Date(),
  priority: "medium" as const,
};

const initialCurrentInvestment = {
  type: "stocks" as const,
  name: "",
  value: 0,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>(initialProfile);
  const [currentGoal, setCurrentGoal] = useState(initialCurrentGoal);
  const [currentInvestment, setCurrentInvestment] = useState(
    initialCurrentInvestment
  );

  const updateProfile = (updates: Partial<UserProfile>) => {
    logger.debug("Updating profile with:", updates);
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateCurrentGoal = (updates: Partial<typeof initialCurrentGoal>) => {
    setCurrentGoal((prev) => ({ ...prev, ...updates }));
  };

  const updateCurrentInvestment = (
    updates: Partial<typeof initialCurrentInvestment>
  ) => {
    setCurrentInvestment((prev) => ({ ...prev, ...updates }));
  };

  const addGoal = () => {
    if (currentGoal.name && currentGoal.targetAmount > 0) {
      const newGoal: FinancialGoal = {
        id: uuidv4(),
        ...currentGoal,
        currentAmount: 0,
      };

      logger.debug("Adding new goal:", newGoal);
      
      setProfile((prev) => ({
        ...prev,
        financialGoals: [...(prev.financialGoals || []), newGoal],
      }));

      setCurrentGoal(initialCurrentGoal);
    }
  };

  const removeGoal = (id: string) => {
    logger.debug("Removing goal with ID:", id);
    
    setProfile((prev) => ({
      ...prev,
      financialGoals:
        prev.financialGoals?.filter((goal) => goal.id !== id) || [],
    }));
  };

  const addInvestment = () => {
    if (currentInvestment.name && currentInvestment.value > 0) {
      const newInvestment: Investment = {
        id: uuidv4(),
        ...currentInvestment,
      };

      logger.debug("Adding new investment:", newInvestment);
      
      setProfile((prev) => ({
        ...prev,
        investments: [...(prev.investments || []), newInvestment],
      }));

      setCurrentInvestment(initialCurrentInvestment);
    }
  };

  const removeInvestment = (id: string) => {
    logger.debug("Removing investment with ID:", id);
    
    setProfile((prev) => ({
      ...prev,
      investments:
        prev.investments?.filter((investment) => investment.id !== id) || [],
    }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        profile,
        updateProfile,
        currentGoal,
        updateCurrentGoal,
        addGoal,
        removeGoal,
        currentInvestment,
        updateCurrentInvestment,
        addInvestment,
        removeInvestment,
      }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
