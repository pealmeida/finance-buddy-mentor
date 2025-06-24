import React from "react";
import { useAuth } from "./hooks/useAuth";
import LoadingScreen from "./components/LoadingScreen";
import AppRoutes from "./components/AppRoutes";
import { useFinancialMetrics } from "./hooks/useFinancialMetrics";
import { LanguageProvider } from "./context/LanguageContext";
import { CurrencyProvider } from "./context/CurrencyContext";

function App() {
  const {
    userProfile,
    isLoading,
    isProfileComplete,
    handleProfileComplete,
    handleProfileUpdate,
  } = useAuth();

  const { savingsProgress, expensesRatio } = useFinancialMetrics({
    userProfile,
    onProfileUpdate: handleProfileUpdate,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <LanguageProvider>
      <CurrencyProvider initialCurrency={userProfile?.preferredCurrency}>
        <AppRoutes
          userProfile={userProfile}
          isProfileComplete={isProfileComplete}
          onProfileComplete={handleProfileComplete}
          onProfileUpdate={handleProfileUpdate}
        />
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
