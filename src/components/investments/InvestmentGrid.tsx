import React from "react";
import { Investment } from "../../types/finance";
import InvestmentCard from "./InvestmentCard";

interface InvestmentGridProps {
  investments: Investment[];
  onEdit: (investment: Investment) => void;
  onDelete: (investment: Investment) => void;
}

const InvestmentGrid: React.FC<InvestmentGridProps> = ({
  investments,
  onEdit,
  onDelete,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr'>
      {investments.map((investment) => (
        <div key={investment.id} className='relative group/container'>
          <InvestmentCard
            investment={investment}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default InvestmentGrid;
