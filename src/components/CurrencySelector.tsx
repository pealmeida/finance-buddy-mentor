import React from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { useCurrency, Currency, CURRENCIES } from "../context/CurrencyContext";

const CurrencySelector: React.FC = () => {
  const { t } = useTranslation();
  const { currency, currencyConfig, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='w-full h-12 flex items-center gap-3 px-4 justify-between bg-gray-50/50 border-gray-200 hover:border-finance-blue hover:bg-white transition-all duration-300 rounded-lg group'>
          <span className='text-sm font-medium text-gray-700 group-hover:text-finance-blue'>
            {currencyConfig.name}
          </span>
          <ChevronDown className='h-5 w-5 text-gray-400 group-hover:text-finance-blue transition-colors' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        className='min-w-[200px] bg-white border border-gray-200 shadow-lg rounded-lg'>
        {Object.values(CURRENCIES).map((config) => (
          <DropdownMenuItem
            key={config.code}
            onClick={() => handleCurrencyChange(config.code)}
            className='flex items-center gap-3 cursor-pointer px-4 py-3 hover:bg-finance-blue/10 transition-colors'>
            <span className='font-medium'>{t(config.name)}</span>
            <span className='text-sm text-gray-500'>({config.code})</span>
            {currency === config.code && (
              <span className='ml-auto text-finance-blue font-semibold'>✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
