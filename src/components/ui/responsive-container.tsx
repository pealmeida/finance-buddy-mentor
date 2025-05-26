
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  dynamicPadding?: boolean;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  size = 'lg',
  padding = 'md',
  dynamicPadding = true
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full'
  };

  const getPaddingClasses = () => {
    if (!dynamicPadding) {
      const paddingClasses = {
        none: 'px-0',
        sm: 'px-4 sm:px-6',
        md: 'px-4 sm:px-6 lg:px-8',
        lg: 'px-4 sm:px-6 lg:px-8 xl:px-12'
      };
      return paddingClasses[padding];
    }

    // Dynamic padding based on screen size
    if (isMobile) {
      return 'px-4';
    } else if (isTablet) {
      return 'px-6';
    } else if (isDesktop) {
      return 'px-8 xl:px-12';
    }
    return 'px-4 sm:px-6 lg:px-8';
  };

  return (
    <div className={cn(
      'w-full mx-auto',
      sizeClasses[size],
      getPaddingClasses(),
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
