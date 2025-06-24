import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { updateProfilePreferences } from "../utils/auth/profilePreferences";
import { Language } from "../types/finance";

export const LANGUAGES: Record<
  Language,
  { code: Language; name: string; flag: string }
> = {
  en: { code: "en", name: "English", flag: "🇺🇸" },
  "pt-BR": { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
};

interface LanguageContextType {
  language: Language;
  languageConfig: (typeof LANGUAGES)[Language];
  setLanguage: (language: Language) => void;
  setLanguageWithSync: (language: Language, userId?: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  const languageConfig = LANGUAGES[language];

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const setLanguageWithSync = async (
    newLanguage: Language,
    userId?: string
  ) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
    i18n.changeLanguage(newLanguage);

    // Sync with database if user ID is provided
    if (userId) {
      try {
        await updateProfilePreferences(userId, {
          preferredLanguage: newLanguage,
        });
      } catch (error) {
        console.error("Error syncing language preference to database:", error);
      }
    }
  };

  // Initialize language on mount
  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  const value = {
    language,
    languageConfig,
    setLanguage,
    setLanguageWithSync,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
