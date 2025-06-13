import React, { createContext, useContext, useState } from "react";
import { UserProfile } from "../types/finance";
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
    console.log(
      "OnboardingContext: updateProfile called with updates:",
      updates
    );
    setProfile((prev) => {
      const newProfile = { ...prev, ...updates };
      console.log(
        "OnboardingContext: new profile state after update:",
        newProfile
      );
      return newProfile;
    });
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
  };

  const removeGoal = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      financialGoals:
        prev.financialGoals?.filter((goal) => goal.id !== id) || [],
    }));
  };

  const addInvestment = () => {
    if (currentInvestment.name && currentInvestment.value > 0) {
      const newInvestment = {
        id: uuidv4(),
        ...currentInvestment,
      };

      setProfile((prev) => ({
        ...prev,
        investments: [...(prev.investments || []), newInvestment],
      }));

      setCurrentInvestment(initialCurrentInvestment);
    }
  };

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
