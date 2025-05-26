
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  pattern?: '1-2-3' | '1-2-4' | '1-3-6' | 'custom';
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
  constrainOnDesktop?: boolean;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  pattern = 'custom',
  cols = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4, '2xl': 4 },
  gap = { xs: 3, sm: 4, md: 4, lg: 6, xl: 6, '2xl': 8 },
  constrainOnDesktop = true
}) => {
  const { currentBreakpoint, isConstrainedDesktop } = useResponsive();

  const getPatternClasses = () => {
    switch (pattern) {
      case '1-2-3':
        return 'menu-consistent-grid-1-2-3';
      case '1-2-4':
        return 'menu-consistent-grid-1-2-4';
      case '1-3-6':
        return cn(
          'grid gap-4',
          'grid-cols-1',
          'sm:grid-cols-3',
          'lg:grid-cols-6'
        );
      default:
        return getCustomGridClasses();
    }
  };

  const getCustomGridClasses = () => {
    const getCurrentCols = () => {
      // Apply constraint logic for desktop if enabled
      if (constrainOnDesktop && isConstrainedDesktop) {
        return Math.min(cols[currentBreakpoint] || cols.lg || 3, 4);
      }
      return cols[currentBreakpoint] || cols.lg || 3;
    };

    const getCurrentGap = () => {
      return gap[currentBreakpoint] || gap.lg || 6;
    };

    return cn(
      'grid w-full menu-consistent-grid',
      `grid-cols-${getCurrentCols()}`,
      `gap-${getCurrentGap()}`
    );
  };

  // Apply max-width constraint when on desktop
  const getContainerStyles = () => {
    if (constrainOnDesktop && isConstrainedDesktop) {
      return { maxWidth: '1400px', margin: '0 auto' };
    }
    return {};
  };

  return (
    <div 
      className={cn(
        getPatternClasses(),
        className
      )}
      style={getContainerStyles()}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
