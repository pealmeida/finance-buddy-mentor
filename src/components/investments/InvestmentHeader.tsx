import React from "react";
import { Button } from "../ui/button";
import { PlusCircle, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../hooks/use-mobile";

interface InvestmentHeaderProps {
  onAddClick: () => void;
  isLoading: boolean;
  isSaving: boolean;
  onAddEmergencyFund?: () => void;
  showEmergencyFundOption?: boolean;
}

const InvestmentHeader: React.FC<InvestmentHeaderProps> = ({
  onAddClick,
  isLoading,
  isSaving,
  onAddEmergencyFund,
  showEmergencyFundOption = false,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between items-start gap-4'>
      <p className='text-gray-600'>
        {t(
          "investments.portfolioDescription",
          "Manage your investments and track their performance."
        )}
      </p>

      <div className='flex items-center gap-3 w-full md:w-auto'>
        {showEmergencyFundOption && (
          <Button
            onClick={onAddEmergencyFund}
            disabled={isLoading || isSaving}
            variant='outline'
            className='flex items-center gap-2 border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 hover:text-green-800 transition-all duration-200 w-full md:w-auto'
            size='default'>
            <Shield className='h-4 w-4' />
            <span className='hidden sm:inline'>
              {t("investments.addEmergencyFund", "Add Emergency Fund")}
            </span>
            <span className='sm:hidden'>
              {t("investments.emergency", "Emergency")}
            </span>
          </Button>
        )}

        <Button
          onClick={onAddClick}
          disabled={isLoading || isSaving}
          className='flex items-center gap-2 font-medium px-6 py-3 text-sm bg-gradient-to-r from-finance-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg w-full md:w-auto'
          size='default'>
          <PlusCircle size={16} />
          <span className='hidden sm:inline'>
            {t("investments.addNewInvestment", "Add New Investment")}
          </span>
          <span className='sm:hidden'>
            {t("investments.addNew", "Add New Investment")}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default InvestmentHeader;
