
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, PiggyBank, DollarSign, TrendingUp, Target, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';

const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navigationItems = [
    { href: '/dashboard', icon: Home, label: t('navigation.dashboard', 'Dashboard') },
    { href: '/monthly-savings', icon: PiggyBank, label: t('navigation.savings', 'Savings') },
    { href: '/monthly-expenses', icon: DollarSign, label: t('navigation.expenses', 'Expenses') },
    { href: '/investments', icon: TrendingUp, label: t('navigation.investments', 'Investments') },
    { href: '/goals', icon: Target, label: t('navigation.goals', 'Goals') },
    { href: '/profile', icon: User, label: t('navigation.profile', 'Profile') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="px-6 py-4 border-b bg-finance-blue text-white">
          <SheetTitle className="text-left text-white font-bold text-lg">
            Finance Buddy
          </SheetTitle>
        </SheetHeader>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-4">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-finance-blue text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-finance-blue'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="px-6 py-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Finance Buddy v1.0
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
