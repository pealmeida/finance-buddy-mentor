import React, { useState } from "react";
import { MonthlyAmount } from "../../types/finance";
import MonthlySavingsModalDialog from "./MonthlySavingsModalDialog";
import SavingsLoadingState from "./content/SavingsLoadingState";
import SavingsErrorState from "./content/SavingsErrorState";
import SavingsEmptyState from "./content/SavingsEmptyState";
import SavingsChartSection from "./content/SavingsChartSection";
import SavingsCardGrid from "./content/SavingsCardGrid";

interface MonthlySavingsContentProps {
  loadingData: boolean;
  savingsData: MonthlyAmount[];
  editingMonth: number | null;
  onEditMonth: (month: number) => void;
  onSaveAmount: (month: number, amount: number) => void;
  onCancelEdit: () => void;
  error?: string | null;
  monthlyIncome?: number;
  monthlyExpenses?: MonthlyAmount[];
}

const MonthlySavingsContent: React.FC<MonthlySavingsContentProps> = ({
  loadingData,
  savingsData,
  editingMonth,
  onEditMonth,
  onSaveAmount,
  onCancelEdit,
  error,
  monthlyIncome,
  monthlyExpenses,
}) => {
  const [selectedMonthData, setSelectedMonthData] =
    useState<MonthlyAmount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Log data for debugging
  if (loadingData) {
    return <SavingsLoadingState />;
  }

  if (error) {
    return <SavingsErrorState error={error} />;
  }

  // Validate that savingsData exists and has items
  if (!Array.isArray(savingsData) || savingsData.length === 0) {
    return <SavingsEmptyState />;
  }

  const handleOpenModal = (month: number) => {
    const monthData = savingsData.find((item) => item.month === month) || {
      month,
      amount: 0,
      year: new Date().getFullYear(),
    };
    setSelectedMonthData(monthData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMonthData(null);
    onCancelEdit();
  };

  const handleUpdateMonthData = (updatedData: MonthlyAmount) => {
    // Update the savings data locally
    setSelectedMonthData(updatedData);
  };

  const handleSaveAmount = (month: number, amount: number) => {
    onSaveAmount(month, amount);
    handleCloseModal();
  };

  return (
    <>
      <SavingsChartSection data={savingsData} onSelectMonth={handleOpenModal} />

      <SavingsCardGrid data={savingsData} onEditMonth={handleOpenModal} />

      <MonthlySavingsModalDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedMonthData={selectedMonthData}
        onUpdateMonthData={handleUpdateMonthData}
        onSaveAmount={handleSaveAmount}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
      />
    </>
  );
};

export default MonthlySavingsContent;
