
import React from 'react';
import { Investment } from '@/types/finance';
import InvestmentCard from './InvestmentCard';
import ResponsiveGrid from '@/components/ui/responsive-grid';

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
    <ResponsiveGrid
      cols={{
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        '2xl': 3
      }}
      gap={{
        xs: 3,
        sm: 4,
        md: 4,
        lg: 6,
        xl: 6,
        '2xl': 8
      }}
    >
      {investments.map((investment) => (
        <InvestmentCard
          key={investment.id}
          investment={investment}
          onEdit={onEdit}
          onDelete={onDelete}
          deleteConfirmationId={deleteConfirmationId}
        />
      ))}
    </ResponsiveGrid>
  );
};

export default InvestmentGrid;
