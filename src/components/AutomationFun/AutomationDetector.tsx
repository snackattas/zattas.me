"use client";

import { useEffect, useState, useRef } from "react";
import { getCookie } from "@/utils/cookies";

declare global {
  interface Window {
    __automationDetected?: {
      tool: string;
      timestamp: number;
      userAgent: string;
      language: string | undefined;
      username: string | undefined;
    };
    __vibiumClock?: unknown;
    Cypress?: unknown;
  }
}

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
    const checkClientSideAutomation = async () => {
      // Only run once
      if (hasDetected) return;

      // Check for username cookie first
      const username = getCookie("automation_user");
      if (!username) return;

      // Check for tool cookie (preferred method)
      let tool = getCookie("automation_tool") as AutomationTool;

      // Fallback to browser-based detection if no cookie
      if (!tool) {
        tool = await detectAutomationTool();
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

      // Set detection state for testing harnesses
      window.__automationDetected = {
        tool,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        language,
        username,
      };

      // Set cookie for HTTP-based verification
      document.cookie = `automation_detected=${tool}; path=/; max-age=3600`;

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
        if (!hasUpgraded && window.__vibiumClock) {
          clearInterval(checkInterval);
          hasUpgraded = true;

          // Upgrade detection to Vibium (only call once)
          const upgraded: AutomationDetection = {
            ...detectionRef.current!,
            tool: "vibium",
          };
          detectionRef.current = upgraded;

          // Update detection state for testing harnesses
          window.__automationDetected = {
            tool: "vibium",
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            language: detectionRef.current.language,
            username: detectionRef.current.username,
          };

          // Update cookie
          document.cookie = `automation_detected=vibium; path=/; max-age=3600`;

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
    window.addEventListener("resize", () => checkClientSideAutomation());

    // Backup: Poll every 500ms for Cypress/Vibium (they don't always trigger resize)
    const interval = setInterval(() => checkClientSideAutomation(), 500);

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
 * Detect which automation tool is being used (client-side)
 */
export async function detectAutomationTool(): Promise<AutomationTool> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }

  // Check for Vibium specific globals FIRST (most specific)
  // Vibium injects __vibiumClock when page_clock_install is called
  if (window.__vibiumClock) {
    return "vibium";
  }

  // Check for Cypress BEFORE Selenium (uses window.Cypress)
  if ("Cypress" in window) {
    return "cypress";
  }

  // Use BotD to detect WebDriver (both Selenium and Playwright use it)
  // But can't reliably distinguish between them with BotD alone
  try {
    const { load } = await import("@fingerprintjs/botd");
    const botd = await load();
    const result = await botd.detect();
    console.log('[BotD] Result:', { bot: result.bot });

    if (result.bot) {
      // BotD confirms WebDriver automation, but can't distinguish tool
      // Fall through to native detection methods below
      console.log('[BotD] WebDriver detected');
      for (const key in window) {
        if (key.startsWith('cdc_')) {
          return "selenium";
        }
      }
      return "playwright";
    }
  } catch (e) {
    console.error('[BotD] Detection failed:', e);
  }

  return null;
}
