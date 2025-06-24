import React, { useState } from "react";
import { UserProfile } from "../../types/finance";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import {
  Mail,
  User,
  Globe,
  CreditCard,
  Phone,
  Check,
  Calendar,
  Bot,
  CheckCircle2,
} from "lucide-react";
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
import {
  updateUserPhone,
  sendWhatsAppVerificationCode,
  verifyWhatsAppCode,
  updateWhatsAppProfile,
} from "../../hooks/supabase/utils/profileUtils";
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
  const [isWhatsAppVerifyDialogOpen, setIsWhatsAppVerifyDialogOpen] =
    useState(false);
  const [whatsAppVerificationCode, setWhatsAppVerificationCode] = useState("");
  const [isWhatsAppVerifying, setIsWhatsAppVerifying] = useState(false);
  const [whatsAppAgentEnabled, setWhatsAppAgentEnabled] = useState(
    profile.whatsAppAgentEnabled || false
  );
  const [usePhoneForWhatsApp, setUsePhoneForWhatsApp] = useState(
    (profile.whatsAppNumber === profile.phone && profile.phoneVerified) || false
  );

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

  const handleWhatsAppVerify = async () => {
    const phoneNumber = profile.phone;
    if (!phoneNumber) {
      toast({
        title: t("profile.verificationFailed", "Verification Failed"),
        description: t(
          "profile.whatsappVerificationError",
          "Please enter a phone number first"
        ),
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await sendWhatsAppVerificationCode(phoneNumber);

      if (success) {
        setIsWhatsAppVerifyDialogOpen(true);
        toast({
          title: t("profile.whatsappVerify", "WhatsApp Verification"),
          description: t(
            "profile.whatsappVerifyDesc",
            "Verification code sent to your WhatsApp"
          ),
        });
      } else {
        toast({
          title: t("profile.verificationFailed", "Verification Failed"),
          description: t(
            "profile.whatsappVerificationError",
            "Failed to send verification code"
          ),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("profile.verificationFailed", "Verification Failed"),
        description: t(
          "profile.whatsappVerificationError",
          "Could not send verification code"
        ),
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppVerificationSubmit = async () => {
    setIsWhatsAppVerifying(true);
    try {
      const phoneNumber = profile.phone;
      if (!phoneNumber) {
        throw new Error("Phone number not found");
      }

      // Verify the WhatsApp code
      const success = await verifyWhatsAppCode(
        phoneNumber,
        whatsAppVerificationCode
      );

      if (success) {
        // Update WhatsApp profile configuration
        await updateWhatsAppProfile(profile.id, phoneNumber, true);

        // Update the profile with verified status and enable agent
        handleChange("whatsAppNumber", phoneNumber); // Set WhatsApp number same as phone
        handleChange("whatsAppVerified", true);
        handleChange("whatsAppAgentEnabled", true);
        setWhatsAppAgentEnabled(true);

        toast({
          title: t("profile.whatsappVerified", "WhatsApp Verified"),
          description: t(
            "profile.whatsappAgentActivated",
            "Your WhatsApp AI Agent has been activated! You'll now receive financial updates and can interact with your agent via WhatsApp."
          ),
          variant: "default",
        });
      } else {
        toast({
          title: t("profile.verificationFailed", "Verification Failed"),
          description: t(
            "profile.whatsappVerificationError",
            "Invalid verification code. Please try again."
          ),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("profile.verificationFailed", "Verification Failed"),
        description: t(
          "profile.whatsappVerificationError",
          "Could not verify your WhatsApp number. Please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setIsWhatsAppVerifying(false);
      setIsWhatsAppVerifyDialogOpen(false);
      setWhatsAppVerificationCode("");
    }
  };

  const toggleWhatsAppAgent = () => {
    const newState = !whatsAppAgentEnabled;
    setWhatsAppAgentEnabled(newState);
    handleChange("whatsAppAgentEnabled", newState);

    toast({
      title: newState
        ? t("profile.agentEnabled", "Agent Enabled")
        : t("profile.agentDisabled", "Agent Disabled"),
      description: newState
        ? t("profile.agentEnabledDesc", "Your WhatsApp AI Agent is now active")
        : t(
            "profile.agentDisabledDesc",
            "Your WhatsApp AI Agent has been disabled"
          ),
    });
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
              variant='outline'
              onClick={() => setIsVerifyDialogOpen(false)}
              disabled={isVerifying}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleVerificationSubmit}
              disabled={verificationCode.length < 4 || isVerifying}
              className='bg-finance-blue hover:bg-finance-blue-dark'>
              {isVerifying
                ? t("profile.verifying", "Verifying...")
                : t("profile.verify", "Verify")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Verification Dialog */}
      <Dialog
        open={isWhatsAppVerifyDialogOpen}
        onOpenChange={setIsWhatsAppVerifyDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='50'
                height='50'
                viewBox='0 0 50 50'
                className='w-12 h-12 text-green-600'>
                <path
                  fill='currentColor'
                  d='M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 29.079097 3.1186875 32.88588 4.984375 36.208984 L 2.0371094 46.730469 A 1.0001 1.0001 0 0 0 3.2402344 47.970703 L 14.210938 45.251953 C 17.434629 46.972929 21.092591 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 21.278025 46 17.792121 45.029635 14.761719 43.333984 A 1.0001 1.0001 0 0 0 14.033203 43.236328 L 4.4257812 45.617188 L 7.0019531 36.425781 A 1.0001 1.0001 0 0 0 6.9023438 35.646484 C 5.0606869 32.523592 4 28.890107 4 25 C 4 13.390466 13.390466 4 25 4 z M 16.642578 13 C 16.001539 13 15.086045 13.23849 14.333984 14.048828 C 13.882268 14.535548 12 16.369511 12 19.59375 C 12 22.955271 14.331391 25.855848 14.613281 26.228516 L 14.615234 26.228516 L 14.615234 26.230469 C 14.588494 26.195329 14.973031 26.752191 15.486328 27.419922 C 15.999626 28.087653 16.717405 28.96464 17.619141 29.914062 C 19.422612 31.812909 21.958282 34.007419 25.105469 35.349609 C 26.554789 35.966779 27.698179 36.339417 28.564453 36.611328 C 30.169845 37.115426 31.632073 37.038799 32.730469 36.876953 C 33.55263 36.755876 34.456878 36.361114 35.351562 35.794922 C 36.246248 35.22873 37.12309 34.524722 37.509766 33.455078 C 37.786772 32.688244 37.927591 31.979598 37.978516 31.396484 C 38.003976 31.104927 38.007211 30.847602 37.988281 30.609375 C 37.969311 30.371148 37.989581 30.188664 37.767578 29.824219 C 37.302009 29.059804 36.774753 29.039853 36.224609 28.767578 C 35.918939 28.616297 35.048661 28.191329 34.175781 27.775391 C 33.303883 27.35992 32.54892 26.991953 32.083984 26.826172 C 31.790239 26.720488 31.431556 26.568352 30.914062 26.626953 C 30.396569 26.685553 29.88546 27.058933 29.587891 27.5 C 29.305837 27.918069 28.170387 29.258349 27.824219 29.652344 C 27.819619 29.649544 27.849659 29.663383 27.712891 29.595703 C 27.284761 29.383815 26.761157 29.203652 25.986328 28.794922 C 25.2115 28.386192 24.242255 27.782635 23.181641 26.847656 L 23.181641 26.845703 C 21.603029 25.455949 20.497272 23.711106 20.148438 23.125 C 20.171937 23.09704 20.145643 23.130901 20.195312 23.082031 L 20.197266 23.080078 C 20.553781 22.728924 20.869739 22.309521 21.136719 22.001953 C 21.515257 21.565866 21.68231 21.181437 21.863281 20.822266 C 22.223954 20.10644 22.02313 19.318742 21.814453 18.904297 L 21.814453 18.902344 C 21.828863 18.931014 21.701572 18.650157 21.564453 18.326172 C 21.426943 18.001263 21.251663 17.580039 21.064453 17.130859 C 20.690033 16.232501 20.272027 15.224912 20.023438 14.634766 L 20.023438 14.632812 C 19.730591 13.937684 19.334395 13.436908 18.816406 13.195312 C 18.298417 12.953717 17.840778 13.022402 17.822266 13.021484 L 17.820312 13.021484 C 17.450668 13.004432 17.045038 13 16.642578 13 z M 16.642578 15 C 17.028118 15 17.408214 15.004701 17.726562 15.019531 C 18.054056 15.035851 18.033687 15.037192 17.970703 15.007812 C 17.906713 14.977972 17.993533 14.968282 18.179688 15.410156 C 18.423098 15.98801 18.84317 16.999249 19.21875 17.900391 C 19.40654 18.350961 19.582292 18.773816 19.722656 19.105469 C 19.863021 19.437122 19.939077 19.622295 20.027344 19.798828 L 20.027344 19.800781 L 20.029297 19.802734 C 20.115837 19.973483 20.108185 19.864164 20.078125 19.923828 C 19.867096 20.342656 19.838461 20.445493 19.625 20.691406 C 19.29998 21.065838 18.968453 21.483404 18.792969 21.65625 C 18.639439 21.80707 18.36242 22.042032 18.189453 22.501953 C 18.016221 22.962578 18.097073 23.59457 18.375 24.066406 C 18.745032 24.6946 19.964406 26.679307 21.859375 28.347656 C 23.05276 29.399678 24.164563 30.095933 25.052734 30.564453 C 25.940906 31.032973 26.664301 31.306607 26.826172 31.386719 C 27.210549 31.576953 27.630655 31.72467 28.119141 31.666016 C 28.607627 31.607366 29.02878 31.310979 29.296875 31.007812 L 29.298828 31.005859 C 29.655629 30.601347 30.715848 29.390728 31.224609 28.644531 C 31.246169 28.652131 31.239109 28.646231 31.408203 28.707031 L 31.408203 28.708984 L 31.410156 28.708984 C 31.487356 28.736474 32.454286 29.169267 33.316406 29.580078 C 34.178526 29.990889 35.053561 30.417875 35.337891 30.558594 C 35.748225 30.761674 35.942113 30.893881 35.992188 30.894531 C 35.995572 30.982516 35.998992 31.07786 35.986328 31.222656 C 35.951258 31.624292 35.8439 32.180225 35.628906 32.775391 C 35.523582 33.066746 34.975018 33.667661 34.283203 34.105469 C 33.591388 34.543277 32.749338 34.852514 32.4375 34.898438 C 31.499896 35.036591 30.386672 35.087027 29.164062 34.703125 C 28.316336 34.437036 27.259305 34.092596 25.890625 33.509766 C 23.114812 32.325956 20.755591 30.311513 19.070312 28.537109 C 18.227674 27.649908 17.552562 26.824019 17.072266 26.199219 C 16.592866 25.575584 16.383528 25.251054 16.208984 25.021484 L 16.207031 25.019531 C 15.897202 24.609805 14 21.970851 14 19.59375 C 14 17.077989 15.168497 16.091436 15.800781 15.410156 C 16.132721 15.052495 16.495617 15 16.642578 15 z'></path>
              </svg>
              {t("profile.whatsappVerify", "Verify WhatsApp")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "profile.whatsappVerifyDesc",
                "Enter the verification code sent to your WhatsApp number."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='whatsAppVerificationCode'>
                {t("profile.verificationCode", "Verification Code")}
              </Label>
              <Input
                id='whatsAppVerificationCode'
                placeholder='123456'
                value={whatsAppVerificationCode}
                onChange={(e) => setWhatsAppVerificationCode(e.target.value)}
                className='text-center text-lg tracking-widest'
                maxLength={6}
              />
            </div>
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <Bot className='h-5 w-5 text-green-600 mt-0.5' />
                <div className='text-sm text-green-800'>
                  <p className='font-medium'>
                    {t("profile.agentActivationNote", "AI Agent Activation")}
                  </p>
                  <p className='mt-1'>
                    {t(
                      "profile.agentActivationDesc",
                      "Once verified, your personal AI assistant will be activated on WhatsApp to help you manage your finances, track expenses, and provide insights."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsWhatsAppVerifyDialogOpen(false)}
              disabled={isWhatsAppVerifying}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={handleWhatsAppVerificationSubmit}
              disabled={
                whatsAppVerificationCode.length < 4 || isWhatsAppVerifying
              }
              className='bg-green-600 hover:bg-green-700'>
              {isWhatsAppVerifying
                ? t("profile.verifying", "Verifying...")
                : t("profile.activateAgent", "Activate Agent")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Information Card */}
      <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
        <CardHeader className='bg-gradient-to-r from-finance-blue to-finance-blue-dark text-white rounded-t-lg'>
          <CardTitle className='flex items-center gap-3 text-xl'>
            <User className='h-6 w-6' />
            {t("profile.personalInfo", "Personal Information")}
          </CardTitle>
        </CardHeader>
        <CardContent className='p-8'>
          {/* Responsive Grid Layout */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Left Column - Basic Info */}
            <div className='space-y-6'>
              <div className='space-y-3'>
                <Label
                  htmlFor='email'
                  className='text-sm font-semibold text-gray-700 flex items-center justify-between w-full'>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-finance-blue' />
                    {t("profile.emailAddress", "Email Address")}
                  </div>
                  <div>
                    <span className='text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full'>
                      {t("profile.verified", "Verified")}
                    </span>
                  </div>
                </Label>
                <div className='relative group'>
                  <Input
                    id='email'
                    type='email'
                    value={profile.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={t(
                      "profile.emailPlaceholder",
                      "johndoe@example.com"
                    )}
                    className='h-12 text-gray-600 bg-gray-50/50 border-gray-200 focus:border-finance-blue focus:bg-white transition-all duration-300 rounded-lg'
                    readOnly
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <Label
                  htmlFor='name'
                  className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <User className='h-4 w-4 text-finance-blue' />
                  {t("profile.fullName", "Full Name")}
                </Label>
                <div className='relative group'>
                  <Input
                    id='name'
                    value={profile.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder={t("profile.fullNamePlaceholder", "John Doe")}
                    className='h-12 bg-gray-50/50 border-gray-200 focus:border-finance-blue focus:bg-white transition-all duration-300 rounded-lg'
                  />
                </div>
              </div>

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
                    onChange={(e) => {
                      const newPhone = e.target.value;
                      handleChange("phone", newPhone);
                      // If WhatsApp is enabled, update WhatsApp number too
                      if (usePhoneForWhatsApp) {
                        handleChange("whatsAppNumber", newPhone);
                      }
                    }}
                    placeholder={t(
                      "profile.phoneNumberPlaceholder",
                      "+1 (555) 123-4567"
                    )}
                    className='h-12 bg-gray-50/50 border-gray-200 focus:border-finance-blue focus:bg-white transition-all duration-300 rounded-lg pr-24'
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center gap-2 pr-4'>
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

                {/* WhatsApp Toggle */}
                <div
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    profile.phoneVerified
                      ? "bg-green-100/80 border-green-300"
                      : "bg-green-50/50 border-green-200"
                  }`}>
                  {/* Header Row */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='50'
                        height='50'
                        viewBox='0 0 50 50'
                        className='w-12 h-12 text-green-800'>
                        <path
                          fill='currentColor'
                          d='M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 29.079097 3.1186875 32.88588 4.984375 36.208984 L 2.0371094 46.730469 A 1.0001 1.0001 0 0 0 3.2402344 47.970703 L 14.210938 45.251953 C 17.434629 46.972929 21.092591 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 21.278025 46 17.792121 45.029635 14.761719 43.333984 A 1.0001 1.0001 0 0 0 14.033203 43.236328 L 4.4257812 45.617188 L 7.0019531 36.425781 A 1.0001 1.0001 0 0 0 6.9023438 35.646484 C 5.0606869 32.523592 4 28.890107 4 25 C 4 13.390466 13.390466 4 25 4 z M 16.642578 13 C 16.001539 13 15.086045 13.23849 14.333984 14.048828 C 13.882268 14.535548 12 16.369511 12 19.59375 C 12 22.955271 14.331391 25.855848 14.613281 26.228516 L 14.615234 26.228516 L 14.615234 26.230469 C 14.588494 26.195329 14.973031 26.752191 15.486328 27.419922 C 15.999626 28.087653 16.717405 28.96464 17.619141 29.914062 C 19.422612 31.812909 21.958282 34.007419 25.105469 35.349609 C 26.554789 35.966779 27.698179 36.339417 28.564453 36.611328 C 30.169845 37.115426 31.632073 37.038799 32.730469 36.876953 C 33.55263 36.755876 34.456878 36.361114 35.351562 35.794922 C 36.246248 35.22873 37.12309 34.524722 37.509766 33.455078 C 37.786772 32.688244 37.927591 31.979598 37.978516 31.396484 C 38.003976 31.104927 38.007211 30.847602 37.988281 30.609375 C 37.969311 30.371148 37.989581 30.188664 37.767578 29.824219 C 37.302009 29.059804 36.774753 29.039853 36.224609 28.767578 C 35.918939 28.616297 35.048661 28.191329 34.175781 27.775391 C 33.303883 27.35992 32.54892 26.991953 32.083984 26.826172 C 31.790239 26.720488 31.431556 26.568352 30.914062 26.626953 C 30.396569 26.685553 29.88546 27.058933 29.587891 27.5 C 29.305837 27.918069 28.170387 29.258349 27.824219 29.652344 C 27.819619 29.649544 27.849659 29.663383 27.712891 29.595703 C 27.284761 29.383815 26.761157 29.203652 25.986328 28.794922 C 25.2115 28.386192 24.242255 27.782635 23.181641 26.847656 L 23.181641 26.845703 C 21.603029 25.455949 20.497272 23.711106 20.148438 23.125 C 20.171937 23.09704 20.145643 23.130901 20.195312 23.082031 L 20.197266 23.080078 C 20.553781 22.728924 20.869739 22.309521 21.136719 22.001953 C 21.515257 21.565866 21.68231 21.181437 21.863281 20.822266 C 22.223954 20.10644 22.02313 19.318742 21.814453 18.904297 L 21.814453 18.902344 C 21.828863 18.931014 21.701572 18.650157 21.564453 18.326172 C 21.426943 18.001263 21.251663 17.580039 21.064453 17.130859 C 20.690033 16.232501 20.272027 15.224912 20.023438 14.634766 L 20.023438 14.632812 C 19.730591 13.937684 19.334395 13.436908 18.816406 13.195312 C 18.298417 12.953717 17.840778 13.022402 17.822266 13.021484 L 17.820312 13.021484 C 17.450668 13.004432 17.045038 13 16.642578 13 z M 16.642578 15 C 17.028118 15 17.408214 15.004701 17.726562 15.019531 C 18.054056 15.035851 18.033687 15.037192 17.970703 15.007812 C 17.906713 14.977972 17.993533 14.968282 18.179688 15.410156 C 18.423098 15.98801 18.84317 16.999249 19.21875 17.900391 C 19.40654 18.350961 19.582292 18.773816 19.722656 19.105469 C 19.863021 19.437122 19.939077 19.622295 20.027344 19.798828 L 20.027344 19.800781 L 20.029297 19.802734 C 20.115837 19.973483 20.108185 19.864164 20.078125 19.923828 C 19.867096 20.342656 19.838461 20.445493 19.625 20.691406 C 19.29998 21.065838 18.968453 21.483404 18.792969 21.65625 C 18.639439 21.80707 18.36242 22.042032 18.189453 22.501953 C 18.016221 22.962578 18.097073 23.59457 18.375 24.066406 C 18.745032 24.6946 19.964406 26.679307 21.859375 28.347656 C 23.05276 29.399678 24.164563 30.095933 25.052734 30.564453 C 25.940906 31.032973 26.664301 31.306607 26.826172 31.386719 C 27.210549 31.576953 27.630655 31.72467 28.119141 31.666016 C 28.607627 31.607366 29.02878 31.310979 29.296875 31.007812 L 29.298828 31.005859 C 29.655629 30.601347 30.715848 29.390728 31.224609 28.644531 C 31.246169 28.652131 31.239109 28.646231 31.408203 28.707031 L 31.408203 28.708984 L 31.410156 28.708984 C 31.487356 28.736474 32.454286 29.169267 33.316406 29.580078 C 34.178526 29.990889 35.053561 30.417875 35.337891 30.558594 C 35.748225 30.761674 35.942113 30.893881 35.992188 30.894531 C 35.995572 30.982516 35.998992 31.07786 35.986328 31.222656 C 35.951258 31.624292 35.8439 32.180225 35.628906 32.775391 C 35.523582 33.066746 34.975018 33.667661 34.283203 34.105469 C 33.591388 34.543277 32.749338 34.852514 32.4375 34.898438 C 31.499896 35.036591 30.386672 35.087027 29.164062 34.703125 C 28.316336 34.437036 27.259305 34.092596 25.890625 33.509766 C 23.114812 32.325956 20.755591 30.311513 19.070312 28.537109 C 18.227674 27.649908 17.552562 26.824019 17.072266 26.199219 C 16.592866 25.575584 16.383528 25.251054 16.208984 25.021484 L 16.207031 25.019531 C 15.897202 24.609805 14 21.970851 14 19.59375 C 14 17.077989 15.168497 16.091436 15.800781 15.410156 C 16.132721 15.052495 16.495617 15 16.642578 15 z'></path>
                      </svg>
                      <div>
                        <Label
                          className={`text-sm font-medium ${
                            profile.phoneVerified
                              ? "text-gray-800"
                              : "text-gray-500"
                          }`}>
                          {t("profile.enableWhatsApp", "Enable WhatsApp")}
                        </Label>
                        <p className='text-xs text-gray-600 mt-1'>
                          {t(
                            "profile.enableWhatsAppDesc",
                            "Use this number for WhatsApp verification and AI agent"
                          )}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={usePhoneForWhatsApp && profile.phoneVerified}
                      onCheckedChange={(checked) => {
                        if (!profile.phoneVerified) {
                          // Show toast message about phone verification requirement
                          toast({
                            title: t(
                              "profile.phoneVerificationRequired",
                              "Phone Verification Required"
                            ),
                            description: t(
                              "profile.phoneVerificationRequiredDesc",
                              "Please verify your phone number first before enabling WhatsApp."
                            ),
                            variant: "destructive",
                          });
                          return;
                        }

                        setUsePhoneForWhatsApp(checked);
                        if (checked) {
                          // Set WhatsApp number to phone number
                          handleChange("whatsAppNumber", profile.phone || "");
                        } else {
                          // Clear WhatsApp settings
                          handleChange("whatsAppNumber", "");
                          handleChange("whatsAppVerified", false);
                          handleChange("whatsAppAgentEnabled", false);
                          setWhatsAppAgentEnabled(false);
                        }
                      }}
                      disabled={!profile.phone || !profile.phoneVerified}
                    />
                  </div>

                  {/* Status Row - Shows badges and verify button */}
                  {(!profile.phoneVerified ||
                    (usePhoneForWhatsApp && profile.phoneVerified)) && (
                    <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                      <div className='flex flex-wrap items-center gap-2'>
                        {!profile.phoneVerified && (
                          <Badge
                            variant='outline'
                            className='bg-yellow-100/50 text-yellow-800 border-yellow-300 flex items-center gap-1'>
                            <Phone className='h-3 w-3' />
                            {t(
                              "profile.verifyPhoneFirst",
                              "Verify Phone First"
                            )}
                          </Badge>
                        )}
                        {usePhoneForWhatsApp && profile.whatsAppVerified && (
                          <Badge
                            variant='default'
                            className='bg-green-100 text-green-800 border-green-200 flex items-center gap-1'>
                            <CheckCircle2 className='h-3 w-3' />
                            {t("profile.verified", "Verified")}
                          </Badge>
                        )}
                      </div>

                      {usePhoneForWhatsApp &&
                        !profile.whatsAppVerified &&
                        profile.phone &&
                        profile.phoneVerified && (
                          <Button
                            size='sm'
                            variant='outline'
                            className='h-8 border-green-600 text-green-600 hover:bg-green-600 hover:text-white self-start sm:self-auto'
                            onClick={handleWhatsAppVerify}
                            disabled={!profile.phone || !profile.phoneVerified}>
                            {t("profile.verify", "Verify")}
                          </Button>
                        )}
                    </div>
                  )}
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

              {/* WhatsApp AI Agent Status Card */}
              {usePhoneForWhatsApp && profile.whatsAppVerified && (
                <Card className='border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'>
                  <CardHeader className='pb-4'>
                    <CardTitle className='flex items-center gap-3 text-lg text-green-800'>
                      <div className='flex items-center gap-2'>
                        <Bot className='h-5 w-5' />
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='50'
                          height='50'
                          viewBox='0 0 50 50'
                          className='w-12 h-12'>
                          <path
                            fill='currentColor'
                            d='M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 29.079097 3.1186875 32.88588 4.984375 36.208984 L 2.0371094 46.730469 A 1.0001 1.0001 0 0 0 3.2402344 47.970703 L 14.210938 45.251953 C 17.434629 46.972929 21.092591 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 21.278025 46 17.792121 45.029635 14.761719 43.333984 A 1.0001 1.0001 0 0 0 14.033203 43.236328 L 4.4257812 45.617188 L 7.0019531 36.425781 A 1.0001 1.0001 0 0 0 6.9023438 35.646484 C 5.0606869 32.523592 4 28.890107 4 25 C 4 13.390466 13.390466 4 25 4 z M 16.642578 13 C 16.001539 13 15.086045 13.23849 14.333984 14.048828 C 13.882268 14.535548 12 16.369511 12 19.59375 C 12 22.955271 14.331391 25.855848 14.613281 26.228516 L 14.615234 26.228516 L 14.615234 26.230469 C 14.588494 26.195329 14.973031 26.752191 15.486328 27.419922 C 15.999626 28.087653 16.717405 28.96464 17.619141 29.914062 C 19.422612 31.812909 21.958282 34.007419 25.105469 35.349609 C 26.554789 35.966779 27.698179 36.339417 28.564453 36.611328 C 30.169845 37.115426 31.632073 37.038799 32.730469 36.876953 C 33.55263 36.755876 34.456878 36.361114 35.351562 35.794922 C 36.246248 35.22873 37.12309 34.524722 37.509766 33.455078 C 37.786772 32.688244 37.927591 31.979598 37.978516 31.396484 C 38.003976 31.104927 38.007211 30.847602 37.988281 30.609375 C 37.969311 30.371148 37.989581 30.188664 37.767578 29.824219 C 37.302009 29.059804 36.774753 29.039853 36.224609 28.767578 C 35.918939 28.616297 35.048661 28.191329 34.175781 27.775391 C 33.303883 27.35992 32.54892 26.991953 32.083984 26.826172 C 31.790239 26.720488 31.431556 26.568352 30.914062 26.626953 C 30.396569 26.685553 29.88546 27.058933 29.587891 27.5 C 29.305837 27.918069 28.170387 29.258349 27.824219 29.652344 C 27.819619 29.649544 27.849659 29.663383 27.712891 29.595703 C 27.284761 29.383815 26.761157 29.203652 25.986328 28.794922 C 25.2115 28.386192 24.242255 27.782635 23.181641 26.847656 L 23.181641 26.845703 C 21.603029 25.455949 20.497272 23.711106 20.148438 23.125 C 20.171937 23.09704 20.145643 23.130901 20.195312 23.082031 L 20.197266 23.080078 C 20.553781 22.728924 20.869739 22.309521 21.136719 22.001953 C 21.515257 21.565866 21.68231 21.181437 21.863281 20.822266 C 22.223954 20.10644 22.02313 19.318742 21.814453 18.904297 L 21.814453 18.902344 C 21.828863 18.931014 21.701572 18.650157 21.564453 18.326172 C 21.426943 18.001263 21.251663 17.580039 21.064453 17.130859 C 20.690033 16.232501 20.272027 15.224912 20.023438 14.634766 L 20.023438 14.632812 C 19.730591 13.937684 19.334395 13.436908 18.816406 13.195312 C 18.298417 12.953717 17.840778 13.022402 17.822266 13.021484 L 17.820312 13.021484 C 17.450668 13.004432 17.045038 13 16.642578 13 z M 16.642578 15 C 17.028118 15 17.408214 15.004701 17.726562 15.019531 C 18.054056 15.035851 18.033687 15.037192 17.970703 15.007812 C 17.906713 14.977972 17.993533 14.968282 18.179688 15.410156 C 18.423098 15.98801 18.84317 16.999249 19.21875 17.900391 C 19.40654 18.350961 19.582292 18.773816 19.722656 19.105469 C 19.863021 19.437122 19.939077 19.622295 20.027344 19.798828 L 20.027344 19.800781 L 20.029297 19.802734 C 20.115837 19.973483 20.108185 19.864164 20.078125 19.923828 C 19.867096 20.342656 19.838461 20.445493 19.625 20.691406 C 19.29998 21.065838 18.968453 21.483404 18.792969 21.65625 C 18.639439 21.80707 18.36242 22.042032 18.189453 22.501953 C 18.016221 22.962578 18.097073 23.59457 18.375 24.066406 C 18.745032 24.6946 19.964406 26.679307 21.859375 28.347656 C 23.05276 29.399678 24.164563 30.095933 25.052734 30.564453 C 25.940906 31.032973 26.664301 31.306607 26.826172 31.386719 C 27.210549 31.576953 27.630655 31.72467 28.119141 31.666016 C 28.607627 31.607366 29.02878 31.310979 29.296875 31.007812 L 29.298828 31.005859 C 29.655629 30.601347 30.715848 29.390728 31.224609 28.644531 C 31.246169 28.652131 31.239109 28.646231 31.408203 28.707031 L 31.408203 28.708984 L 31.410156 28.708984 C 31.487356 28.736474 32.454286 29.169267 33.316406 29.580078 C 34.178526 29.990889 35.053561 30.417875 35.337891 30.558594 C 35.748225 30.761674 35.942113 30.893881 35.992188 30.894531 C 35.995572 30.982516 35.998992 31.07786 35.986328 31.222656 C 35.951258 31.624292 35.8439 32.180225 35.628906 32.775391 C 35.523582 33.066746 34.975018 33.667661 34.283203 34.105469 C 33.591388 34.543277 32.749338 34.852514 32.4375 34.898438 C 31.499896 35.036591 30.386672 35.087027 29.164062 34.703125 C 28.316336 34.437036 27.259305 34.092596 25.890625 33.509766 C 23.114812 32.325956 20.755591 30.311513 19.070312 28.537109 C 18.227674 27.649908 17.552562 26.824019 17.072266 26.199219 C 16.592866 25.575584 16.383528 25.251054 16.208984 25.021484 L 16.207031 25.019531 C 15.897202 24.609805 14 21.970851 14 19.59375 C 14 17.077989 15.168497 16.091436 15.800781 15.410156 C 16.132721 15.052495 16.495617 15 16.642578 15 z'></path>
                        </svg>
                      </div>
                      {t("profile.whatsappAgent", "WhatsApp AI Agent")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            whatsAppAgentEnabled
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <span className='text-sm font-medium text-gray-700'>
                          {whatsAppAgentEnabled
                            ? t("profile.agentActive", "Agent Active")
                            : t("profile.agentInactive", "Agent Inactive")}
                        </span>
                      </div>
                      <Button
                        size='sm'
                        variant={
                          whatsAppAgentEnabled ? "destructive" : "default"
                        }
                        onClick={toggleWhatsAppAgent}
                        className={
                          whatsAppAgentEnabled
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }>
                        {whatsAppAgentEnabled
                          ? t("profile.disable", "Disable")
                          : t("profile.enable", "Enable")}
                      </Button>
                    </div>

                    <div className='text-xs text-gray-600 space-y-1'>
                      <p className='font-medium'>
                        {t("profile.agentCapabilities", "Your agent can:")}
                      </p>
                      <ul className='space-y-1 ml-2'>
                        <li>
                          •{" "}
                          {t(
                            "profile.capability1",
                            "Send daily financial updates"
                          )}
                        </li>
                        <li>
                          •{" "}
                          {t(
                            "profile.capability2",
                            "Track expenses via WhatsApp"
                          )}
                        </li>
                        <li>
                          •{" "}
                          {t(
                            "profile.capability3",
                            "Provide spending insights"
                          )}
                        </li>
                        <li>
                          •{" "}
                          {t(
                            "profile.capability4",
                            "Send goal progress alerts"
                          )}
                        </li>
                        <li>
                          •{" "}
                          {t(
                            "profile.capability5",
                            "Answer financial questions"
                          )}
                        </li>
                      </ul>
                    </div>

                    {whatsAppAgentEnabled && (
                      <div className='bg-white/70 rounded-lg p-3 border border-green-200'>
                        <p className='text-xs text-green-700 font-medium'>
                          {t(
                            "profile.agentConnected",
                            "✅ Connected to your WhatsApp"
                          )}
                        </p>
                        <p className='text-xs text-gray-600 mt-1'>
                          {t("profile.agentNumber", "Number")}:{" "}
                          {profile.whatsAppNumber}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;
