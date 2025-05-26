
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

interface SavingsAnalysisTableProps {
  loadingData: boolean;
  savingsData: MonthlyAmount[];
  averageSaved: number;
  selectedYear: number;
}

const SavingsAnalysisTable: React.FC<SavingsAnalysisTableProps> = ({
  loadingData,
  savingsData,
  averageSaved,
  selectedYear
}) => {
  const { t } = useTranslation();
  
  // Group data by quarters for better visualization
  const quarters = [
    { name: 'Q1', months: [1, 2, 3] },
    { name: 'Q2', months: [4, 5, 6] },
    { name: 'Q3', months: [7, 8, 9] },
    { name: 'Q4', months: [10, 11, 12] }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('savings.monthlySavingsData', 'Monthly Savings Data')}</CardTitle>
        <CardDescription>
          {t('savings.detailedBreakdown', 'Detailed breakdown of your savings in')} {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loadingData ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {quarters.map((quarter, quarterIndex) => {
              const quarterData = savingsData.filter(item => quarter.months.includes(item.month));
              const quarterTotal = quarterData.reduce((sum, item) => sum + item.amount, 0);
              const quarterAverage = quarterTotal / quarterData.length;

              return (
                <div key={quarter.name} className="space-y-3">
                  {/* Quarter Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold text-gray-800">{quarter.name}</h3>
                    <div className="text-sm text-gray-600">
                      Total: ${quarterTotal.toLocaleString()} | Avg: ${quarterAverage.toFixed(0)}
                    </div>
                  </div>
                  
                  {/* Quarter Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">{t('common.month')}</TableHead>
                        <TableHead className="w-1/3 text-right">{t('savings.amountSaved', 'Amount Saved')}</TableHead>
                        <TableHead className="w-1/3 text-right">{t('savings.comparisonToAverage', 'vs Average')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quarterData.map(item => (
                        <TableRow key={item.month}>
                          <TableCell className="font-medium">
                            {new Date(0, item.month - 1).toLocaleString('default', { month: 'long' })}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            ${item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.amount > averageSaved ? (
                              <span className="text-green-600 font-medium">
                                +${(item.amount - averageSaved).toFixed(0)}
                              </span>
                            ) : item.amount < averageSaved ? (
                              <span className="text-red-600 font-medium">
                                -${(averageSaved - item.amount).toFixed(0)}
                              </span>
                            ) : (
                              <span className="text-gray-600">=</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Separator between quarters (except last) */}
                  {quarterIndex < quarters.length - 1 && <Separator />}
                </div>
              );
            })}
            
            {/* Year Summary */}
            <div className="mt-6 pt-6 border-t-2">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Total Saved</div>
                    <div className="text-lg font-semibold">
                      ${savingsData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Monthly Average</div>
                    <div className="text-lg font-semibold">${averageSaved.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Best Month</div>
                    <div className="text-lg font-semibold text-green-600">
                      ${Math.max(...savingsData.map(item => item.amount)).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Lowest Month</div>
                    <div className="text-lg font-semibold text-red-600">
                      ${Math.min(...savingsData.map(item => item.amount)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsAnalysisTable;
