
import React from 'react';
import { Investment } from '@/types/finance';
import InvestmentCard from './InvestmentCard';

interface InvestmentGridProps {
  investments: Investment[];
  onEdit: (investment: Investment) => void;
  onDelete: (id: string) => void;
  deleteConfirmationId: string | null;
}

const InvestmentGrid: React.FC<InvestmentGridProps> = ({
  investments,
  onEdit,
  onDelete,
  deleteConfirmationId
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {investments.map((investment) => (
        <InvestmentCard
          key={investment.id}
          investment={investment}
          onEdit={onEdit}
          onDelete={onDelete}
          deleteConfirmationId={deleteConfirmationId}
        />
      ))}
    </div>
  );
};

export default InvestmentGrid;
