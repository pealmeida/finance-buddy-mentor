import React from "react";
import {
  Edit,
  Trash2,
  LineChart,
  Landmark,
  Home,
  Coins,
  Bitcoin,
  DollarSign,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Investment } from "../../types/finance";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";

interface InvestmentCardProps {
  investment: Investment;
  onEdit: (investment: Investment) => void;
  onDelete: (investment: Investment) => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();

  // Check if this is an emergency fund investment
  const isEmergencyFund =
    investment.isEmergencyFund ||
    investment.name.toLowerCase().includes("emergency") ||
    investment.name.toLowerCase().includes("emergência") ||
    investment.name.toLowerCase().includes("fundo de emergência");
  // Map investment types to icons
  const getInvestmentIcon = () => {
    switch (investment.type) {
      case "stocks":
        return <LineChart className='h-5 w-5 text-blue-500' />;
      case "bonds":
        return <Landmark className='h-5 w-5 text-green-600' />;
      case "fixedIncome":
        return <TrendingUp className='h-5 w-5 text-emerald-600' />;
      case "realEstate":
        return <Home className='h-5 w-5 text-orange-500' />;
      case "cash":
        return <DollarSign className='h-5 w-5 text-green-500' />;
      case "crypto":
        return <Bitcoin className='h-5 w-5 text-yellow-500' />;
      case "other":
      default:
        return <Coins className='h-5 w-5 text-purple-500' />;
    }
  };

  // Format type for display using i18n
  const formatType = (type: string) => {
    return t(
      `investments.types.${type}`,
      type.charAt(0).toUpperCase() + type.slice(1)
    );
  };

  // Remove delete confirmation state since we're using a modal now

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 border-0 ${
        isEmergencyFund
          ? "ring-2 ring-green-300 bg-gradient-to-br from-green-50/40 to-green-100/20 hover:ring-green-400"
          : "shadow-sm border border-gray-100 hover:border-gray-200 bg-white"
      }`}>
      <CardContent className='p-0'>
        {isEmergencyFund && (
          <div className='h-1.5 bg-gradient-to-r from-green-500 via-green-600 to-green-700'></div>
        )}
        <div className='p-4 flex items-center justify-between border-b'>
          <div className='flex items-center gap-2 flex-1'>
            <div
              className={`p-1.5 rounded-lg ${
                isEmergencyFund
                  ? "bg-green-100"
                  : "bg-gray-50 group-hover:bg-gray-100"
              } transition-all duration-200`}>
              {getInvestmentIcon()}
            </div>
            <div className='flex flex-col gap-1 flex-1 min-w-0'>
              <h3 className='font-semibold text-sm leading-tight truncate'>
                {investment.name}
              </h3>
            </div>
          </div>
          <Badge
            variant='outline'
            className={`text-xs shrink-0 ${
              isEmergencyFund
                ? "border-green-200 text-green-700 bg-green-50"
                : "border-gray-200 text-gray-600"
            }`}>
            {formatType(investment.type)}
          </Badge>
        </div>

        <div className='p-4 space-y-2'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600 font-medium'>
              {t("investments.currentValue", "Current Value")}
            </span>
            <span className='font-bold text-gray-900'>
              {formatCurrency(investment.value)}
            </span>
          </div>

          {investment.annualReturn !== undefined && (
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600 font-medium'>
                {t("investments.annualReturn", "Annual Return")}
              </span>
              <span className='font-bold text-green-600'>
                {investment.annualReturn}%
              </span>
            </div>
          )}
        </div>

        <div className='px-5 py-4 flex justify-between items-center border-t bg-gray-50/60'>
          {/* Emergency Fund Badge positioned on bottom left */}
          <div className='flex items-center flex-1 min-w-0'>
            {isEmergencyFund ? (
              <Badge className='bg-green-500 hover:bg-green-600 text-white border-0 text-sm font-semibold px-3 py-2 rounded-md shadow-sm transition-all duration-200'>
                <Shield className='h-4 w-4 mr-2' />
                {t("investments.emergency", "Emergency")}
              </Badge>
            ) : (
              <div className='h-8'></div>
            )}
          </div>

          {/* Action buttons on bottom right */}
          <div className='flex items-center gap-2 ml-4'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onEdit(investment)}
                    className='text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium p-2 h-9 w-9 rounded-md transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm'>
                    <Edit className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("investments.edit", "Edit")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onDelete(investment)}
                    className='font-medium p-2 h-9 w-9 rounded-md transition-all duration-200 border text-red-600 hover:bg-red-50 hover:text-red-700 border-transparent hover:border-red-200 hover:shadow-sm'>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("investments.delete", "Delete")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCard;
