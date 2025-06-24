import React from "react";
import { useAuth } from "./hooks/useAuth";
import LoadingScreen from "./components/LoadingScreen";
import AppRoutes from "./components/AppRoutes";
import FloatingAIChat from "./components/ui/FloatingAIChat";
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
        {userProfile?.id && (
          <FloatingAIChat
            userProfile={userProfile}
            savingsProgress={savingsProgress}
            expensesRatio={expensesRatio}
          />
        )}
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
