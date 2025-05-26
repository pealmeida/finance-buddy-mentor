
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'constrained';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'responsive';
  maxWidth?: number;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  size = 'constrained',
  padding = 'responsive',
  maxWidth = 1024
}) => {
  const { isMobile, isTablet, isDesktop, screenSize } = useResponsive();

  const getSizeClasses = () => {
    if (size === 'constrained') {
      return 'w-full mx-auto';
    }
    
    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-full'
    };
    return `${sizeClasses[size]} mx-auto`;
  };

  const getPaddingClasses = () => {
    if (padding === 'responsive') {
      return 'responsive-container';
    }
    
    if (padding === 'none') return 'px-0';
    
    const paddingClasses = {
      sm: 'px-4 sm:px-6',
      md: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-4 sm:px-6 lg:px-8 xl:px-12'
    };
    return paddingClasses[padding];
  };

  // Apply max-width constraint when size is constrained
  const getConstraintStyles = () => {
    if (size === 'constrained' && screenSize.width >= 1024) {
      return { maxWidth: `${maxWidth}px` };
    }
    return {};
  };

  return (
    <div 
      className={cn(
        'w-full',
        getSizeClasses(),
        getPaddingClasses(),
        className
      )}
      style={getConstraintStyles()}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
