import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { useSupabaseData } from "@/hooks/useSupabaseData";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { fetchUserProfile } = useSupabaseData();
  const { userProfile, isLoading, authChecked } = useAuth();

  // Effect to handle redirection after successful signup
  useEffect(() => {
    // Only redirect if signup was successful, auth has been checked, and we're not already loading
    if (signupSuccess && authChecked && !isLoading && userProfile) {
      console.log("Auth state updated after signup, redirecting to onboarding");
      navigate("/onboarding", { replace: true });
      setSignupSuccess(false); // Reset signup success state
    }
  }, [signupSuccess, authChecked, isLoading, userProfile, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign up the user with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // Store name in metadata
            // Add other metadata as needed
          },
        },
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        console.error("Signup error:", error);
      } else {
        console.log("User signed up successfully:", data);

        toast({
          title: "Account created",
          description:
            "Your account has been created successfully. Please complete your profile.",
        });

        // Mark signup as successful but don't navigate yet
        // The useEffect will handle navigation once auth state is updated
        setSignupSuccess(true);

        // If session is not automatically created, we may need to sign in
        if (!data.session) {
          console.log("No session created after signup, attempting to sign in");
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email,
              password,
            });

          if (signInError) {
            throw new Error(
              `Error signing in after signup: ${signInError.message}`
            );
          }
        }
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred. Please try again.",
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
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your information to get started with Finance Buddy
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Full Name</Label>
                <div className='relative'>
                  <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='name'
                    placeholder='John Doe'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='pl-10'
                    required
                  />
                </div>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='pl-10'
                    required
                  />
                </div>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-10'
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col'>
              <Button
                type='submit'
                className='w-full bg-finance-blue hover:bg-finance-blue-dark'
                disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <div className='mt-4 text-center text-sm'>
                Already have an account?{" "}
                <Link to='/login' className='text-finance-blue hover:underline'>
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
