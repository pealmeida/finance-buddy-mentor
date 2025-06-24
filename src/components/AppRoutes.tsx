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
          completeRedirect ||
          (userProfile ? (
            <Dashboard
              userProfile={userProfile}
              onProfileUpdate={onProfileUpdate}
            />
          ) : (
            <Navigate to='/login' replace />
          ))
        }
      />

      <Route
        path='/onboarding'
        element={
          authRedirect ||
          (userProfile ? (
            <OnboardingPage
              onProfileComplete={onProfileComplete}
              userProfile={userProfile}
            />
          ) : (
            <Navigate to='/login' replace />
          ))
        }
      />

      <Route
        path='/full-profile'
        element={
          authRedirect ||
          completeRedirect ||
          (userProfile ? (
            <FullProfilePage
              onProfileComplete={onProfileComplete}
              userProfile={userProfile}
            />
          ) : (
            <Navigate to='/login' replace />
          ))
        }
      />

      <Route
        path='/profile'
        element={
          authRedirect ||
          completeRedirect ||
          (userProfile ? (
            <ProfilePage
              userProfile={userProfile}
              onProfileUpdate={onProfileUpdate}
            />
          ) : (
            <Navigate to='/login' replace />
          ))
        }
      />

      <Route
        path='/goals'
        element={
          authRedirect ||
          completeRedirect ||
          (userProfile ? (
            <GoalsPage userProfile={userProfile} />
          ) : (
            <Navigate to='/login' replace />
          ))
        }
      />

      <Route
        path='/monthly-savings'
        element={
          authRedirect ||
          completeRedirect ||
          (userProfile ? (
            <MonthlySavingsPage userProfile={userProfile} />
          ) : (
            <Navigate to='/login' replace />
          ))
        }
      />

      <Route
        path='/monthly-expenses'
        element={
          authRedirect ||
          completeRedirect ||
          (userProfile ? (
            <MonthlyExpensesPage
              userProfile={userProfile}
              onProfileUpdate={onProfileUpdate}
            />
          ) : (
            <Navigate to='/login' replace />
          ))
        }
      />

      <Route
        path='/investments'
        element={
          authRedirect ||
          completeRedirect ||
          (userProfile ? (
            <InvestmentsPage
              userProfile={userProfile}
              onProfileUpdate={onProfileUpdate}
            />
          ) : (
            <Navigate to='/login' replace />
          ))
        }
      />

      <Route
        path='/savings-analysis'
        element={
          authRedirect ||
          completeRedirect ||
          (userProfile ? (
            <SavingsAnalysisPage userProfile={userProfile} />
          ) : (
            <Navigate to='/login' replace />
          ))
        }
      />

      <Route path='/' element={<Navigate to={homeRedirectPath} replace />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
