
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';

interface ResponsiveSpacingProps {
  children: React.ReactNode;
  className?: string;
  p?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  m?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
}

const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({
  children,
  className,
  p,
  m
}) => {
  const { currentBreakpoint } = useResponsive();

  const getPadding = () => {
    if (!p) return '';
    const padding = p[currentBreakpoint] || p.md || 4;
    return `p-${padding}`;
  };

  const getMargin = () => {
    if (!m) return '';
    const margin = m[currentBreakpoint] || m.md || 0;
    return `m-${margin}`;
  };

  const spacingClasses = cn(
    getPadding(),
    getMargin(),
    className
  );

  return (
    <div className={spacingClasses}>
      {children}
    </div>
  );
};

export default ResponsiveSpacing;
