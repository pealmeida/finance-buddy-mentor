
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProfileErrorStateProps {
  error: string;
}

const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({ error }) => {
  return (
    <Alert variant="destructive" className="my-8">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error}. Please try refreshing the page or signing in again.
      </AlertDescription>
    </Alert>
  );
};

export default ProfileErrorState;
