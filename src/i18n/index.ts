
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English translations
import enCommon from "./locales/en/common.json";
import enHeader from "./locales/en/header.json";
import enNavigation from "./locales/en/navigation.json";
import enDashboard from "./locales/en/dashboard.json";
import enExpenses from "./locales/en/expenses.json";
import enSavings from "./locales/en/savings.json";
import enInvestments from "./locales/en/investments.json";
import enProfile from "./locales/en/profile.json";
import enOnboarding from "./locales/en/onboarding.json";
import enGoals from "./locales/en/goals.json";
import enErrors from "./locales/en/errors.json";
import enAuth from "./locales/en/auth.json";

// Portuguese translations
import ptBrCommon from "./locales/pt-br/common.json";
import ptBrHeader from "./locales/pt-br/header.json";
import ptBrNavigation from "./locales/pt-br/navigation.json";
import ptBrDashboard from "./locales/pt-br/dashboard.json";
import ptBrExpenses from "./locales/pt-br/expenses.json";
import ptBrSavings from "./locales/pt-br/savings.json";
import ptBrInvestments from "./locales/pt-br/investments.json";
import ptBrProfile from "./locales/pt-br/profile.json";
import ptBrOnboarding from "./locales/pt-br/onboarding.json";
import ptBrGoals from "./locales/pt-br/goals.json";
import ptBrErrors from "./locales/pt-br/errors.json";
import ptBrAuth from "./locales/pt-br/auth.json";

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          common: enCommon,
          header: enHeader,
          navigation: enNavigation,
          dashboard: enDashboard,
          expenses: enExpenses,
          savings: enSavings,
          investments: enInvestments,
          profile: enProfile,
          onboarding: enOnboarding,
          goals: enGoals,
          errors: enErrors,
          auth: enAuth
        },
      },
      "pt-BR": {
        translation: {
          common: ptBrCommon,
          header: ptBrHeader,
          navigation: ptBrNavigation,
          dashboard: ptBrDashboard,
          expenses: ptBrExpenses,
          savings: ptBrSavings,
          investments: ptBrInvestments,
          profile: ptBrProfile,
          onboarding: ptBrOnboarding,
          goals: ptBrGoals,
          errors: ptBrErrors,
          auth: ptBrAuth
        },
      },
    },
    lng: localStorage.getItem("language") || "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
