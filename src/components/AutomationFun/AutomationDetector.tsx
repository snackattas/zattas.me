"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    // Try server-side detection first
    const checkServerSideDetection = async () => {
      if (hasDetected) return;

      try {
        const response = await fetch('/api/detect-automation');
        const data = await response.json();
        
        if (data.detected && data.tool) {
          // Server detected automation via headers
          const username = getCookie("automation_user");
          if (!username) return; // Still need username cookie
          
          const language = getCookie("automation_language");
          
          setHasDetected(true);
          const detection: AutomationDetection = {
            detected: true,
            tool: data.tool,
            username,
          };
          
          if (language) {
            detection.language = language;
          }
          
          onDetected(detection);
          return true;
        }
      } catch (error) {
        console.warn('[AutomationDetector] Server-side detection failed:', error);
      }
      
      return false;
    };

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

      // Detected! Trigger callback
      setHasDetected(true);
      const detection: AutomationDetection = {
        detected: true,
        tool,
        username,
      };
      
      if (language) {
        detection.language = language;
      }
      
      onDetected(detection);
    };

    // Try server-side detection once on mount
    checkServerSideDetection();

    // Listen for resize event (triggered when automation maximizes window)
    window.addEventListener("resize", checkClientSideAutomation);

    // Backup: Poll every 500ms for Cypress/Vibium (they don't always trigger resize)
    const interval = setInterval(checkClientSideAutomation, 500);

    // Initial client-side check
    checkClientSideAutomation();

    return () => {
      window.removeEventListener("resize", checkClientSideAutomation);
      clearInterval(interval);
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
  // Check for Cypress/Vibium (both use window.Cypress)
  if (typeof window !== "undefined" && "Cypress" in window) {
    // Try to differentiate between Cypress and Vibium
    // For now, we'll default to Cypress since Vibium is built on it
    // Could add more specific detection logic if needed
    return "cypress";
  }

  // Check for Selenium (sets navigator.webdriver)
  if (typeof navigator !== "undefined" && navigator.webdriver === true) {
    return "selenium";
  }

  return null;
}
