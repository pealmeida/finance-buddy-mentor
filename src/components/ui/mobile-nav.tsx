
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, PiggyBank, DollarSign, TrendingUp, Target, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[300px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-finance-blue">Finance Buddy</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-finance-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
