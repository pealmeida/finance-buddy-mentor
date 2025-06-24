import React, { createContext, useContext, useState, useEffect } from "react";
import { updateProfilePreferences } from "../utils/auth/profilePreferences";

export type Currency = "USD" | "EUR" | "BRL";

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", locale: "pt-BR" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", locale: "pt-BR" },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
};

interface CurrencyContextType {
  currency: Currency;
  currencyConfig: CurrencyConfig;
  setCurrency: (currency: Currency) => void;
  setCurrencyWithSync: (currency: Currency, userId?: string) => Promise<void>;
  formatCurrency: (amount: number) => string;
  formatCurrencyWithoutSymbol: (amount: number) => string;
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
  initialCurrency?: Currency;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
  initialCurrency,
}) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (initialCurrency) {
      return initialCurrency;
    }
    const saved = localStorage.getItem("currency");
    return (saved as Currency) || "BRL";
  });

  // Update currency state only when initialCurrency prop changes (not when currency changes)
  useEffect(() => {
    if (initialCurrency) {
      setCurrencyState(initialCurrency);
      localStorage.setItem("currency", initialCurrency);
    }
  }, [initialCurrency]);

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

  const formatCurrencyWithoutSymbol = (amount: number): string => {
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatCurrency = (amount: number): string => {
    const formattedAmount = formatCurrencyWithoutSymbol(amount);
    return `${currencyConfig.symbol} ${formattedAmount}`;
  };

  const value = {
    currency,
    currencyConfig,
    setCurrency,
    setCurrencyWithSync,
    formatCurrency,
    formatCurrencyWithoutSymbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
