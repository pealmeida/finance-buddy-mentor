import React from "react";
import { MonthlyAmount } from "../../types/finance";
import MonthlyCard from "./MonthlyCard";
import { MONTHS } from "../../constants/months";
import { useIsMobile } from "../../hooks/use-mobile";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface MonthlyExpensesGridProps {
  data: MonthlyAmount[];
  onAmountClick: (month: number) => void;
}

const MonthlyExpensesGrid: React.FC<MonthlyExpensesGridProps> = ({
  data,
  onAmountClick,
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const CardGrid = () => (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {data.map((item) => (
        <div key={item.month} className='relative'>
          <MonthlyCard
            item={item}
            monthName={MONTHS[item.month - 1]}
            onAmountClick={() => onAmountClick(item.month)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className='mt-6'>
      {isMobile ? (
        <Accordion
          type='single'
          collapsible
          className='w-full'
          defaultValue='expenses-grid'>
          <AccordionItem value='expenses-grid' className='border-none'>
            <AccordionTrigger className='hover:no-underline'>
              <span className='text-lg font-semibold'>
                {t("expenses.monthlyExpensesData", "Monthly Expenses Overview")}
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

export default MonthlyExpensesGrid;
