import React, { useState } from "react";
import { Button } from "./ui/button";
import { UserProfile } from "../types/finance";
import RecommendationCard from "./investments/recommendations/RecommendationCard";
import DetailedView from "./investments/recommendations/DetailedView";
import { generateRecommendations } from "./investments/recommendations/RecommendationGenerator";
import {
  TrendingUp,
  BarChart3,
  Target,
  Star,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { useIsMobile } from "../hooks/use-mobile";
import { useTranslation } from "react-i18next";

interface InvestmentRecommendationsProps {
  userProfile: UserProfile;
}

const InvestmentRecommendations: React.FC<InvestmentRecommendationsProps> = ({
  userProfile,
}) => {
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Get recommendations based on user profile
  const recommendations = generateRecommendations(userProfile);

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
            <TrendingUp className='inline mr-2 h-5 w-5' />
            {t(
              "investments.recommendations.readyToInvest",
              "Ready to Start Investing?"
            )}
          </span>
        </CardTitle>
        <p className='text-sm text-muted-foreground px-0'>
          {t(
            "investments.recommendations.modalDescription",
            "Start with diversified portfolios and gradually build your wealth. Smart investing today can lead to significant returns over time."
          )}
        </p>
      </CardHeader>
      <CardContent className='pt-0 px-0 space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <div className='p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center'>
              <Target className='h-8 w-8 text-blue-600' />
            </div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              {t("investments.recommendations.diversify", "Diversify")}
            </h4>
            <p className='text-sm text-gray-600'>
              {t(
                "investments.recommendations.diversifyDesc",
                "Spread risk across different asset classes and sectors"
              )}
            </p>
          </div>

          <div className='text-center'>
            <div className='p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center'>
              <BarChart3 className='h-8 w-8 text-green-600' />
            </div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              {t("investments.recommendations.monitor", "Monitor")}
            </h4>
            <p className='text-sm text-gray-600'>
              {t(
                "investments.recommendations.monitorDesc",
                "Track your portfolio performance and rebalance regularly"
              )}
            </p>
          </div>

          <div className='text-center'>
            <div className='p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center'>
              <Lightbulb className='h-8 w-8 text-purple-600' />
            </div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              {t(
                "investments.recommendations.stayConsistent",
                "Stay Consistent"
              )}
            </h4>
            <p className='text-sm text-gray-600'>
              {t(
                "investments.recommendations.stayConsistentDesc",
                "Make regular investments and stay focused on long-term goals"
              )}
            </p>
          </div>
        </div>

        <div className='flex gap-3 pt-4 border-t flex-col'>
          <Button
            onClick={closeModal}
            className='flex items-center gap-2 h-12 text-base order-1 bg-blue-600 hover:bg-blue-700 text-white'>
            <TrendingUp className='h-5 w-5' />
            {t(
              "investments.recommendations.createPlan",
              "Create Investment Plan"
            )}
          </Button>
          <Button
            variant='outline'
            onClick={closeModal}
            className='flex items-center gap-2 h-12 text-base border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'>
            <Lightbulb className='h-5 w-5' />
            {t(
              "investments.recommendations.getAdvice",
              "Get Professional Advice"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className='w-full space-y-8 animate-fade-in'>
      {/* Header Section */}
      <Card className='shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
        <CardHeader className='pb-4'>
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
            <div>
              <CardTitle className='flex items-center gap-3 text-2xl mb-2'>
                <TrendingUp className='h-7 w-7' />
                {t(
                  "investments.recommendations.title",
                  "Investment Recommendations"
                )}
              </CardTitle>
              <p className='text-blue-100 text-lg'>
                {t(
                  "investments.recommendations.description",
                  "Personalized investment strategies based on your risk profile and financial goals"
                )}
              </p>
            </div>
            <div className='flex flex-col gap-3'>
              <Button
                onClick={openModal}
                className='bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 shadow-lg'>
                {t(
                  "investments.recommendations.createPlan",
                  "Create Investment Plan"
                )}
              </Button>
              {isMobile && (
                <Button
                  className='bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 shadow-lg flex items-center gap-2'
                  onClick={toggleAccordion}>
                  {isAccordionExpanded
                    ? t("common.hideDetails", "Hide Details")
                    : t("common.showDetails", "Show Details")}
                  {isAccordionExpanded ? (
                    <ChevronUp className='h-4 w-4' />
                  ) : (
                    <ChevronDown className='h-4 w-4' />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {isAccordionExpanded && (
        <div className='space-y-8 animate-accordion-down'>
          {/* Investment Summary Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-green-500 rounded-xl'>
                    <Target className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 text-lg'>
                      {t("investments.recommendations.riskLevel", "Risk Level")}
                    </h3>
                    <p className='text-green-600 font-semibold capitalize text-xl'>
                      {userProfile.riskProfile ||
                        t("investments.recommendations.moderate", "Moderate")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-blue-500 rounded-xl'>
                    <BarChart3 className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 text-lg'>
                      {t(
                        "investments.recommendations.recommendations",
                        "Recommendations"
                      )}
                    </h3>
                    <p className='text-blue-600 font-semibold text-xl'>
                      {recommendations.length}{" "}
                      {t("investments.recommendations.available", "Available")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-purple-500 rounded-xl'>
                    <Star className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 text-lg'>
                      {t(
                        "investments.recommendations.matchScore",
                        "Match Score"
                      )}
                    </h3>
                    <p className='text-purple-600 font-semibold text-xl'>
                      {t(
                        "investments.recommendations.compatible",
                        "95% Compatible"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Section */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-blue-600' />
                {t(
                  "investments.recommendations.recommended",
                  "Recommended Investment Strategies"
                )}
              </h2>
            </div>

            <Accordion type='single' collapsible className='w-full space-y-6'>
              {recommendations.map((recommendation) => (
                <AccordionItem
                  key={recommendation.id}
                  value={recommendation.id}
                  className='border-none'>
                  <RecommendationCard
                    recommendation={recommendation}
                    isExpanded={false}
                    onToggle={() => {}}
                    renderDetailedView={(rec) => (
                      <DetailedView recommendation={rec} />
                    )}
                  />
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}

      {/* Create Investment Plan Modal - Sheet Layout Pattern */}
      {isMobile ? (
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetContent
            side='bottom'
            className='h-[95vh] w-full rounded-t-lg border-t flex flex-col overflow-hidden p-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom'>
            <div className='flex flex-col space-y-2 text-center sm:text-left sticky top-0 z-10 bg-background border-b px-6 py-4'>
              <div className='flex justify-between items-center'>
                <SheetTitle className='text-foreground text-lg font-semibold text-center'>
                  {t(
                    "investments.recommendations.createYourPlan",
                    "Create Your Investment Plan"
                  )}
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
                {t(
                  "investments.recommendations.createYourPlan",
                  "Create Your Investment Plan"
                )}
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

export default InvestmentRecommendations;
