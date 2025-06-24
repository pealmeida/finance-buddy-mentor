import React from "react";
import { MonthlyAmount } from "@/types/finance";
import MonthlyCard from "../MonthlyCard";
import { MONTHS } from "@/constants/months";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SavingsCardGridProps {
  data: MonthlyAmount[];
  onEditMonth: (month: number) => void;
}

const SavingsCardGrid: React.FC<SavingsCardGridProps> = ({
  data,
  onEditMonth,
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const CardGrid = () => (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {data.map((monthData) => (
        <div key={monthData.month} className='relative'>
          <MonthlyCard
            item={monthData}
            monthName={MONTHS[monthData.month - 1]}
            onEdit={onEditMonth}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className='mt-6'>
      {isMobile ? (
        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='savings-grid' className='border-none'>
            <AccordionTrigger className='hover:no-underline'>
              <span className='text-lg font-semibold'>
                {t("savings.monthlySavingsData", "Monthly Savings Overview")}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <CardGrid />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <CardGrid />
      )}
    </div>
  );
};

export default SavingsCardGrid;
