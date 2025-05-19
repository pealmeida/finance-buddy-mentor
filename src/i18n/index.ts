
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en.json";
import ptBrTranslation from "./locales/pt-br.json";

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      "pt-BR": {
        translation: ptBrTranslation,
      },
    },
    lng: localStorage.getItem("language") || "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
