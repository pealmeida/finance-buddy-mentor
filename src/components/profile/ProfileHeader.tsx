
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, ChevronLeft, Pencil } from 'lucide-react';

interface ProfileHeaderProps {
  userName: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName }) => {
  const navigate = useNavigate();

  const handleEditFullProfile = () => {
    navigate('/onboarding', { state: { isEditMode: true } });
  };

  return (
    <div className="flex items-center justify-between mb-8">
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
      <div className="flex gap-3">
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
      </div>
    </div>
  );
};

export default ProfileHeader;
