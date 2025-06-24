import React from "react";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";
import { useMarketData } from "../../hooks/useMarketData";
import { Loader2, TrendingUp } from "lucide-react";
import { formatNumber } from "../../lib/utils";

interface MarketTrendsProps {}

const MarketTrends: React.FC<MarketTrendsProps> = () => {
  const { t } = useTranslation();
  const { marketData, isLoading, error } = useMarketData();

  // Function to get the appropriate icon background and text color based on type
  const getTypeStyle = (type: string, symbol: string) => {
    switch (type) {
      case "index":
        return { bg: "bg-blue-100", text: "text-blue-600", icon: "S&P" };
      case "cryptocurrency":
        return { bg: "bg-orange-100", text: "text-orange-600", icon: "BTC" };
      case "commodity":
        return { bg: "bg-amber-100", text: "text-amber-600", icon: "GLD" };
      case "stock":
        return { bg: "bg-green-100", text: "text-green-600", icon: symbol };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", icon: symbol };
    }
  };

  // Function to format price based on symbol
  const formatPrice = (symbol: string, price: number) => {
    if (symbol === "BTC-USD") {
      return `$${formatNumber(price, 0)}`;
    }
    return `$${formatNumber(price, 0)}`;
  };

  // Function to get description based on type
  const getDescription = (type: string) => {
    switch (type) {
      case "index":
        return t("dashboard.marketData.usIndex", "US Index");
      case "cryptocurrency":
        return t("dashboard.marketData.cryptocurrency", "Cryptocurrency");
      case "commodity":
        return t("dashboard.marketData.commodity", "Commodity");
      case "stock":
        return t("dashboard.marketData.stock", "Stock");
      default:
        return t("dashboard.marketData.financial", "Financial");
    }
  };

  if (isLoading) {
    return (
      <div className='glass-panel rounded-2xl p-6'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold'>
            {t("dashboard.marketTrends")}
          </h2>
        </div>
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <span className='ml-2 text-gray-500'>
            {t("common.loading", "Loading...")}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='glass-panel rounded-2xl p-6'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold'>
            {t("dashboard.marketTrends")}
          </h2>
        </div>
        <div className='text-center py-8 text-red-500'>
          {t("errors.failedToLoadMarketData", "Failed to load market data")}
        </div>
      </div>
    );
  }

  return (
    <div className='glass-panel rounded-2xl p-6'>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-green-50 border border-green-100'>
              <TrendingUp className='h-5 w-5 text-green-500' />
            </div>
            {t("dashboard.marketTrends")}
          </div>
        </h2>
      </div>

      <div className='space-y-4'>
        {marketData.map((item, index) => {
          const typeStyle = getTypeStyle(item.type, item.symbol);
          const isPositive = item.changePercent >= 0;

          return (
            <div key={item.id}>
              <div className='flex items-center justify-between pb-2'>
                <div className='flex items-center gap-2'>
                  <div
                    className={`h-8 w-8 rounded-full ${typeStyle.bg} flex items-center justify-center`}>
                    <span className={`text-xs font-medium ${typeStyle.text}`}>
                      {typeStyle.icon}
                    </span>
                  </div>
                  <div>
                    <p className='font-medium'>{item.name}</p>
                    <p className='text-xs text-gray-500'>
                      {getDescription(item.type)}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-medium'>
                    {formatPrice(item.symbol, item.price)}
                  </p>
                  <p
                    className={`text-xs ${
                      isPositive ? "text-finance-green" : "text-red-500"
                    }`}>
                    {isPositive ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
              {index < marketData.length - 1 && <Separator />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketTrends;
