import React from "react";
import { MonthlyAmount } from "@/types/finance";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/lib/utils";

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
  selectedYear,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("savings.monthlySavingsData", "Monthly Savings Data")}
        </CardTitle>
        <CardDescription>
          {t(
            "savings.detailedBreakdown",
            "Detailed breakdown of your savings in"
          )}{" "}
          {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loadingData ? (
          <div className='flex justify-center items-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
          </div>
        ) : (
          <div className='space-y-6'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-1/3'>{t("common.month")}</TableHead>
                  <TableHead className='w-1/3 text-right'>
                    {t("savings.amountSaved", "Amount Saved")}
                  </TableHead>
                  <TableHead className='w-1/3 text-right'>
                    {t("savings.comparisonToAverage", "vs Average")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savingsData.map((item) => (
                  <TableRow key={item.month}>
                    <TableCell className='font-medium'>
                      {new Date(0, item.month - 1).toLocaleString("default", {
                        month: "long",
                      })}
                    </TableCell>
                    <TableCell className='text-right font-mono'>
                      ${formatNumber(item.amount, 2)}
                    </TableCell>
                    <TableCell className='text-right'>
                      {item.amount > averageSaved ? (
                        <span className='text-green-600 font-medium'>
                          +${(item.amount - averageSaved).toFixed(0)}
                        </span>
                      ) : item.amount < averageSaved ? (
                        <span className='text-red-600 font-medium'>
                          -${(averageSaved - item.amount).toFixed(0)}
                        </span>
                      ) : (
                        <span className='text-gray-600'>=</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Year Summary */}
            <div className='mt-6 pt-6 border-t-2'>
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                  <div>
                    <div className='text-sm text-gray-600'>Total Saved</div>
                    <div className='text-lg font-semibold'>
                      $
                      {formatNumber(
                        savingsData.reduce((sum, item) => sum + item.amount, 0),
                        2
                      )}
                    </div>
                  </div>
                  <div>
                    <div className='text-sm text-gray-600'>Monthly Average</div>
                    <div className='text-lg font-semibold'>
                      ${averageSaved.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className='text-sm text-gray-600'>Best Month</div>
                    <div className='text-lg font-semibold text-green-600'>
                      $
                      {Math.max(
                        ...savingsData.map((item) => item.amount)
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className='text-sm text-gray-600'>Lowest Month</div>
                    <div className='text-lg font-semibold text-red-600'>
                      $
                      {formatNumber(
                        Math.min(...savingsData.map((item) => item.amount)),
                        2
                      )}
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
