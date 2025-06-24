import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { userProfile, isLoading, authChecked } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (authChecked && !isLoading && userProfile?.id) {
      console.log("User already authenticated, redirecting to dashboard");
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [authChecked, isLoading, userProfile, navigate, location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: t("auth.missingFields"),
        description: t("auth.enterEmailPassword"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        toast({
          title: t("auth.loginFailed"),
          description: error.message,
          variant: "destructive",
        });
      } else if (data?.user) {
        toast({
          title: t("auth.loginSuccessful"),
          description: t("auth.loginSuccessDescription"),
        });

        // Wait for the session to be established
        const maxAttempts = 20; // 10 seconds max wait
        let attempts = 0;

        const waitForAuthAndProfile = async () => {
          while (attempts < maxAttempts) {
            // Check if we have a valid session
            const {
              data: { session },
            } = await supabase.auth.getSession();

            // Check if profile has been loaded in localStorage (as a backup check)
            const storedProfile = localStorage.getItem("userProfile");

            if (session?.user?.id === data.user.id && storedProfile) {
              const from = location.state?.from?.pathname || "/dashboard";
              navigate(from, { replace: true });
              return;
            }

            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms between checks
          }

          // If we've exhausted attempts, force navigation anyway
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        };

        // Start waiting for auth establishment
        await waitForAuthAndProfile();
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        title: t("auth.loginFailed"),
        description: t("auth.unexpectedError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <Header onboardingComplete={false} />
      <div className='container max-w-md mx-auto px-4 py-16'>
        <Card className='w-full shadow-lg'>
          <CardHeader className='space-y-1 text-center'>
            <CardTitle className='text-2xl font-bold'>
              {t("auth.loginTitle")}
            </CardTitle>
            <CardDescription>{t("auth.loginDescription")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>{t("auth.email")}</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    data-testid='login-email-input'
                    id='email'
                    type='email'
                    placeholder={t("auth.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='pl-10'
                    required
                  />
                </div>
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password'>{t("auth.password")}</Label>
                </div>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    data-testid='login-password-input'
                    id='password'
                    type='password'
                    placeholder={t("auth.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-10'
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col'>
              <Button
                data-testid='login-submit-button'
                type='submit'
                className='w-full bg-finance-blue hover:bg-finance-blue-dark'
                disabled={loading}>
                {loading ? t("auth.signingIn") : t("auth.signIn")}
              </Button>
              <div className='mt-4 text-center text-sm'>
                {t("auth.dontHaveAccount")}{" "}
                <Link
                  to='/signup'
                  data-testid='signup-navigation-link'
                  className='text-finance-blue hover:underline'>
                  {t("auth.signUp")}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
