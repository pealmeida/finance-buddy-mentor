import React from "react";
import { MonthlyAmount } from "../../../types/finance";
import MonthlySavingsChart from "../MonthlySavingsChart";

interface SavingsChartSectionProps {
  data: MonthlyAmount[];
  onSelectMonth: (month: number) => void;
}

const SavingsChartSection: React.FC<SavingsChartSectionProps> = ({
  data,
  onSelectMonth,
}) => {
  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <MonthlySavingsChart data={data} onSelectMonth={onSelectMonth} />
    </div>
  );
};

export default SavingsChartSection;
