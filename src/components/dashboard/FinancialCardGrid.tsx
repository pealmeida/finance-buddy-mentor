import React, { useState } from "react";
import { TrendingUp, Wallet, LineChart, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";
import { formatNumber } from "../../lib/utils";

interface FinancialCardGridProps {
  monthlyIncome: number;
  totalInvestments: number;
  hasInvestments: boolean;
  showIncomeCard?: boolean;
  showInvestmentsCard?: boolean;
  displaySettings?: {
    showCurrencySymbols?: boolean;
    compactView?: boolean;
  };
}

const FinancialCardGrid: React.FC<FinancialCardGridProps> = ({
  monthlyIncome,
  totalInvestments,
  hasInvestments,
  showIncomeCard = true,
  showInvestmentsCard = true,
  displaySettings,
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const [showMonthlyIncome, setShowMonthlyIncome] = useState(false);
  const [showTotalInvestments, setShowTotalInvestments] = useState(false);

  const visibleCards: React.ReactElement[] = [];

  if (showIncomeCard) {
    visibleCards.push(
      <Card
        key='income-card'
        className='finance-card'
        style={{ backgroundColor: "rgb(255, 255, 255)" }}>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='h-12 w-12 rounded-full bg-finance-blue-light flex items-center justify-center'>
              <Wallet className='h-6 w-6 text-finance-blue' />
            </div>
          </div>
          <h3 className='mt-4 font-medium text-gray-500'>
            {t("dashboard.monthlyIncome", "Monthly Income")}
          </h3>
          <div className='flex items-center justify-between'>
            <p className='text-2xl font-semibold'>
              {showMonthlyIncome
                ? displaySettings?.showCurrencySymbols !== false
                  ? formatCurrency(monthlyIncome)
                  : formatNumber(monthlyIncome, 2)
                : "********"}
            </p>
            <button
              onClick={() => setShowMonthlyIncome(!showMonthlyIncome)}
              className={`ml-2 p-1 rounded-full ${
                showMonthlyIncome ? "text-finance-green" : "text-gray-500"
              } hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              {showMonthlyIncome ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showInvestmentsCard) {
    visibleCards.push(
      <Card
        key='investments-card'
        className='finance-card'
        style={{ backgroundColor: "rgb(255, 255, 255)" }}>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='h-12 w-12 rounded-full bg-finance-green-light flex items-center justify-center'>
              <LineChart className='h-6 w-6 text-finance-green' />
            </div>
          </div>
          <h3 className='mt-4 font-medium text-gray-500'>
            {t("dashboard.investments", "Investments")}
          </h3>
          {hasInvestments ? (
            <div className='flex items-center justify-between'>
              <p className='text-2xl font-semibold'>
                {showTotalInvestments
                  ? displaySettings?.showCurrencySymbols !== false
                    ? formatCurrency(totalInvestments)
                    : formatNumber(totalInvestments, 2)
                  : "********"}
              </p>
              <button
                onClick={() => setShowTotalInvestments(!showTotalInvestments)}
                className={`ml-2 p-1 rounded-full ${
                  showTotalInvestments ? "text-finance-green" : "text-gray-500"
                } hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                {showTotalInvestments ? (
                  <Eye size={20} />
                ) : (
                  <EyeOff size={20} />
                )}
              </button>
            </div>
          ) : (
            <p className='text-lg font-semibold text-gray-400'>
              {t("common.noInvestmentData")}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-1 ${
        visibleCards.length > 1 ? "sm:grid-cols-2" : ""
      } gap-4`}>
      {visibleCards}
    </div>
  );
};

export default FinancialCardGrid;
