
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onboardingComplete: boolean;
}

const Header: React.FC<HeaderProps> = ({ onboardingComplete }) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <header className="w-full py-4 px-6 md:px-10 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Link to={onboardingComplete ? "/dashboard" : "/login"}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-finance-blue to-finance-purple flex items-center justify-center">
            <span className="text-white font-semibold text-lg">FB</span>
          </div>
        </Link>
        <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-finance-blue to-finance-purple">
          Finance Buddy
        </h1>
      </div>

      {!isMobile && onboardingComplete && (
        <nav className="flex items-center gap-8 animate-fade-in">
          <Link 
            to="/dashboard" 
            className={`font-medium transition-colors ${
              location.pathname === '/dashboard' 
                ? 'text-finance-blue' 
                : 'text-slate-700 hover:text-finance-blue'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/profile" 
            className={`font-medium transition-colors ${
              location.pathname === '/profile' 
                ? 'text-finance-blue' 
                : 'text-slate-700 hover:text-finance-blue'
            }`}
          >
            Profile
          </Link>
        </nav>
      )}

      <div className="flex items-center gap-4">
        {onboardingComplete ? (
          <Link to="/profile">
            <Button variant="ghost" className="rounded-full subtle-shadow">
              <div className="h-8 w-8 rounded-full bg-finance-blue text-white flex items-center justify-center">
                <span className="font-medium">JD</span>
              </div>
            </Button>
          </Link>
        ) : (
          location.pathname !== '/login' && location.pathname !== '/signup' ? (
            <Link to="/login">
              <Button className="bg-finance-blue hover:bg-finance-blue-dark text-white transition-all duration-300 shadow-button hover:shadow-button-hover">
                Sign In
              </Button>
            </Link>
          ) : null
        )}

        {isMobile && onboardingComplete && (
          <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} size="icon">
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && onboardingComplete && (
        <div className="fixed inset-0 z-50 bg-white pt-20 px-6 animate-slide-in-right">
          <nav className="flex flex-col gap-6">
            <Link 
              to="/dashboard" 
              className="font-medium text-lg text-slate-700 hover:text-finance-blue transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/profile" 
              className="font-medium text-lg text-slate-700 hover:text-finance-blue transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
