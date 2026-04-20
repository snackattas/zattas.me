"use client";

import { useState } from "react";
import { AutomationFunModal } from "./AutomationFunModal";
import { AutomationDetector, type AutomationDetection } from "./AutomationDetector";

/**
 * Button to trigger the Automation Fun modal
 */
export function AutomationFunButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [detection, setDetection] = useState<AutomationDetection | null>(null);

  const handleDetection = (detected: AutomationDetection) => {
    setDetection(detected);
    setIsOpen(true); // Automatically open modal when automation is detected
  };

  return (
    <>
      {/* Always-active automation detector */}
      <AutomationDetector onDetected={handleDetection} />

      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 font-semibold text-zinc-900 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-700"
      >
        Automation Fun
      </button>

      <AutomationFunModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        initialDetection={detection}
      />
    </>
  );
}
