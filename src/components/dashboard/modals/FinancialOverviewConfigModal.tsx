import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { PieChart, Shield, DollarSign, CreditCard, Info } from "lucide-react";

interface FinancialOverviewConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OverviewSection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const FinancialOverviewConfigModal: React.FC<
  FinancialOverviewConfigModalProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const [overviewSections, setOverviewSections] = useState<OverviewSection[]>(
    () => {
      // Load existing configuration from localStorage
      try {
        const saved = localStorage.getItem("financialOverview-config");
        if (saved) {
          const config = JSON.parse(saved);
          if (config.sections) {
            return [
              {
                id: "monthly-income-card",
                name: t("overview.monthlyIncome", "Monthly Income"),
                description: t(
                  "overview.monthlyIncome.description",
                  "Display your monthly income information"
                ),
                icon: <DollarSign className='h-4 w-4' />,
                enabled:
                  config.sections.find(
                    (s: any) => s.id === "monthly-income-card"
                  )?.enabled ?? true,
              },
              {
                id: "total-investments-card",
                name: t("overview.totalInvestments", "Total Investments"),
                description: t(
                  "overview.totalInvestments.description",
                  "Show total investment portfolio value"
                ),
                icon: <CreditCard className='h-4 w-4' />,
                enabled:
                  config.sections.find(
                    (s: any) => s.id === "total-investments-card"
                  )?.enabled ?? true,
              },
              {
                id: "emergency-fund",
                name: t("overview.emergencyFund", "Emergency Fund"),
                description: t(
                  "overview.emergencyFund.description",
                  "Emergency fund status and progress tracking"
                ),
                icon: <Shield className='h-4 w-4' />,
                enabled:
                  config.sections.find((s: any) => s.id === "emergency-fund")
                    ?.enabled ?? true,
              },
              {
                id: "investment-distribution",
                name: t(
                  "overview.investmentDistribution",
                  "Investment Distribution"
                ),
                description: t(
                  "overview.investmentDistribution.description",
                  "Portfolio allocation and investment breakdown"
                ),
                icon: <PieChart className='h-4 w-4' />,
                enabled:
                  config.sections.find(
                    (s: any) => s.id === "investment-distribution"
                  )?.enabled ?? true,
              },
            ];
          }
        }
      } catch (error) {
        console.error("Error loading financial overview config:", error);
      }

      // Default configuration if no saved config exists
      return [
        {
          id: "monthly-income-card",
          name: t("overview.monthlyIncome", "Monthly Income"),
          description: t(
            "overview.monthlyIncome.description",
            "Display your monthly income information"
          ),
          icon: <DollarSign className='h-4 w-4' />,
          enabled: true,
        },
        {
          id: "total-investments-card",
          name: t("overview.totalInvestments", "Total Investments"),
          description: t(
            "overview.totalInvestments.description",
            "Show total investment portfolio value"
          ),
          icon: <CreditCard className='h-4 w-4' />,
          enabled: true,
        },
        {
          id: "emergency-fund",
          name: t("overview.emergencyFund", "Emergency Fund"),
          description: t(
            "overview.emergencyFund.description",
            "Emergency fund status and progress tracking"
          ),
          icon: <Shield className='h-4 w-4' />,
          enabled: true,
        },
        {
          id: "investment-distribution",
          name: t("overview.investmentDistribution", "Investment Distribution"),
          description: t(
            "overview.investmentDistribution.description",
            "Portfolio allocation and investment breakdown"
          ),
          icon: <PieChart className='h-4 w-4' />,
          enabled: true,
        },
      ];
    }
  );

  const [displaySettings, setDisplaySettings] = useState(() => {
    // Load existing display settings from localStorage
    try {
      const saved = localStorage.getItem("financialOverview-config");
      if (saved) {
        const config = JSON.parse(saved);
        if (config.display) {
          return {
            showCurrencySymbols: config.display.showCurrencySymbols ?? true,
            compactView: config.display.compactView ?? false,
            showPercentages: config.display.showPercentages ?? true,
            showRecommendations: config.display.showRecommendations ?? true,
            animatedCharts: config.display.animatedCharts ?? true,
          };
        }
      }
    } catch (error) {
      console.error(
        "Error loading financial overview display settings:",
        error
      );
    }

    // Default display settings
    return {
      showCurrencySymbols: true,
      compactView: false,
      showPercentages: true,
      showRecommendations: true,
      animatedCharts: true,
    };
  });

  const handleSectionToggle = (sectionId: string) => {
    const enabledCount = overviewSections.filter((s) => s.enabled).length;
    const targetSection = overviewSections.find((s) => s.id === sectionId);

    // Prevent disabling the last enabled section to ensure at least one component is visible
    if (enabledCount === 1 && targetSection?.enabled) {
      return;
    }

    setOverviewSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const handleDisplaySettingToggle = (
    setting: keyof typeof displaySettings
  ) => {
    setDisplaySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSave = () => {
    // Save configurations to localStorage
    localStorage.setItem(
      "financialOverview-config",
      JSON.stringify({
        sections: overviewSections,
        display: displaySettings,
      })
    );

    // Dispatch a custom event to notify other components of the config change
    window.dispatchEvent(new CustomEvent("financialOverviewConfigUpdated"));

    onClose();
  };

  const handleReset = () => {
    setOverviewSections((prev) =>
      prev.map((section) => ({ ...section, enabled: true }))
    );
    setDisplaySettings({
      showCurrencySymbols: true,
      compactView: false,
      showPercentages: true,
      showRecommendations: true,
      animatedCharts: true,
    });
  };

  const enabledSectionsCount = overviewSections.filter((s) => s.enabled).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <PieChart className='h-5 w-5 text-blue-600' />
            {t("overview.configuration.title", "Configure Financial Overview")}
          </DialogTitle>
          <DialogDescription className='sr-only'>
            {t(
              "dashboard.financialOverviewConfigDescription",
              "Configure your financial overview settings"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Summary Card */}
          <Card className='bg-blue-50 border-blue-200'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-blue-800'>
                {t("overview.configuration.summary", "Configuration Summary")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-blue-600'>
                  {t(
                    "overview.configuration.enabledComponents",
                    "Visible Financial Components"
                  )}
                </span>
                <span className='font-medium text-blue-800'>
                  {enabledSectionsCount} / {overviewSections.length}
                </span>
              </div>
              <p className='text-xs text-blue-600 mt-2'>
                {t(
                  "overview.configuration.alwaysVisible",
                  "The Financial Overview section will always remain visible on your dashboard."
                )}
              </p>
            </CardContent>
          </Card>

          {/* Financial Data Components */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>
                {t(
                  "overview.configuration.components",
                  "Financial Data Components"
                )}
              </CardTitle>
              <p className='text-sm text-muted-foreground'>
                {t(
                  "overview.configuration.componentsNote",
                  "Control which financial data components are shown within the overview. You can hide individual elements while keeping the overview visible."
                )}
              </p>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {overviewSections.map((section) => {
                  const isLastEnabled =
                    enabledSectionsCount === 1 && section.enabled;

                  return (
                    <div
                      key={section.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        isLastEnabled
                          ? "border-amber-200 bg-amber-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`p-2 rounded-md ${
                            section.enabled
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                          }`}>
                          {section.icon}
                        </div>
                        <div>
                          <Label
                            htmlFor={`toggle-${section.id}`}
                            className={`font-medium cursor-pointer ${
                              !section.enabled ? "text-gray-500" : ""
                            }`}>
                            {section.name}
                            {isLastEnabled && (
                              <span className='ml-2 text-xs text-amber-600 font-normal'>
                                (Required)
                              </span>
                            )}
                          </Label>
                          <p className='text-xs text-muted-foreground'>
                            {section.description}
                          </p>
                          {isLastEnabled && (
                            <p className='text-xs text-amber-600 mt-1'>
                              At least one component must remain visible
                            </p>
                          )}
                        </div>
                      </div>
                      <Switch
                        id={`toggle-${section.id}`}
                        checked={section.enabled}
                        disabled={isLastEnabled}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>
                {t(
                  "overview.configuration.displaySettings",
                  "Display Settings"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Label htmlFor='currency-symbols' className='font-medium'>
                      {t(
                        "overview.configuration.showCurrencySymbols",
                        "Show Currency Symbols"
                      )}
                    </Label>
                    <Info className='h-4 w-4 text-gray-400' />
                  </div>
                  <Switch
                    id='currency-symbols'
                    checked={displaySettings.showCurrencySymbols}
                    onCheckedChange={() =>
                      handleDisplaySettingToggle("showCurrencySymbols")
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Label htmlFor='compact-view' className='font-medium'>
                      {t("overview.configuration.compactView", "Compact View")}
                    </Label>
                    <Info className='h-4 w-4 text-gray-400' />
                  </div>
                  <Switch
                    id='compact-view'
                    checked={displaySettings.compactView}
                    onCheckedChange={() =>
                      handleDisplaySettingToggle("compactView")
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Label htmlFor='show-percentages' className='font-medium'>
                      {t(
                        "overview.configuration.showPercentages",
                        "Show Percentages"
                      )}
                    </Label>
                    <Info className='h-4 w-4 text-gray-400' />
                  </div>
                  <Switch
                    id='show-percentages'
                    checked={displaySettings.showPercentages}
                    onCheckedChange={() =>
                      handleDisplaySettingToggle("showPercentages")
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Label
                      htmlFor='show-recommendations'
                      className='font-medium'>
                      {t(
                        "overview.configuration.showRecommendations",
                        "Show Recommendations"
                      )}
                    </Label>
                    <Info className='h-4 w-4 text-gray-400' />
                  </div>
                  <Switch
                    id='show-recommendations'
                    checked={displaySettings.showRecommendations}
                    onCheckedChange={() =>
                      handleDisplaySettingToggle("showRecommendations")
                    }
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Label htmlFor='animated-charts' className='font-medium'>
                      {t(
                        "overview.configuration.animatedCharts",
                        "Animated Charts"
                      )}
                    </Label>
                    <Info className='h-4 w-4 text-gray-400' />
                  </div>
                  <Switch
                    id='animated-charts'
                    checked={displaySettings.animatedCharts}
                    onCheckedChange={() =>
                      handleDisplaySettingToggle("animatedCharts")
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Emergency Fund Settings */}
          <Card className='border-dashed border-2 border-orange-200 bg-orange-50/50'>
            <CardHeader>
              <CardTitle className='text-sm font-medium text-orange-700'>
                {t(
                  "overview.configuration.emergencyFundSettings",
                  "Emergency Fund Settings"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-orange-600'>
                {t(
                  "overview.configuration.emergencyFundNote",
                  "Emergency fund configuration options will be available in future updates, including target months and calculation methods."
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className='flex items-center justify-between'>
          <Button
            variant='outline'
            onClick={handleReset}
            className='flex items-center gap-2'>
            {t("common.reset", "Reset")}
          </Button>

          <div className='flex gap-2'>
            <Button variant='outline' onClick={onClose}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleSave}>
              {t("common.save", "Save Changes")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinancialOverviewConfigModal;
