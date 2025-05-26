
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4, '2xl': 4 },
  gap = { xs: 3, sm: 4, md: 4, lg: 6, xl: 6, '2xl': 8 }
}) => {
  const { currentBreakpoint } = useResponsive();

  const getCurrentCols = () => {
    return cols[currentBreakpoint] || cols.lg || 3;
  };

  const getCurrentGap = () => {
    return gap[currentBreakpoint] || gap.lg || 6;
  };

  const gridClasses = cn(
    'grid w-full',
    `grid-cols-${getCurrentCols()}`,
    `gap-${getCurrentGap()}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;
