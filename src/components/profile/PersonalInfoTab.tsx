import React, { useState } from "react";
import { UserProfile } from "../../types/finance";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Mail, User, CreditCard, Phone, Check, Calendar } from "lucide-react";
import CurrencySelector from "../CurrencySelector";
import { useTranslation } from "react-i18next";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";
import { updateUserPhone } from "../../hooks/supabase/utils/profileUtils";
import { handleBirthdateChange } from "../../utils/profileCompletion";
import { useCurrency, Currency } from "../../context/CurrencyContext";

// Currency Symbol Component
const CurrencySymbol: React.FC<{
  currency: Currency;
  className?: string;
}> = ({ currency, className = "" }) => {
  const getCurrencySymbol = (currency: Currency) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "BRL":
        return "R$";
      default:
        return "$";
    }
  };

  return (
    <span className={`font-bold ${className}`}>
      {getCurrencySymbol(currency)}
    </span>
  );
};

interface PersonalInfoTabProps {
  profile: UserProfile;
  onInputChange: (field: keyof UserProfile, value: any) => void;
  isSubmitting?: boolean;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  profile,
  onInputChange,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    onInputChange(field, value);
  };

  const handleVerifyPhone = () => {
    // This would trigger the phone verification process
    setIsVerifyDialogOpen(true);
    toast({
      title: t("profile.verifyPhone"),
      description: t("profile.verifyPhoneDesc"),
    });
    // In a real implementation, this would also trigger an API call to send a verification code
  };

  const handleVerificationSubmit = async () => {
    setIsVerifying(true);
    try {
      // In a real implementation, this would verify the code with Supabase
      // For now, we'll simulate success after a delay
      const success = await updateUserPhone(profile.phone || "");

      if (success) {
        // Update the profile with verified status
        handleChange("phoneVerified", true);
        toast({
          title: t("profile.verified"),
          description: t(
            "profile.phoneVerificationSuccess",
            "Your phone number has been verified successfully."
          ),
          variant: "default",
        });
      } else {
        toast({
          title: t("profile.verificationFailed", "Verification Failed"),
          description: t(
            "profile.phoneVerificationError",
            "Could not verify your phone number. Please try again."
          ),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("profile.verificationFailed", "Verification Failed"),
        description: t(
          "profile.phoneVerificationError",
          "Could not verify your phone number. Please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
      setIsVerifyDialogOpen(false);
      setVerificationCode("");
    }
  };

  return (
    <div className='w-full space-y-6'>
      {/* Phone Verification Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {t("profile.verifyPhone", "Verify Phone Number")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "profile.verifyPhoneDesc",
                "Enter the verification code sent to your phone."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='verificationCode'>
                {t("profile.verificationCode", "Verification Code")}
              </Label>
              <Input
                id='verificationCode'
                placeholder='123456'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className='text-center text-lg tracking-widest'
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleVerificationSubmit}
              disabled={isVerifying}
              className='w-full'>
              {isVerifying
                ? t("profile.verifying", "Verifying...")
                : t("profile.verify", "Verify")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle className='flex items-center gap-3 text-xl'>
            <User className='h-5 w-5 text-finance-blue' />
            {t("profile.personalInfo", "Personal Information")}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Left Column - Basic Info */}
            <div className='space-y-6'>
              {/* Full Name Input */}
              <div className='space-y-3'>
                <Label
                  htmlFor='fullName'
                  className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <User className='h-4 w-4 text-finance-blue' />
                  {t("profile.fullName", "Full Name")}
                </Label>
                <div className='relative group'>
                  <Input
                    id='fullName'
                    type='text'
                    value={profile.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder={t(
                      "profile.fullNamePlaceholder",
                      "Enter your full name"
                    )}
                    className='h-12 bg-gray-50/50 border-gray-200 focus:border-finance-blue focus:bg-white transition-all duration-300 rounded-lg'
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className='space-y-3'>
                <Label
                  htmlFor='email'
                  className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-finance-blue' />
                  {t("profile.email", "Email")}
                </Label>
                <div className='relative group'>
                  <Input
                    id='email'
                    type='email'
                    value={profile.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={t(
                      "profile.emailPlaceholder",
                      "your.email@example.com"
                    )}
                    className='h-12 bg-gray-50/50 border-gray-200 focus:border-finance-blue focus:bg-white transition-all duration-300 rounded-lg'
                  />
                </div>
              </div>

              {/* Phone Number Input */}
              <div className='space-y-3'>
                <Label
                  htmlFor='phone'
                  className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <Phone className='h-4 w-4 text-finance-blue' />
                  {t("profile.phoneNumber", "Phone Number")}
                </Label>
                <div className='relative group'>
                  <Input
                    id='phone'
                    type='tel'
                    value={profile.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder={t(
                      "profile.phoneNumberPlaceholder",
                      "+1 (555) 123-4567"
                    )}
                    className='h-12 bg-gray-50/50 border-gray-200 focus:border-finance-blue focus:bg-white transition-all duration-300 rounded-lg pr-24'
                  />
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                    {profile.phoneVerified ? (
                      <Badge
                        variant='default'
                        className='bg-green-100 text-green-800 border-green-200 flex items-center gap-1'>
                        <Check className='h-3 w-3' />{" "}
                        {t("profile.verified", "Verified")}
                      </Badge>
                    ) : (
                      <Button
                        size='sm'
                        variant='outline'
                        className='h-8 bg-yellow-100/50 border-yellow-300 text-yellow-800 hover:bg-yellow-200/70 hover:text-yellow-900'
                        onClick={handleVerifyPhone}
                        disabled={!profile.phone}>
                        {t("profile.verify", "Verify")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Birthdate Input */}
              <div className='space-y-3'>
                <Label
                  htmlFor='birthdate'
                  className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-finance-blue' />
                  {t("profile.birthdate", "Birthdate")}
                </Label>
                <div className='relative group'>
                  <Input
                    id='birthdate'
                    type='date'
                    value={profile.birthdate || ""}
                    onChange={(e) => {
                      const newBirthdate = e.target.value;
                      handleBirthdateChange(newBirthdate, (updates) => {
                        handleChange(
                          "birthdate" as keyof UserProfile,
                          updates.birthdate
                        );
                        handleChange("age", updates.age);
                      });
                    }}
                    className='h-12 bg-gray-50/50 border-gray-200 focus:border-finance-blue focus:bg-white transition-all duration-300 rounded-lg'
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className='space-y-6'>
              <div className='space-y-3'>
                <Label
                  htmlFor='currency'
                  className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4 text-finance-blue'>
                    <circle cx='12' cy='12' r='9' />
                    <path d='M12 3v6m0 6v6' />
                    <path d='m8 12 8 0' />
                    <path d='m8 8 8 8' />
                    <path d='m16 8-8 8' />
                  </svg>
                  {t("profile.preferredCurrency", "Preferred Currency")}
                </Label>
                <div className='relative group'>
                  <CurrencySymbol
                    currency={currency}
                    className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-finance-blue transition-colors z-10'
                  />
                  <div className='pl-12'>
                    <CurrencySelector />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;
