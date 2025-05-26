
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
  const { isMobile, screenSize } = useResponsive();

  // Dynamic height based on screen size
  const getHeaderHeight = () => {
    if (screenSize.width < 375) return 'h-12'; // Very small phones
    if (screenSize.width < 414) return 'h-14'; // Standard phones
    return 'h-16'; // Larger phones and tablets
  };

  // Dynamic font size for title
  const getTitleSize = () => {
    if (screenSize.width < 375) return 'text-base';
    if (screenSize.width < 414) return 'text-lg';
    return 'text-xl';
  };

  return (
    <header className={cn(
      'sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80',
      isMobile ? 'block' : 'md:hidden'
    )}>
      <div className={cn(
        'container flex items-center justify-between px-4',
        getHeaderHeight()
      )}>
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-8 w-8 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {showMenu && <MobileNav />}
          <h1 className={cn(
            'font-semibold truncate',
            getTitleSize()
          )}>
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
