
import React from 'react';
import { MonthlyAmount } from '@/types/finance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MonthlySavingsContent from '@/components/savings/MonthlySavingsContent';
import SavingsAnalysisTable from './SavingsAnalysisTable';
import { useTranslation } from 'react-i18next';

interface SavingsAnalysisTabsProps {
  loadingData: boolean;
  savingsData: MonthlyAmount[];
  averageSaved: number;
  selectedYear: number;
  error: string | null;
  refreshData?: () => void;
}

const SavingsAnalysisTabs: React.FC<SavingsAnalysisTabsProps> = ({
  loadingData,
  savingsData,
  averageSaved,
  selectedYear,
  error,
  refreshData
}) => {
  const { t } = useTranslation();
  
  return (
    <Tabs defaultValue="chart">
      <TabsList className="mb-4">
        <TabsTrigger value="chart">{t('savings.chartView', 'Chart View')}</TabsTrigger>
        <TabsTrigger value="table">{t('savings.tableView', 'Table View')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart" className="p-4 bg-white rounded-lg shadow">
        <MonthlySavingsContent
          loadingData={loadingData}
          savingsData={savingsData}
          editingMonth={null}
          onEditMonth={() => {}}
          onSaveAmount={() => {}}
          onCancelEdit={() => {}}
          onRefresh={refreshData}
          error={error}
        />
      </TabsContent>
      
      <TabsContent value="table">
        <SavingsAnalysisTable
          loadingData={loadingData}
          savingsData={savingsData}
          averageSaved={averageSaved}
          selectedYear={selectedYear}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SavingsAnalysisTabs;
