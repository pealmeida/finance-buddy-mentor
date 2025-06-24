import React, { createContext, useContext, useState, useCallback } from "react";
import {
  UserProfile,
  Investment,
  FinancialGoal,
  RiskProfile,
} from "../types/finance";
import { v4 as uuidv4 } from "uuid";

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
  addInvestment: (investment: Omit<Investment, "id">) => void;
  removeInvestment: (id: string) => void;
}

const initialProfile: Partial<UserProfile> = {
  email: "",
  name: "",
  age: 0,
  monthlyIncome: 0,
  riskProfile: undefined,
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

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>(initialProfile);
  const [currentGoal, setCurrentGoal] = useState(initialCurrentGoal);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const newProfile = { ...prev, ...updates };
      return newProfile;
    });
  }, []);

  const updateCurrentGoal = useCallback(
    (updates: Partial<typeof initialCurrentGoal>) => {
      setCurrentGoal((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const addGoal = useCallback(() => {
    if (currentGoal.name && currentGoal.targetAmount > 0) {
      const newGoal = {
        id: uuidv4(),
        ...currentGoal,
        currentAmount: 0,
      };

      setProfile((prev) => ({
        ...prev,
        financialGoals: [...(prev.financialGoals || []), newGoal],
      }));

      setCurrentGoal(initialCurrentGoal);
    }
  }, [currentGoal]);

  const removeGoal = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      financialGoals:
        prev.financialGoals?.filter((goal) => goal.id !== id) || [],
    }));
  };

  const addInvestment = useCallback((investment: Omit<Investment, "id">) => {
    if (investment.name && investment.value > 0 && investment.type) {
      const newInvestment: Investment = {
        id: uuidv4(),
        ...investment,
        type: investment.type,
        name: investment.name,
        value: investment.value,
      };

      setProfile((prev) => ({
        ...prev,
        investments: [...(prev.investments || []), newInvestment],
      }));
    }
  }, []);

  const removeInvestment = (id: string) => {
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
