
import React from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DollarSign, Euro, IndianRupee } from "lucide-react";
import { useCurrency, Currency, CURRENCIES } from "@/context/CurrencyContext";

const CurrencySelector: React.FC = () => {
  const { t } = useTranslation();
  const { currency, currencyConfig, setCurrency } = useCurrency();

  const getCurrencyIcon = (currencyCode: Currency) => {
    switch (currencyCode) {
      case "EUR":
        return <Euro className="h-4 w-4" />;
      case "BRL":
        return <IndianRupee className="h-4 w-4" />;
      case "USD":
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3">
          {getCurrencyIcon(currency)}
          <span className="text-sm font-medium">{currencyConfig.symbol}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(CURRENCIES).map((config) => (
          <DropdownMenuItem
            key={config.code}
            onClick={() => setCurrency(config.code)}
            className="flex items-center gap-2"
          >
            {getCurrencyIcon(config.code)}
            <span>{config.symbol} - {config.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
