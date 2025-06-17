import React, { useState } from "react";
import { UserProfile } from "../types/finance";
import StrategiesHeader from "./savings/strategies/StrategiesHeader";
import StrategyCard from "./savings/strategies/StrategyCard";
import { getIconForStrategy } from "./savings/strategies/StrategyIconUtils";
import { generateSavingStrategies } from "../services/savingStrategiesService";

interface SavingStrategiesProps {
  userProfile: UserProfile;
}

const SavingStrategies: React.FC<SavingStrategiesProps> = ({ userProfile }) => {
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);

  // Get strategies using our service
  const strategies = generateSavingStrategies(userProfile);

  // Toggle expanded state for a strategy
  const toggleStrategy = (id: string) => {
    if (expandedStrategy === id) {
      setExpandedStrategy(null);
    } else {
      setExpandedStrategy(id);
    }
  };

  return (
    <div className='w-full animate-fade-in'>
      <StrategiesHeader title='Money-Saving Strategies' />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            isExpanded={expandedStrategy === strategy.id}
            onToggle={toggleStrategy}
            iconComponent={getIconForStrategy(strategy.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SavingStrategies;
