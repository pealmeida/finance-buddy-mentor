import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Eye,
  EyeOff,
  RotateCcw,
  Settings2,
  BarChart3,
  Target,
  TrendingUp,
  CheckCircle,
  PieChart,
  DollarSign,
  CreditCard,
  Shield,
} from "lucide-react";
import {
  useDashboard,
  DashboardComponent,
} from "../../context/DashboardContext";
import { useResponsive } from "../../hooks/use-responsive";
import { cn } from "../../lib/utils";

interface DashboardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardCustomizationModal: React.FC<
  DashboardCustomizationModalProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const {
    components,
    updateComponentVisibility,
    resetToDefaults,
    isComponentVisible,
  } = useDashboard();

  const [hasChanges, setHasChanges] = useState(false);

  // Helper function to get default financial overview components
  const getDefaultFinancialOverviewComponents = () => [
    {
      id: "monthly-income-card",
      enabled: true,
    },
    {
      id: "total-investments-card",
      enabled: true,
    },
    {
      id: "emergency-fund",
      enabled: true,
    },
    {
      id: "investment-distribution",
      enabled: true,
    },
  ];

  // Financial Overview components state
  const [financialOverviewComponents, setFinancialOverviewComponents] =
    useState(() => {
      try {
        const saved = localStorage.getItem("financialOverview-config");
        if (saved) {
          const config = JSON.parse(saved);
          return config.sections || getDefaultFinancialOverviewComponents();
        }
      } catch (error) {
        console.error("Error loading financial overview config:", error);
      }
      return getDefaultFinancialOverviewComponents();
    });

  // Handle Financial Overview component toggle
  const handleFinancialOverviewToggle = (componentId: string) => {
    const enabledCount = financialOverviewComponents.filter(
      (c) => c.enabled
    ).length;
    const targetComponent = financialOverviewComponents.find(
      (c) => c.id === componentId
    );

    // Prevent disabling the last enabled component
    if (enabledCount === 1 && targetComponent?.enabled) {
      return;
    }

    setFinancialOverviewComponents((prev) =>
      prev.map((component) =>
        component.id === componentId
          ? { ...component, enabled: !component.enabled }
          : component
      )
    );
    setHasChanges(true);
  };

  // Get Financial Overview component icon
  const getFinancialOverviewIcon = (componentId: string) => {
    switch (componentId) {
      case "monthly-income-card":
        return <DollarSign className='h-4 w-4' />;
      case "total-investments-card":
        return <CreditCard className='h-4 w-4' />;
      case "emergency-fund":
        return <Shield className='h-4 w-4' />;
      case "investment-distribution":
        return <PieChart className='h-4 w-4' />;
      default:
        return <Settings2 className='h-4 w-4' />;
    }
  };

  // Get Financial Overview component name
  const getFinancialOverviewComponentName = (componentId: string) => {
    switch (componentId) {
      case "monthly-income-card":
        return t(
          "dashboard.financialOverviewComponents.monthlyIncomeCard.name",
          "Monthly Income"
        );
      case "total-investments-card":
        return t(
          "dashboard.financialOverviewComponents.totalInvestmentsCard.name",
          "Investments"
        );
      case "emergency-fund":
        return t(
          "dashboard.financialOverviewComponents.emergencyFund.name",
          "Emergency Fund"
        );
      case "investment-distribution":
        return t(
          "dashboard.financialOverviewComponents.investmentDistribution.name",
          "Investment Distribution"
        );
      default:
        return "";
    }
  };

  // Get Financial Overview component description
  const getFinancialOverviewComponentDescription = (componentId: string) => {
    switch (componentId) {
      case "monthly-income-card":
        return t(
          "dashboard.financialOverviewComponents.monthlyIncomeCard.description",
          "Display your monthly income information"
        );
      case "total-investments-card":
        return t(
          "dashboard.financialOverviewComponents.totalInvestmentsCard.description",
          "Show total investment portfolio value"
        );
      case "emergency-fund":
        return t(
          "dashboard.financialOverviewComponents.emergencyFund.description",
          "Emergency fund status and progress"
        );
      case "investment-distribution":
        return t(
          "dashboard.financialOverviewComponents.investmentDistribution.description",
          "Portfolio allocation breakdown"
        );
      default:
        return "";
    }
  };

  // Component icon mapping
  const getComponentIcon = (componentId: string) => {
    switch (componentId) {
      case "financial-overview":
        return <PieChart className='h-4 w-4' />;
      case "financial-goals":
        return <Target className='h-4 w-4' />;
      case "expenses-summary":
        return <BarChart3 className='h-4 w-4' />;
      case "personalized-insights":
        return <TrendingUp className='h-4 w-4' />;
      case "market-trends":
        return <TrendingUp className='h-4 w-4' />;
      case "onboarding-checklist":
        return <CheckCircle className='h-4 w-4' />;
      default:
        return <Settings2 className='h-4 w-4' />;
    }
  };

  // Get category color
  const getCategoryColor = (category: DashboardComponent["category"]) => {
    switch (category) {
      case "overview":
        return "bg-blue-100 text-blue-800";
      case "goals":
        return "bg-green-100 text-green-800";
      case "charts":
        return "bg-purple-100 text-purple-800";
      case "insights":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle component visibility toggle
  const handleVisibilityToggle = (componentId: string, visible: boolean) => {
    updateComponentVisibility(componentId, visible);
    setHasChanges(true);
  };

  // Handle reset to defaults
  const handleReset = () => {
    resetToDefaults();
    setFinancialOverviewComponents(getDefaultFinancialOverviewComponents());
    setHasChanges(false);
  };

  // Handle save to apply Financial Overview changes
  const handleSave = () => {
    // Save Financial Overview configuration
    localStorage.setItem(
      "financialOverview-config",
      JSON.stringify({
        sections: financialOverviewComponents,
        display: {
          showCurrencySymbols: true,
          compactView: false,
          showPercentages: true,
          showRecommendations: true,
          animatedCharts: true,
        },
      })
    );

    // Dispatch event to notify FinancialOverview component
    window.dispatchEvent(new CustomEvent("financialOverviewConfigUpdated"));

    setHasChanges(false);
    onClose();
  };

  // Group components by category
  const groupedComponents = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, DashboardComponent[]>);

  const categoryNames = {
    overview: t("dashboard.customization.categories.overview", "Overview"),
    goals: t("dashboard.customization.categories.goals", "Goals"),
    charts: t(
      "dashboard.customization.categories.charts",
      "Charts & Analytics"
    ),
    insights: t("dashboard.customization.categories.insights", "Insights"),
  };

  const visibleComponentsCount =
    components.filter((c) => c.visible).length +
    financialOverviewComponents.filter((c) => c.enabled).length;
  const totalComponentsCount =
    components.length + financialOverviewComponents.length;

  const getModalTitle = () => {
    return t("dashboard.customization.title", "Customize Dashboard");
  };

  // Detailed customization content component
  const DashboardCustomizationContent = () => (
    <div className='space-y-6'>
      {/* Summary Card */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium'>
            {t("dashboard.customization.summary", "Dashboard Summary")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>
              {t(
                "dashboard.customization.visibleComponents",
                "Visible Components"
              )}
            </span>
            <span className='font-medium'>
              {visibleComponentsCount} / {totalComponentsCount}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Component Categories */}
      <div className='space-y-4'>
        {Object.entries(groupedComponents).map(
          ([category, categoryComponents]) => (
            <React.Fragment key={category}>
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-medium flex items-center gap-2'>
                    <Badge
                      variant='outline'
                      className={getCategoryColor(
                        category as DashboardComponent["category"]
                      )}>
                      {categoryNames[category as keyof typeof categoryNames]}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {categoryComponents
                      .sort((a, b) => a.order - b.order)
                      .filter(
                        (component) => component.id !== "financial-overview"
                      )
                      .map((component) => {
                        return (
                          <div
                            key={component.id}
                            className='flex items-center justify-between p-3 rounded-lg border transition-colors border-gray-100 hover:border-gray-200'>
                            <div className='flex items-center gap-3'>
                              <div
                                className={`p-2 rounded-md ${
                                  component.visible
                                    ? "bg-primary/10 text-primary"
                                    : "bg-gray-100 text-gray-400"
                                }`}>
                                {getComponentIcon(component.id)}
                              </div>
                              <div>
                                <Label
                                  htmlFor={`toggle-${component.id}`}
                                  className={`font-medium cursor-pointer ${
                                    !component.visible ? "text-gray-500" : ""
                                  }`}>
                                  {t(
                                    `dashboard.components.${component.id}`,
                                    component.name
                                  )}
                                </Label>
                                <p className='text-xs text-muted-foreground'>
                                  {t(
                                    `dashboard.components.${component.id}.description`,
                                    `Configure ${component.name.toLowerCase()} visibility`
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              {component.visible ? (
                                <Eye className='h-4 w-4 text-green-600' />
                              ) : (
                                <EyeOff className='h-4 w-4 text-gray-400' />
                              )}
                              <Switch
                                id={`toggle-${component.id}`}
                                checked={component.visible}
                                onCheckedChange={(visible) =>
                                  handleVisibilityToggle(component.id, visible)
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              {/* Insert Financial Overview Components after overview category */}
              {category === "overview" && (
                <Card>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-sm font-medium flex items-center gap-2'>
                      <Badge
                        variant='outline'
                        className='bg-blue-100 text-blue-800'>
                        {t(
                          "dashboard.financialOverviewComponents.title",
                          "Financial Overview"
                        )}
                      </Badge>
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      {t(
                        "dashboard.financialOverviewComponents.description",
                        "Configure which data is displayed within the Financial Overview section"
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {financialOverviewComponents.map((component) => {
                        const enabledCount = financialOverviewComponents.filter(
                          (c) => c.enabled
                        ).length;
                        const isLastEnabled =
                          enabledCount === 1 && component.enabled;

                        return (
                          <div
                            key={component.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                              isLastEnabled
                                ? "border-amber-200 bg-amber-50"
                                : "border-gray-100 hover:border-gray-200"
                            }`}>
                            <div className='flex items-center gap-3'>
                              <div
                                className={`p-2 rounded-md ${
                                  component.enabled
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-400"
                                }`}>
                                {getFinancialOverviewIcon(component.id)}
                              </div>
                              <div>
                                <Label
                                  htmlFor={`toggle-overview-${component.id}`}
                                  className={`font-medium cursor-pointer ${
                                    !component.enabled ? "text-gray-500" : ""
                                  }`}>
                                  {getFinancialOverviewComponentName(
                                    component.id
                                  )}
                                  {isLastEnabled && (
                                    <span className='ml-2 text-xs text-amber-600 font-normal'>
                                      {t(
                                        "dashboard.financialOverviewComponents.required",
                                        "(Required)"
                                      )}
                                    </span>
                                  )}
                                </Label>
                                <p className='text-xs text-muted-foreground'>
                                  {getFinancialOverviewComponentDescription(
                                    component.id
                                  )}
                                </p>
                                {isLastEnabled && (
                                  <p className='text-xs text-amber-600 mt-1'>
                                    {t(
                                      "dashboard.financialOverviewComponents.atLeastOneVisible",
                                      "At least one component must remain visible"
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              {component.enabled ? (
                                <Eye className='h-4 w-4 text-green-600' />
                              ) : (
                                <EyeOff className='h-4 w-4 text-gray-400' />
                              )}
                              <Switch
                                id={`toggle-overview-${component.id}`}
                                checked={component.enabled}
                                disabled={isLastEnabled}
                                onCheckedChange={() =>
                                  handleFinancialOverviewToggle(component.id)
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </React.Fragment>
          )
        )}
      </div>

      <Separator />

      {/* Future Features Preview */}
      <Card className='border-dashed border-2 border-gray-200'>
        <CardHeader>
          <CardTitle className='text-sm font-medium text-gray-600'>
            {t("dashboard.customization.comingSoon", "Coming Soon")}
          </CardTitle>
          <CardDescription>
            {t(
              "dashboard.customization.futureFeatures",
              "More customization options will be available in future updates"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-3 text-sm text-gray-500'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
              {t(
                "dashboard.customization.features.dragAndDrop",
                "Drag & Drop Reordering"
              )}
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
              {t(
                "dashboard.customization.features.colorThemes",
                "Color Themes"
              )}
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
              {t(
                "dashboard.customization.features.widgetSizes",
                "Widget Sizes"
              )}
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
              {t(
                "dashboard.customization.features.customWidgets",
                "Custom Widgets"
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='flex items-center justify-between pt-4 border-t bg-background'>
        <Button
          variant='outline'
          onClick={handleReset}
          className='flex items-center gap-2'>
          <RotateCcw className='h-4 w-4' />
          {t("dashboard.customization.resetToDefaults", "Reset to Defaults")}
        </Button>

        <div className='flex gap-2'>
          <Button variant='outline' onClick={onClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={handleSave}>
            {t("common.save", "Save Changes")}
          </Button>
        </div>
      </div>
    </div>
  );

  // Render mobile sheet for mobile devices
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side='bottom'
          className={cn(
            "h-[95vh] w-full rounded-t-lg border-t",
            "flex flex-col overflow-hidden",
            "p-0"
          )}>
          <SheetHeader className='sticky top-0 z-10 bg-background border-b px-6 py-4'>
            <div className='flex justify-between items-center'>
              <SheetTitle className='text-lg font-semibold flex items-center gap-2'>
                <Settings2 className='h-5 w-5' />
                {getModalTitle()}
              </SheetTitle>
              <button
                onClick={onClose}
                className='rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
                <span className='sr-only'>Close</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <line x1='18' y1='6' x2='6' y2='18' />
                  <line x1='6' y1='6' x2='18' y2='18' />
                </svg>
              </button>
            </div>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6 pb-6'>
            <DashboardCustomizationContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Render desktop dialog for desktop devices
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-full h-full sm:max-w-4xl sm:max-h-[90vh] overflow-y-auto p-0'>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle className='flex items-center gap-2'>
            <Settings2 className='h-5 w-5' />
            {getModalTitle()}
          </DialogTitle>
          <DialogDescription>
            {t(
              "dashboard.customization.description",
              "Configure which components are visible on your dashboard. You can hide or show components to create a personalized experience."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className='px-6 py-4'>
          <DashboardCustomizationContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCustomizationModal;
