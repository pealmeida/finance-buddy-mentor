
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PiggyBank, DollarSign, TrendingUp, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navigationItems = [
    { href: '/dashboard', icon: Home, label: t('navigation.dashboard', 'Dashboard') },
    { href: '/monthly-savings', icon: PiggyBank, label: t('navigation.savings', 'Savings') },
    { href: '/monthly-expenses', icon: DollarSign, label: t('navigation.expenses', 'Expenses') },
    { href: '/investments', icon: TrendingUp, label: t('navigation.investments', 'Investments') },
    { href: '/goals', icon: Target, label: t('navigation.goals', 'Goals') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
              isActive(item.href)
                ? 'text-finance-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-finance-blue' : ''}`} />
            <span className="text-xs font-medium truncate">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
