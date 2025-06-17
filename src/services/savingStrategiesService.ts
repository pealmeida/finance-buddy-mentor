
import { SavingStrategy, UserProfile } from "../types/finance";

export const generateSavingStrategies = (profile: UserProfile): SavingStrategy[] => {
  const strategies: SavingStrategy[] = [];
  
  // Ensure monthlyIncome is defined
  const monthlyIncome = profile.monthlyIncome || 0;
  
  if (monthlyIncome <= 0) {
    return strategies;
  }

  // Strategy 1: Emergency Fund
  if (!profile.hasEmergencyFund) {
    strategies.push({
      id: "emergency-fund",
      title: "Build Emergency Fund",
      description: "Save 3-6 months of expenses for unexpected situations",
      potentialSaving: monthlyIncome * 0.1,
      difficulty: "medium",
      timeFrame: "long-term",
      steps: [
        "Calculate your monthly expenses",
        "Set up automatic savings transfer",
        "Save 10% of income monthly",
        "Keep in high-yield savings account"
      ]
    });
  }

  // Strategy 2: Reduce Subscriptions
  strategies.push({
    id: "reduce-subscriptions",
    title: "Cancel Unused Subscriptions",
    description: "Review and cancel subscriptions you don't actively use",
    potentialSaving: monthlyIncome * 0.05,
    difficulty: "easy",
    timeFrame: "immediate",
    steps: [
      "List all current subscriptions",
      "Identify rarely used services",
      "Cancel or downgrade plans",
      "Set calendar reminders to review quarterly"
    ]
  });

  // Strategy 3: Meal Planning
  strategies.push({
    id: "meal-planning",
    title: "Plan Your Meals",
    description: "Reduce food waste and dining out costs with meal planning",
    potentialSaving: monthlyIncome * 0.08,
    difficulty: "medium",
    timeFrame: "short-term",
    steps: [
      "Plan weekly meals in advance",
      "Create shopping lists",
      "Buy groceries in bulk",
      "Prepare meals at home more often"
    ]
  });

  // Strategy 4: Energy Efficiency
  strategies.push({
    id: "energy-efficiency",
    title: "Improve Energy Efficiency",
    description: "Lower utility bills through energy-saving measures",
    potentialSaving: monthlyIncome * 0.03,
    difficulty: "easy",
    timeFrame: "immediate",
    steps: [
      "Switch to LED light bulbs",
      "Unplug electronics when not in use",
      "Adjust thermostat settings",
      "Use energy-efficient appliances"
    ]
  });

  // Strategy 5: High-yield savings (for higher income earners)
  if (monthlyIncome > 3000) {
    strategies.push({
      id: "high-yield-savings",
      title: "High-Yield Savings Account",
      description: "Move savings to accounts with better interest rates",
      potentialSaving: monthlyIncome * 0.02,
      difficulty: "easy",
      timeFrame: "immediate",
      steps: [
        "Research high-yield savings accounts",
        "Compare interest rates and fees",
        "Open new account",
        "Transfer existing savings"
      ]
    });
  }

  return strategies;
};
