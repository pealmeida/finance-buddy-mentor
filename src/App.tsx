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
    handleProfileUpdate,
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log("App.tsx: userProfile being passed to AppRoutes:", userProfile);

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
