
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { CircleDollarSign } from 'lucide-react';

interface HeaderProps {
  onboardingComplete?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onboardingComplete = false }) => {
  const { userProfile, handleProfileUpdate } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const signOut = async () => {
    // Any signout logic would go here
    // For now we'll just redirect to login page
    window.location.href = '/login';
  };
  
  return (
    <header className="bg-white border-b shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-finance-blue flex items-center">
          <CircleDollarSign className="h-8 w-8 mr-2 text-finance-blue logo-animation" />
          <span className="bg-gradient-to-r from-finance-blue to-finance-blue-dark bg-clip-text text-transparent">
            Finance Buddy
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {userProfile && onboardingComplete && (
            <>
              <Link to="/dashboard">
                <Button 
                  variant={isActive("/dashboard") ? "default" : "ghost"}
                  className={isActive("/dashboard") ? "bg-finance-blue" : ""}
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/goals">
                <Button 
                  variant={isActive("/goals") ? "default" : "ghost"}
                  className={isActive("/goals") ? "bg-finance-blue" : ""}
                >
                  Goals
                </Button>
              </Link>
              <Link to="/monthly-savings">
                <Button 
                  variant={isActive("/monthly-savings") ? "default" : "ghost"}
                  className={isActive("/monthly-savings") ? "bg-finance-blue" : ""}
                >
                  Monthly Savings
                </Button>
              </Link>
              <Link to="/profile">
                <Button 
                  variant={isActive("/profile") ? "default" : "ghost"}
                  className={isActive("/profile") ? "bg-finance-blue" : ""}
                >
                  Profile
                </Button>
              </Link>
            </>
          )}
          
          {userProfile ? (
            <Button onClick={signOut} variant="outline">Logout</Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-finance-blue">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
