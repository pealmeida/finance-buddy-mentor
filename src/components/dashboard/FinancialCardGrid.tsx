import React from "react";
import { TrendingUp, Wallet, LineChart } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";

interface FinancialCardGridProps {
  monthlyIncome: number;
  totalInvestments: number;
  hasInvestments: boolean;
}

const FinancialCardGrid: React.FC<FinancialCardGridProps> = ({
  monthlyIncome,
  totalInvestments,
  hasInvestments,
}) => {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <Card className='finance-card'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='h-12 w-12 rounded-full bg-finance-blue-light flex items-center justify-center'>
              <Wallet className='h-6 w-6 text-finance-blue' />
            </div>
            <TrendingUp className='h-5 w-5 text-finance-green' />
          </div>
          <h3 className='mt-4 font-medium text-gray-500'>
            {t("dashboard.monthlyIncome", "Monthly Income")}
          </h3>
          <p className='text-2xl font-semibold'>
            {formatCurrency(monthlyIncome)}
          </p>
        </CardContent>
      </Card>

      <Card className='finance-card'>
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='h-12 w-12 rounded-full bg-finance-green-light flex items-center justify-center'>
              <LineChart className='h-6 w-6 text-finance-green' />
            </div>
            <TrendingUp className='h-5 w-5 text-finance-green' />
          </div>
          <h3 className='mt-4 font-medium text-gray-500'>
            {t("dashboard.investments", "Investments")}
          </h3>
          {hasInvestments ? (
            <p className='text-2xl font-semibold'>
              {formatCurrency(totalInvestments)}
            </p>
          ) : (
            <p className='text-lg font-semibold text-gray-400'>
              {t("common.noInvestmentData")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCardGrid;
