import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../hooks/use-mobile";

interface InvestmentHeaderProps {
  onAddClick: () => void;
  isLoading: boolean;
  isSaving: boolean;
}

const InvestmentHeader: React.FC<InvestmentHeaderProps> = ({
  onAddClick,
  isLoading,
  isSaving,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
      <div>
        <h2 className='text-xl md:text-2xl font-semibold'>
          {t("investments.portfolioTitle", "Investment Portfolio")}
        </h2>
        <p className='text-gray-600 text-sm md:text-base'>
          {t(
            "investments.portfolioDescription",
            "Manage your investments and track their performance."
          )}
        </p>
      </div>

      <div className='flex items-center gap-2 w-full md:w-auto'>
        <Button
          onClick={onAddClick}
          disabled={isLoading || isSaving}
          className='flex items-center gap-2 flex-1 md:flex-none text-sm'
          size={isMobile ? "sm" : "default"}>
          <Plus className='h-4 w-4' />
          <span className='hidden sm:inline'>
            {t("investments.addInvestment", "Add Investment")}
          </span>
          <span className='sm:hidden'>Add</span>
        </Button>
      </div>
    </div>
  );
};

export default InvestmentHeader;
