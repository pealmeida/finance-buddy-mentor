
import React from "react";
import { useAuth } from "./hooks/useAuth";
import LoadingScreen from "./components/LoadingScreen";
import AppRoutes from "./components/AppRoutes";
import Providers from "./components/Providers";

function App() {
  const {
    userProfile,
    isLoading,
    isProfileComplete,
    handleProfileComplete,
    handleProfileUpdate
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Providers>
      <AppRoutes
        userProfile={userProfile}
        isProfileComplete={isProfileComplete}
        onProfileComplete={handleProfileComplete}
        onProfileUpdate={handleProfileUpdate}
      />
    </Providers>
  );
}

export default App;
