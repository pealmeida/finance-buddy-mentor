
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileNav from './mobile-nav';
import LanguageSelector from '@/components/LanguageSelector';
import { useResponsive } from '@/hooks/use-responsive';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  actions?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  showMenu = true,
  actions
}) => {
  const navigate = useNavigate();
  const { isMobile, screenSize, isConstrainedDesktop } = useResponsive();

  // Dynamic height based on screen size with media queries
  const getHeaderClasses = () => {
    return cn(
      'sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80',
      isMobile ? 'block' : 'md:hidden'
    );
  };

  const getContainerClasses = () => {
    return cn(
      'container flex items-center justify-between',
      'h-12 px-4', // Mobile base
      'sm:h-14 sm:px-6', // Small screens
      'md:h-16 md:px-8', // Medium screens
      isConstrainedDesktop && 'lg:max-w-[1024px] lg:mx-auto' // Desktop constraint
    );
  };

  const getTitleClasses = () => {
    return cn(
      'font-semibold truncate',
      'text-base', // Mobile base
      'sm:text-lg', // Small screens
      'md:text-xl' // Medium and up
    );
  };

  const getButtonSize = () => {
    if (screenSize.width < 414) return 'sm';
    return 'default';
  };

  return (
    <header className={getHeaderClasses()}>
      <div className={getContainerClasses()}>
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-8 w-8 flex-shrink-0 responsive-button"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {showMenu && <MobileNav />}
          <h1 className={getTitleClasses()}>
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <LanguageSelector />
          {actions}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
