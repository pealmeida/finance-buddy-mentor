
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, LineChart, Target, PiggyBank, BarChart3, Wallet } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onboardingComplete?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onboardingComplete = true }) => {
  const { userProfile, handleProfileUpdate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);

  const handleSignOut = async () => {
    // Import the supabase client directly
    const { supabase } = await import('@/integrations/supabase/client');
    await supabase.auth.signOut();
    setLogoutDialog(false);
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Monthly Savings', href: '/monthly-savings', icon: PiggyBank },
    { name: 'Monthly Expenses', href: '/monthly-expenses', icon: Wallet },
    { name: 'Investments', href: '/investments', icon: LineChart },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">Finance Buddy</Link>
            </div>
            
            {/* Desktop navigation */}
            {userProfile && onboardingComplete && (
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        isActive(item.href)
                          ? 'border-b-2 border-blue-500 text-gray-900'
                          : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
          
          {/* User dropdown and mobile menu button */}
          <div className="flex items-center">
            {userProfile ? (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden sm:ml-3 sm:flex"
                  onClick={() => setLogoutDialog(true)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
                
                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                  >
                    {isOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {isOpen && userProfile && onboardingComplete && (
          <div className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                      isActive(item.href)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setLogoutDialog(true);
                }}
                className="block w-full border-l-4 border-transparent py-2 pl-3 pr-4 text-left text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              >
                <div className="flex items-center">
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Logout confirmation dialog */}
      <Dialog open={logoutDialog} onOpenChange={setLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Sign out</h3>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to sign out of your account?</p>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button variant="destructive" onClick={handleSignOut} className="w-full sm:ml-3 sm:w-auto">
              Sign out
            </Button>
            <Button variant="outline" onClick={() => setLogoutDialog(false)} className="mt-3 w-full sm:mt-0 sm:w-auto">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
