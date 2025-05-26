
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileNav from './mobile-nav';
import LanguageSelector from '@/components/LanguageSelector';

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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:hidden">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          {showMenu && <MobileNav />}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          {actions}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
