import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import OnboardingPage from "../pages/OnboardingPage";
import FullProfilePage from "../pages/FullProfilePage";
import ProfilePage from "../pages/ProfilePage";
import GoalsPage from "../pages/GoalsPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import NotFound from "../pages/NotFound";
import { UserProfile } from "../types/finance";
import MonthlySavingsPage from "../pages/MonthlySavingsPage";
import MonthlyExpensesPage from "../pages/MonthlyExpensesPage";
import InvestmentsPage from "../pages/InvestmentsPage";
import SavingsAnalysisPage from "../pages/SavingsAnalysisPage";

interface AppRoutesProps {
  userProfile: UserProfile | null;
  isProfileComplete: boolean;
  onProfileComplete: (profile: UserProfile) => void;
  onProfileUpdate: (profile: UserProfile) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  userProfile,
  isProfileComplete,
  onProfileComplete,
  onProfileUpdate,
}) => {
  const authRedirect = !userProfile ? <Navigate to='/login' replace /> : null;
  const completeRedirect =
    userProfile && !isProfileComplete ? (
      <Navigate to='/onboarding' replace />
    ) : null;
  const homeRedirectPath = userProfile ? "/dashboard" : "/login";

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />

      <Route
        path='/dashboard'
        element={
          authRedirect ||
          completeRedirect || (
            <Dashboard
              userProfile={userProfile as UserProfile}
              onProfileUpdate={onProfileUpdate}
            />
          )
        }
      />

      <Route
        path='/onboarding'
        element={
          authRedirect || (
            <OnboardingPage
              onProfileComplete={onProfileComplete}
              userProfile={userProfile as UserProfile}
            />
          )
        }
      />

      <Route
        path='/full-profile'
        element={
          authRedirect ||
          completeRedirect || (
            <FullProfilePage
              onProfileComplete={onProfileComplete}
              userProfile={userProfile as UserProfile}
            />
          )
        }
      />

      <Route
        path='/profile'
        element={
          authRedirect ||
          completeRedirect || (
            <ProfilePage
              userProfile={userProfile as UserProfile}
              onProfileUpdate={onProfileUpdate}
            />
          )
        }
      />

      <Route
        path='/goals'
        element={
          authRedirect ||
          completeRedirect || (
            <GoalsPage userProfile={userProfile as UserProfile} />
          )
        }
      />

      <Route
        path='/monthly-savings'
        element={
          authRedirect ||
          completeRedirect || (
            <MonthlySavingsPage
              userProfile={userProfile as UserProfile}
              onProfileUpdate={onProfileUpdate}
            />
          )
        }
      />

      <Route
        path='/monthly-expenses'
        element={
          authRedirect ||
          completeRedirect || (
            <MonthlyExpensesPage
              userProfile={userProfile as UserProfile}
              onProfileUpdate={onProfileUpdate}
            />
          )
        }
      />

      <Route
        path='/investments'
        element={
          authRedirect ||
          completeRedirect || (
            <InvestmentsPage
              userProfile={userProfile as UserProfile}
              onProfileUpdate={onProfileUpdate}
            />
          )
        }
      />

      <Route
        path='/savings-analysis'
        element={
          authRedirect ||
          completeRedirect || (
            <SavingsAnalysisPage userProfile={userProfile as UserProfile} />
          )
        }
      />

      <Route path='/' element={<Navigate to={homeRedirectPath} replace />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
