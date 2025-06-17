import React from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import { useLanguage, LANGUAGES } from "../context/LanguageContext";
import { Language } from "../types/finance";

interface LanguageSelectorProps {
  userId?: string; // Optional userId for syncing preferences
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { language, languageConfig, setLanguage, setLanguageWithSync } =
    useLanguage();

  const handleLanguageChange = async (newLanguage: Language) => {
    if (userId) {
      await setLanguageWithSync(newLanguage, userId);
    } else {
      setLanguage(newLanguage);
    }
  };

  const getCurrentLanguageLabel = () => {
    switch (language) {
      case "pt-BR":
        return "PT";
      case "en":
      default:
        return "EN";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex items-center gap-2 px-3'>
          <Globe className='h-4 w-4' />
          <span className='text-sm font-medium'>
            {getCurrentLanguageLabel()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {Object.values(LANGUAGES).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className='flex items-center gap-2'>
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
