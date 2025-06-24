import React, { createContext, useContext, useState, useEffect } from "react";

export interface DashboardComponent {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  category: "overview" | "insights" | "charts" | "goals";
}

export const DEFAULT_DASHBOARD_COMPONENTS: DashboardComponent[] = [
  {
    id: "financial-overview",
    name: "Financial Overview",
    visible: true,
    order: 1,
    category: "overview",
  },
  {
    id: "financial-goals",
    name: "Financial Goals",
    visible: true,
    order: 2,
    category: "goals",
  },
  {
    id: "expenses-summary",
    name: "Expenses Summary",
    visible: true,
    order: 3,
    category: "charts",
  },
  {
    id: "personalized-insights",
    name: "Personalized Insights",
    visible: true,
    order: 4,
    category: "insights",
  },
  {
    id: "market-trends",
    name: "Market Trends",
    visible: true,
    order: 5,
    category: "charts",
  },
  {
    id: "onboarding-checklist",
    name: "Onboarding Checklist",
    visible: true,
    order: 6,
    category: "overview",
  },
];

interface DashboardContextType {
  components: DashboardComponent[];
  updateComponentVisibility: (componentId: string, visible: boolean) => void;
  updateComponentOrder: (componentId: string, newOrder: number) => void;
  resetToDefaults: () => void;
  isComponentVisible: (componentId: string) => boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

interface DashboardProviderProps {
  children: React.ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const [components, setComponents] = useState<DashboardComponent[]>(() => {
    try {
      const saved = localStorage.getItem("dashboard-preferences");
      if (saved) {
        const parsedComponents = JSON.parse(saved);
        // Ensure Financial Overview is always visible
        return parsedComponents.map((component: DashboardComponent) =>
          component.id === "financial-overview"
            ? { ...component, visible: true }
            : component
        );
      }
    } catch (error) {
      console.error("Error loading dashboard preferences:", error);
    }
    return DEFAULT_DASHBOARD_COMPONENTS;
  });

  // Save to localStorage whenever components change
  useEffect(() => {
    try {
      localStorage.setItem("dashboard-preferences", JSON.stringify(components));
    } catch (error) {
      console.error("Error saving dashboard preferences:", error);
    }
  }, [components]);

  const updateComponentVisibility = (componentId: string, visible: boolean) => {
    // Prevent hiding the Financial Overview component - it should always remain visible
    if (componentId === "financial-overview" && !visible) {
      console.warn(
        "Financial Overview component cannot be hidden. Use its configuration modal to control individual elements."
      );
      return;
    }

    setComponents((prev) =>
      prev.map((component) =>
        component.id === componentId ? { ...component, visible } : component
      )
    );
  };

  const updateComponentOrder = (componentId: string, newOrder: number) => {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === componentId
          ? { ...component, order: newOrder }
          : component
      )
    );
  };

  const resetToDefaults = () => {
    setComponents(DEFAULT_DASHBOARD_COMPONENTS);
  };

  const isComponentVisible = (componentId: string): boolean => {
    // Financial Overview component is always visible
    if (componentId === "financial-overview") {
      return true;
    }

    const component = components.find((c) => c.id === componentId);
    return component?.visible ?? true;
  };

  const value = {
    components,
    updateComponentVisibility,
    updateComponentOrder,
    resetToDefaults,
    isComponentVisible,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
