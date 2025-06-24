import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./ui/toaster";
import { Toaster as Sonner } from "./ui/sonner";
import { TooltipProvider } from "./ui/tooltip";
import { DashboardProvider } from "../context/DashboardContext";

interface ProvidersProps {
  children: React.ReactNode;
}

// Create a new QueryClient instance
const queryClient = new QueryClient();

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DashboardProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>{children}</BrowserRouter>
        </DashboardProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Providers;
