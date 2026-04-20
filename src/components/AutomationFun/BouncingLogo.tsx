"use client";

import { useState } from "react";
import Image from "next/image";
import type { AutomationTool } from "./AutomationDetector";

interface BouncingLogoProps {
  tool: AutomationTool;
}

/**
 * Displays a bouncing logo for the detected automation tool
 */
export function BouncingLogo({ tool }: BouncingLogoProps) {
  const [imageError, setImageError] = useState(false);
  
  if (!tool) return null;

  const logoSrc = `/images/automation/${tool}-logo.png`;
  const altText = `${tool.charAt(0).toUpperCase() + tool.slice(1)} Logo`;
  
  // Emoji fallbacks for each tool
  const emojiMap: Record<string, string> = {
    selenium: "🌐",
    playwright: "🎭",
    cypress: "🌲",
    vibium: "⚡"
  };

  return (
    <div className="flex justify-center py-8">
      <div className="relative">
        {imageError ? (
          // Fallback: Show emoji and tool name
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <div className="text-6xl">
              {emojiMap[tool] || "🤖"}
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </div>
          </div>
        ) : (
          // Try to load the image
          <Image
            src={logoSrc}
            alt={altText}
            width={96}
            height={96}
            className="animate-bounce"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </div>
  );
}
