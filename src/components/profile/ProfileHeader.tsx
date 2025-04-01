
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProfileHeaderProps {
  userName: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        {userName && (
          <p className="text-gray-500 mt-1">Welcome, {userName}</p>
        )}
      </div>
      <Link to="/dashboard">
        <Button variant="outline">Back to Dashboard</Button>
      </Link>
    </div>
  );
};

export default ProfileHeader;
