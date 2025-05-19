
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

const MarketTrends: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t('dashboard.marketTrends')}</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">S&P</span>
            </div>
            <div>
              <p className="font-medium">S&P 500</p>
              <p className="text-xs text-gray-500">US Index</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">4,385.42</p>
            <p className="text-xs text-finance-green">+1.2%</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">BTC</span>
            </div>
            <div>
              <p className="font-medium">Bitcoin</p>
              <p className="text-xs text-gray-500">Cryptocurrency</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">$60,142.17</p>
            <p className="text-xs text-finance-green">+2.4%</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-xs font-medium text-amber-600">GLD</span>
            </div>
            <div>
              <p className="font-medium">Gold</p>
              <p className="text-xs text-gray-500">Commodity</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">$2,345.80</p>
            <p className="text-xs text-finance-green">+0.8%</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xs font-medium text-green-600">10Y</span>
            </div>
            <div>
              <p className="font-medium">10-Year Treasury</p>
              <p className="text-xs text-gray-500">Bond Yield</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">3.42%</p>
            <p className="text-xs text-red-500">-0.05%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
