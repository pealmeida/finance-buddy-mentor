import { useState, useEffect } from "react";
import React from "react";

export interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}

export const defaultBreakpoints: BreakpointConfig = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export type BreakpointKey = keyof BreakpointConfig;

export function useResponsive(customBreakpoints?: Partial<BreakpointConfig>) {
  const breakpoints = React.useMemo(
    () => ({ ...defaultBreakpoints, ...customBreakpoints }),
    [customBreakpoints]
  );
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<BreakpointKey>("lg");
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      if (width < breakpoints.xs) {
        setCurrentBreakpoint("xs");
      } else if (width < breakpoints.sm) {
        setCurrentBreakpoint("sm");
      } else if (width < breakpoints.md) {
        setCurrentBreakpoint("md");
      } else if (width < breakpoints.lg) {
        setCurrentBreakpoint("lg");
      } else if (width < breakpoints.xl) {
        setCurrentBreakpoint("xl");
      } else {
        setCurrentBreakpoint("2xl");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, [breakpoints]);

  const isBreakpoint = (breakpoint: BreakpointKey) =>
    currentBreakpoint === breakpoint;
  const isBreakpointUp = (breakpoint: BreakpointKey) =>
    screenSize.width >= breakpoints[breakpoint];
  const isBreakpointDown = (breakpoint: BreakpointKey) =>
    screenSize.width < breakpoints[breakpoint];
  const isMobile = isBreakpointDown("md");
  const isTablet = isBreakpoint("md");
  const isDesktop = isBreakpointUp("lg");
  const isConstrainedDesktop = isBreakpointUp("lg") && screenSize.width >= 1024;

  // Media query utilities
  const mediaQueries = {
    isMobile: () => window.matchMedia("(max-width: 767px)").matches,
    isTablet: () =>
      window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches,
    isDesktop: () => window.matchMedia("(min-width: 1024px)").matches,
    isLargeDesktop: () => window.matchMedia("(min-width: 1280px)").matches,
    isWithinConstraint: () => window.matchMedia("(max-width: 1024px)").matches,
  };

  return {
    currentBreakpoint,
    screenSize,
    breakpoints,
    isBreakpoint,
    isBreakpointUp,
    isBreakpointDown,
    isMobile,
    isTablet,
    isDesktop,
    isConstrainedDesktop,
    mediaQueries,
  };
}
