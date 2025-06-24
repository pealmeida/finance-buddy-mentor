import React, { useState } from "react";
import { UserProfile } from "../types/finance";
import StrategiesHeader from "./savings/strategies/StrategiesHeader";
import StrategyCard from "./savings/strategies/StrategyCard";
import { getIconForStrategy } from "./savings/strategies/StrategyIconUtils";
import { generateSavingStrategies } from "../services/savingStrategiesService";
import { useTranslation } from "react-i18next";
import {
  PiggyBank,
  DollarSign,
  TrendingDown,
  Target,
  Clock,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { useResponsive } from "../hooks/use-responsive";
import { formatNumber } from "../lib/utils";

interface SavingStrategiesProps {
  userProfile: UserProfile;
}

const SavingStrategies: React.FC<SavingStrategiesProps> = ({ userProfile }) => {
  const { t } = useTranslation();
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobile } = useResponsive();

  // Get strategies using our service
  const strategies = generateSavingStrategies(userProfile);

  // Calculate potential savings
  const totalPotentialSavings = strategies.reduce(
    (sum, strategy) => sum + strategy.potentialSaving,
    0
  );

  const toggleAccordion = () => {
    setIsAccordionExpanded(!isAccordionExpanded);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Reusable content component for both Dialog and Sheet
  const ModalContent = () => (
    <Card className='w-full border-0 shadow-none bg-transparent'>
      <CardHeader className='px-0 pt-4'>
        <CardTitle className='text-2xl font-semibold leading-none tracking-tight flex justify-between pt-4 flex-col space-y-3 items-stretch'>
          <span className='text-xl text-center'>
            <PiggyBank className='inline mr-2 h-5 w-5' />
            Ready to Start Saving?
          </span>
        </CardTitle>
        <p className='text-sm text-muted-foreground px-0'>
          Start with easy strategies and gradually implement more advanced ones.
          Small changes can lead to significant savings over time.
        </p>
      </CardHeader>
      <CardContent className='pt-0 px-0 space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <div className='p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center'>
              <Target className='h-8 w-8 text-blue-600' />
            </div>
            <h4 className='font-semibold text-gray-800 mb-2'>Start Small</h4>
            <p className='text-sm text-gray-600'>
              Begin with easy strategies that require minimal effort
            </p>
          </div>

          <div className='text-center'>
            <div className='p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center'>
              <TrendingDown className='h-8 w-8 text-green-600' />
            </div>
            <h4 className='font-semibold text-gray-800 mb-2'>Track Progress</h4>
            <p className='text-sm text-gray-600'>
              Monitor your savings and celebrate milestones
            </p>
          </div>

          <div className='text-center'>
            <div className='p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center'>
              <Lightbulb className='h-8 w-8 text-purple-600' />
            </div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              Stay Consistent
            </h4>
            <p className='text-sm text-gray-600'>
              Make saving a habit rather than a one-time effort
            </p>
          </div>
        </div>

        <div className='flex gap-3 pt-4 border-t flex-col'>
          <Button
            onClick={closeModal}
            className='flex items-center gap-2 h-12 text-base order-1 bg-green-600 hover:bg-green-700 text-white'>
            <PiggyBank className='h-5 w-5' />
            Create Savings Plan
          </Button>
          <Button
            variant='outline'
            onClick={closeModal}
            className='flex items-center gap-2 h-12 text-base border-green-600 text-green-600 hover:bg-green-600 hover:text-white'>
            <Lightbulb className='h-5 w-5' />
            Get Coaching
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className='w-full space-y-8 animate-fade-in'>
      {/* Header Section */}
      <Card className='shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white'>
        <CardHeader className='pb-4'>
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
            <div>
              <CardTitle className='flex items-center gap-3 text-2xl mb-2'>
                <PiggyBank className='h-7 w-7' />
                {t("savings.strategies.title", "Money-Saving Strategies")}
              </CardTitle>
              <p className='text-green-100 text-lg'>
                {t(
                  "savings.strategies.description",
                  "Personalized strategies to help you save more and reach your financial goals faster"
                )}
              </p>
            </div>
            <div className='flex flex-col gap-3'>
              <Button
                onClick={openModal}
                className='bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-3 shadow-lg'>
                {t("savings.strategies.createPlan", "Create Savings Plan")}
              </Button>
              <Button
                variant='secondary'
                onClick={toggleAccordion}
                className='bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-3 shadow-lg flex items-center gap-2'>
                {isAccordionExpanded
                  ? t("savings.strategies.hideDetails", "Hide Details")
                  : t("savings.strategies.trackProgress", "Track Progress")}
                {isAccordionExpanded ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Accordion Content */}
      {isAccordionExpanded && (
        <div className='space-y-8 animate-accordion-down'>
          {/* Savings Summary Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <Card className='bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-blue-500 rounded-xl'>
                    <DollarSign className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 text-lg'>
                      {t(
                        "savings.strategies.potentialSavings",
                        "Potential Savings"
                      )}
                    </h3>
                    <p className='text-blue-600 font-semibold text-xl'>
                      ${formatNumber(totalPotentialSavings, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-purple-500 rounded-xl'>
                    <Target className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 text-lg'>
                      {t("savings.strategies.strategiesTitle", "Strategies")}
                    </h3>
                    <p className='text-purple-600 font-semibold text-xl'>
                      {strategies.length}{" "}
                      {t("savings.strategies.available", "Available")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-orange-500 rounded-xl'>
                    <Clock className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 text-lg'>
                      {t("savings.strategies.quickWins", "Quick Wins")}
                    </h3>
                    <p className='text-orange-600 font-semibold text-xl'>
                      {strategies.filter((s) => s.difficulty === "easy").length}{" "}
                      {t("savings.strategies.easy", "Easy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-green-500 rounded-xl'>
                    <TrendingDown className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 text-lg'>
                      {t("savings.strategies.avgSaving", "Avg. Saving")}
                    </h3>
                    <p className='text-green-600 font-semibold text-xl'>
                      $
                      {formatNumber(
                        Math.round(totalPotentialSavings / strategies.length),
                        0
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategies Section */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                <Lightbulb className='h-5 w-5 text-green-600' />
                {t(
                  "savings.strategies.recommendedTitle",
                  "Recommended Saving Strategies"
                )}
              </h2>
            </div>

            <Accordion type='single' collapsible className='w-full space-y-6'>
              {strategies.map((strategy) => (
                <AccordionItem
                  key={strategy.id}
                  value={strategy.id}
                  className='border-none'>
                  <StrategyCard
                    strategy={strategy}
                    iconComponent={getIconForStrategy(strategy.id)}
                  />
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}

      {/* Create Savings Plan Modal - Sheet Layout Pattern */}
      {isMobile ? (
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetContent
            side='bottom'
            className='h-[95vh] w-full rounded-t-lg border-t flex flex-col overflow-hidden p-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom'>
            <div className='flex flex-col space-y-2 text-center sm:text-left sticky top-0 z-10 bg-background border-b px-6 py-4'>
              <div className='flex justify-between items-center'>
                <SheetTitle className='text-foreground text-lg font-semibold text-center'>
                  Create Your Savings Plan
                </SheetTitle>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground hover:text-foreground h-8 w-8 p-0'
                  onClick={closeModal}>
                  <X className='h-4 w-4' />
                  <span className='sr-only'>Close</span>
                </Button>
              </div>
            </div>
            <div className='flex-1 overflow-y-auto px-6 pb-6'>
              <ModalContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className='max-w-4xl max-h-[85vh] overflow-y-auto p-0'>
            <DialogHeader className='relative p-6 pb-4'>
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-4 top-4 h-8 w-8 p-0 hover:bg-gray-100'
                onClick={closeModal}>
                <X className='h-4 w-4' />
                <span className='sr-only'>Close</span>
              </Button>
              <DialogTitle className='text-2xl font-bold text-center pr-12'>
                Create Your Savings Plan
              </DialogTitle>
            </DialogHeader>
            <div className='px-6 pb-6'>
              <ModalContent />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SavingStrategies;
