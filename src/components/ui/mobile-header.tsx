import React from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNav from "./mobile-nav";
import LanguageSelector from "../LanguageSelector";
import { useResponsive } from "../../hooks/use-responsive";
import { cn } from "../../lib/utils";

interface MobileHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title, actions }) => {
  const navigate = useNavigate();
  const { isMobile, screenSize, isConstrainedDesktop } = useResponsive();

  const getHeaderClasses = () => {
    return cn(
      "fixed top-0 left-0 right-0 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 z-40 safe-area-inset-top",
      isMobile ? "block" : "md:hidden"
    );
  };

  const getContainerClasses = () => {
    return cn(
      "menu-consistent-container flex items-center justify-between",
      "h-16 px-4", // Mobile base
      isConstrainedDesktop && "lg:max-w-[1400px] lg:mx-auto" // Desktop constraint
    );
  };

  const getTitleClasses = () => {
    return cn(
      "font-semibold truncate",
      "text-base", // Mobile base
      "sm:text-lg", // Small screens
      "md:text-xl" // Medium and up
    );
  };

  return (
    <header className={getHeaderClasses()}>
      <div className={getContainerClasses()}>
        <div className='flex items-center space-x-3 flex-1 min-w-0'>
          <MobileNav />
          <h1 className={getTitleClasses()}>{title}</h1>
        </div>

        <div className='flex items-center space-x-2 flex-shrink-0'>
          <LanguageSelector />
          {actions}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
