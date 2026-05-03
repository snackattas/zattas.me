"use client";

import { useEffect, useState, useRef } from "react";
import { getCookie } from "@/utils/cookies";

export type AutomationTool = "selenium" | "playwright" | "cypress" | "vibium" | null;

export interface AutomationDetection {
  detected: boolean;
  tool: AutomationTool;
  username: string;
  language?: string;
}

interface AutomationDetectorProps {
  onDetected: (detection: AutomationDetection) => void;
}

/**
 * Detects automation tools (Selenium, Playwright, Cypress, Vibium) and triggers callback
 */
export function AutomationDetector({ onDetected }: AutomationDetectorProps) {
  const [hasDetected, setHasDetected] = useState(false);
  const detectionRef = useRef<AutomationDetection | null>(null);

  useEffect(() => {
    const checkClientSideAutomation = () => {
      // Only run once
      if (hasDetected) return;

      // Check for username cookie first
      const username = getCookie("automation_user");
      if (!username) return;

      // Check for tool cookie (preferred method)
      let tool = getCookie("automation_tool") as AutomationTool;

      // Fallback to browser-based detection if no cookie
      if (!tool) {
        tool = detectAutomationTool();
      }

      if (!tool) return;

      // Check for language cookie (optional)
      const language = getCookie("automation_language");

      // Detected! Fire callback immediately
      setHasDetected(true);
      const detection: AutomationDetection = {
        detected: true,
        tool,
        username,
      };

      if (language) {
        detection.language = language;
      }

      detectionRef.current = detection;
      onDetected(detection);
    };

    // Spawn async process to upgrade Selenium to Vibium if clock appears
    const upgradeVibiumProcess = () => {
      if (!hasDetected) return;

      // Only upgrade if currently detected as Selenium
      if (detectionRef.current?.tool !== "selenium") return;

      let checkCount = 0;
      const maxChecks = 50; // 5 seconds at 100ms intervals
      let hasUpgraded = false;

      const checkInterval = setInterval(() => {
        if (!hasUpgraded && (window as any).__vibiumClock) {
          clearInterval(checkInterval);
          hasUpgraded = true;

          // Upgrade detection to Vibium (only call once)
          const upgraded: AutomationDetection = {
            ...detectionRef.current!,
            tool: "vibium",
          };
          detectionRef.current = upgraded;
          onDetected(upgraded);
          return;
        }

        checkCount++;
        if (checkCount >= maxChecks) {
          clearInterval(checkInterval);
        }
      }, 100);
    };

    // Listen for resize event (triggered when automation maximizes window)
    window.addEventListener("resize", checkClientSideAutomation);

    // Backup: Poll every 500ms for Cypress/Vibium (they don't always trigger resize)
    const interval = setInterval(checkClientSideAutomation, 500);

    // Initial client-side check
    checkClientSideAutomation();

    // Spawn upgrade process after detection fires
    const upgradeTimer = setTimeout(upgradeVibiumProcess, 100);

    return () => {
      window.removeEventListener("resize", checkClientSideAutomation);
      clearInterval(interval);
      clearTimeout(upgradeTimer);
    };
  }, [hasDetected, onDetected]);

  // This component doesn't render anything
  return null;
}

/**
 * Detect which automation tool is being used (client-side fallback)
 * Note: Playwright detection is handled server-side via API
 */
function detectAutomationTool(): AutomationTool {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }

  // Check for Vibium specific globals FIRST (more specific than Selenium)
  // Vibium injects __vibiumClock when page_clock_install is called
  if ((window as any).__vibiumClock) {
    return "vibium";
  }

  // Check for Selenium (injects cdc_ prefixed variables)
  // Modern Selenium injects window.cdc_* variables for Chrome DevTools Protocol communication
  for (const key in window) {
    if (key.startsWith('cdc_')) {
      return "selenium";
    }
  }

  // Check for navigator.webdriver (older Selenium versions or without evasion)
  if (navigator.webdriver === true) {
    return "selenium";
  }

  // Check for Cypress/Vibium (both use window.Cypress)
  if ("Cypress" in window) {
    // Differentiate Vibium from Cypress
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Vibium') || userAgent.includes('Chrome for Testing')) {
      return "vibium";
    }
    return "cypress";
  }

  // Check for Playwright specific globals
  // Playwright sets these on pages it controls
  if ((window as any).__playwright || (window as any).__pw_manual) {
    return "playwright";
  }

  return null;
}
