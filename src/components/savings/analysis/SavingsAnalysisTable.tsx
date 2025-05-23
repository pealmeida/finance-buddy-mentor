
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
          <Table>
            <TableCaption>{t('savings.monthlySavingsFor', 'Monthly savings for')} {selectedYear}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.month')}</TableHead>
                <TableHead>{t('savings.amountSaved', 'Amount Saved')}</TableHead>
                <TableHead>{t('savings.comparisonToAverage', 'Comparison to Average')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savingsData.map(item => (
                <TableRow key={item.month}>
                  <TableCell className="font-medium">
                    {new Date(0, item.month - 1).toLocaleString('default', { month: 'long' })}
                  </TableCell>
                  <TableCell>${item.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {item.amount > averageSaved ? (
                      <span className="text-green-600">
                        ${(item.amount - averageSaved).toFixed(2)} {t('savings.aboveAverage', 'above average')}
                      </span>
                    ) : item.amount < averageSaved ? (
                      <span className="text-red-600">
                        ${(averageSaved - item.amount).toFixed(2)} {t('savings.belowAverage', 'below average')}
                      </span>
                    ) : (
                      <span className="text-gray-600">{t('savings.average', 'Average')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsAnalysisTable;
