
import React from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useCurrency, Currency, CURRENCIES } from "@/context/CurrencyContext";

const CurrencySelector: React.FC = () => {
  const { t } = useTranslation();
  const { currency, currencyConfig, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 px-3 justify-between min-w-[120px]">
          <span className="text-sm font-medium">{currencyConfig.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {Object.values(CURRENCIES).map((config) => (
          <DropdownMenuItem
            key={config.code}
            onClick={() => setCurrency(config.code)}
            className="flex items-center gap-2"
          >
            <span>{config.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
