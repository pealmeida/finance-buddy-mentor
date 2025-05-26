
import React from 'react';
import { Investment } from '@/types/finance';
import InvestmentCard from './InvestmentCard';
import { Separator } from '@/components/ui/separator';

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
  // Group investments by type for better organization
  const groupedInvestments = investments.reduce((groups, investment) => {
    const type = investment.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(investment);
    return groups;
  }, {} as Record<string, Investment[]>);

  const formatTypeTitle = (type: string) => {
    if (type === 'realEstate') return 'Real Estate';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const typeOrder = ['stocks', 'bonds', 'realEstate', 'cash', 'crypto', 'other'];
  const sortedTypes = Object.keys(groupedInvestments).sort((a, b) => {
    const aIndex = typeOrder.indexOf(a);
    const bIndex = typeOrder.indexOf(b);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <div className="space-y-8">
      {sortedTypes.map((type, typeIndex) => (
        <div key={type} className="space-y-4">
          {/* Investment Type Header */}
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {formatTypeTitle(type)} ({groupedInvestments[type].length})
            </h3>
            <Separator className="flex-1" />
          </div>
          
          {/* Investment Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedInvestments[type].map((investment) => (
              <div key={investment.id} className="relative">
                <InvestmentCard
                  investment={investment}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  deleteConfirmationId={deleteConfirmationId}
                />
              </div>
            ))}
          </div>
          
          {/* Separator between types (except last) */}
          {typeIndex < sortedTypes.length - 1 && (
            <div className="pt-4">
              <Separator />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InvestmentGrid;
