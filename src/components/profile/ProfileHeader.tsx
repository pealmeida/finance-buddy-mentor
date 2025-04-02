
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, ChevronLeft, Pencil, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProfileHeaderProps {
  userName: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEditFullProfile = () => {
    navigate('/full-profile', { state: { isEditMode: true } });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        duration: 3000
      });
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-500 mt-1">
          {userName ? (
            <>Welcome, <span className="font-medium">{userName}</span></>
          ) : (
            <span className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" /> User
            </span>
          )}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={handleEditFullProfile}
          className="flex items-center gap-2 border-finance-blue text-finance-blue hover:bg-finance-blue hover:text-white"
        >
          <Pencil className="h-4 w-4" /> Edit Full Profile
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
