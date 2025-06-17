import React, { createContext, useContext, useState, useEffect } from "react";
import { updateProfilePreferences } from "../utils/auth/profilePreferences";

export type Currency = "USD" | "EUR" | "BRL";

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real" },
};

interface CurrencyContextType {
  currency: Currency;
  currencyConfig: CurrencyConfig;
  setCurrency: (currency: Currency) => void;
  setCurrencyWithSync: (currency: Currency, userId?: string) => Promise<void>;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
}) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("currency");
    return (saved as Currency) || "BRL";
  });

  const currencyConfig = CURRENCIES[currency];

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const setCurrencyWithSync = async (
    newCurrency: Currency,
    userId?: string
  ) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("currency", newCurrency);

    // Sync with database if user ID is provided
    if (userId) {
      try {
        await updateProfilePreferences(userId, {
          preferredCurrency: newCurrency,
        });
      } catch (error) {
        console.error("Error syncing currency preference to database:", error);
      }
    }
  };

  const formatCurrency = (amount: number): string => {
    return `${currencyConfig.symbol}${amount.toLocaleString()}`;
  };

  const value = {
    currency,
    currencyConfig,
    setCurrency,
    setCurrencyWithSync,
    formatCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
