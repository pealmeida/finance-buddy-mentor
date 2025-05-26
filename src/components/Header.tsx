
import React from 'react';
import { Link } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import MobileNav from './ui/mobile-nav';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onboardingComplete?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onboardingComplete = false }) => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Navigation - Only show on mobile */}
        <div className="flex items-center space-x-3 md:hidden">
          {onboardingComplete && <MobileNav />}
          <Link to="/" className="flex items-center space-x-2">
            <PiggyBank className="h-6 w-6 text-finance-blue" />
            <span className="text-lg font-bold text-finance-blue">Finance Buddy</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <PiggyBank className="h-8 w-8 text-finance-blue" />
            <span className="text-xl font-bold text-finance-blue">Finance Buddy</span>
          </Link>
          
          {onboardingComplete && (
            <nav className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-finance-blue transition-colors">
                {t('navigation.dashboard', 'Dashboard')}
              </Link>
              <Link to="/monthly-savings" className="text-gray-700 hover:text-finance-blue transition-colors">
                {t('navigation.savings', 'Savings')}
              </Link>
              <Link to="/monthly-expenses" className="text-gray-700 hover:text-finance-blue transition-colors">
                {t('navigation.expenses', 'Expenses')}
              </Link>
              <Link to="/investments" className="text-gray-700 hover:text-finance-blue transition-colors">
                {t('navigation.investments', 'Investments')}
              </Link>
              <Link to="/goals" className="text-gray-700 hover:text-finance-blue transition-colors">
                {t('navigation.goals', 'Goals')}
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-finance-blue transition-colors">
                {t('navigation.profile', 'Profile')}
              </Link>
            </nav>
          )}
        </div>

        {/* Language Selector - Always visible */}
        <div className="flex items-center">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
