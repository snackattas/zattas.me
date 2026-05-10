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

export async function detectAutomationTool(): Promise<AutomationTool> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }

  // Check Vibium first — it injects __vibiumClock via page_clock_install
  if (window.__vibiumClock) {
    return "vibium";
  }

  // Check Cypress before WebDriver tools — uses window.Cypress global
  if ("Cypress" in window) {
    return "cypress";
  }

  // BotD detects WebDriver (Selenium and Playwright both trigger it),
  // then cdc_ globals distinguish Selenium from Playwright
  try {
    const { load } = await import("@fingerprintjs/botd");
    const botd = await load();
    const result = await botd.detect();
    console.log('[BotD] Result:', { bot: result.bot });

    if (result.bot) {
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

export function AutomationDetector({ onDetected }: AutomationDetectorProps) {
  const [hasDetected, setHasDetected] = useState(false);
  const detectionRef = useRef<AutomationDetection | null>(null);

  useEffect(() => {
    const announceDetection = (detection: AutomationDetection) => {
      detectionRef.current = detection;
      window.__automationDetected = {
        tool: detection.tool!,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        language: detection.language,
        username: detection.username,
      };
      document.cookie = `automation_detected=${detection.tool}; path=/; max-age=3600`;
      onDetected(detection);
    };

    const tryDetect = async () => {
      if (hasDetected) return;

      const username = getCookie("automation_user");
      if (!username) return;

      // Cookie set by the script takes precedence; otherwise inspect the browser
      let tool = getCookie("automation_tool") as AutomationTool;
      if (!tool) {
        tool = await detectAutomationTool();
      }

      if (!tool) return;

      const language = getCookie("automation_language");
      const detection: AutomationDetection = {
        detected: true,
        tool,
        username,
        ...(language && { language }),
      };

      setHasDetected(true);
      announceDetection(detection);
    };

    // Vibium initializes as Selenium (WebDriver), then injects __vibiumClock shortly after.
    // Poll for the clock and upgrade the detection when it appears.
    const upgradeVibiumProcess = () => {
      if (!hasDetected) return;
      if (detectionRef.current?.tool !== "selenium") return;

      let checkCount = 0;
      const maxChecks = 50; // 5 seconds at 100ms intervals
      let hasUpgraded = false;

      const checkInterval = setInterval(() => {
        if (!hasUpgraded && window.__vibiumClock) {
          clearInterval(checkInterval);
          hasUpgraded = true;
          announceDetection({ ...detectionRef.current!, tool: "vibium" });
          return;
        }
        checkCount++;
        if (checkCount >= maxChecks) clearInterval(checkInterval);
      }, 100);
    };

    // Resize fires when automation maximizes the window; poll as backup for
    // Cypress and Vibium which don't always trigger it
    window.addEventListener("resize", () => tryDetect());
    const interval = setInterval(() => tryDetect(), 500);
    const upgradeTimer = setTimeout(upgradeVibiumProcess, 100);

    tryDetect();

    return () => {
      window.removeEventListener("resize", tryDetect);
      clearInterval(interval);
      clearTimeout(upgradeTimer);
    };
  }, [hasDetected, onDetected]);

  return null;
}
