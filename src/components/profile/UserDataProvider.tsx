import React from "react";
import { UserProfile } from "../../types/finance";
import ProfileLoadingState from "./ProfileLoadingState";
import ProfileErrorState from "./ProfileErrorState";
import { useProfileData } from "../../hooks/useProfileData";

interface UserDataProviderProps {
  children: (props: {
    profile: UserProfile;
    userName: string;
    handleInputChange: (field: keyof UserProfile, value: any) => void;
  }) => React.ReactNode;
  userProfile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const UserDataProvider: React.FC<UserDataProviderProps> = ({
  children,
  userProfile,
  onProfileUpdate,
}) => {
  const { profile, userName, loading, error, handleInputChange } =
    useProfileData(userProfile);

  if (loading) {
    return <ProfileLoadingState />;
  }

  if (error) {
    return <ProfileErrorState error={error} />;
  }

  return <>{children({ profile, userName, handleInputChange })}</>;
};

export default UserDataProvider;
