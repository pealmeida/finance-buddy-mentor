
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserIcon } from 'lucide-react';

interface ProfileHeaderProps {
  userName: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName }) => {
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
      <Link to="/dashboard">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  );
};

export default ProfileHeader;
