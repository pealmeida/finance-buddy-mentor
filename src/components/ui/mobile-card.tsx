
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  noPadding?: boolean;
}

const MobileCard: React.FC<MobileCardProps> = ({
  title,
  children,
  className,
  compact = false,
  noPadding = false
}) => {
  return (
    <Card className={cn(
      'w-full shadow-sm border-gray-200',
      compact && 'shadow-none border-0 bg-transparent',
      className
    )}>
      {title && (
        <CardHeader className={cn(
          compact ? 'pb-2 px-0' : 'pb-4',
          noPadding && 'px-0'
        )}>
          <CardTitle className={cn(
            compact ? 'text-base' : 'text-lg',
            'font-semibold text-gray-900'
          )}>
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(
        !title && 'pt-6',
        noPadding && 'p-0',
        compact && 'px-0'
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

export default MobileCard;
