"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { AutomationDetection } from "./AutomationDetector";
import { HaikuDisplay } from "./HaikuDisplay";
import { BouncingLogo } from "./BouncingLogo";
import { getRandomHaiku } from "@/data/haikus";
import type { Haiku } from "@/data/haikus";
import { 
  getScriptCode, 
  getInstallInstructions, 
  getAvailableLanguages, 
  getLanguageName,
  type Tool,
  type Language 
} from "@/data/automation-scripts";

interface AutomationFunModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDetection?: AutomationDetection | null;
}


/**
 * Main modal component for the Selenium Fun feature
 */
export function AutomationFunModal({ isOpen, onClose, initialDetection }: AutomationFunModalProps) {
  const [activeTool, setActiveTool] = useState<Tool>("selenium");
  const [activeLanguage, setActiveLanguage] = useState<Language>("python");
  const [haiku, setHaiku] = useState<Haiku | null>(null);
  const hasInitializedRef = useRef(false);

  // When initialDetection changes (automation detected), set haiku and animate
  useEffect(() => {
    if (initialDetection && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      // Use queueMicrotask to defer setState and avoid linting error
      queueMicrotask(() => {
        setHaiku(getRandomHaiku());
        animateBackground();
        // Set window property for test verification
        if (typeof window !== 'undefined') {
          (window as any).__automationModalOpened = true;
          (window as any).__automationDetection = initialDetection;
        }
      });
    }
  }, [initialDetection]);

  // Derive the correct language based on available languages for the active tool
  const availableLanguages = useMemo(() => getAvailableLanguages(activeTool), [activeTool]);
  
  // Auto-correct language if it's not available for the current tool
  useEffect(() => {
    if (!availableLanguages.includes(activeLanguage)) {
      const firstLanguage = availableLanguages[0];
      if (firstLanguage) {
        // Use queueMicrotask to avoid setState during render
        queueMicrotask(() => setActiveLanguage(firstLanguage));
      }
    }
  }, [activeTool, activeLanguage, availableLanguages]);

  // Check if a language is available for the current tool
  const isLanguageAvailable = (language: Language): boolean => {
    return getAvailableLanguages(activeTool).includes(language);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        {/* Modal container */}
        <div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Automation Fun
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {initialDetection && haiku ? (
              // Detected state - show haiku
              <div className="space-y-6">
                <BouncingLogo tool={initialDetection.tool} />
                <HaikuDisplay haiku={haiku} detection={initialDetection} />
              </div>
            ) : (
              // Default state - show instructions
              <div className="space-y-6">
                <p className="text-lg text-zinc-700 dark:text-zinc-300">
                  Run this automation script on your computer to get a fun message!
                </p>

                {/* Tool Toggle Buttons */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Automation Tool:</label>
                  <div className="flex flex-wrap gap-2">
                    {(["selenium", "playwright", "cypress", "vibium"] as Tool[]).map((tool) => (
                      <button
                        key={tool}
                        onClick={() => setActiveTool(tool)}
                        className={`rounded-lg px-4 py-2 font-medium transition-all ${
                          activeTool === tool
                            ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {tool.charAt(0).toUpperCase() + tool.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Toggle Buttons */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Language:</label>
                  <div className="flex flex-wrap gap-2">
                    {(["python", "java", "javascript", "ruby"] as Language[]).map((lang) => {
                      const isAvailable = isLanguageAvailable(lang);
                      return (
                        <button
                          key={lang}
                          onClick={() => isAvailable && setActiveLanguage(lang)}
                          disabled={!isAvailable}
                          className={`rounded-lg px-4 py-2 font-medium transition-all ${
                            !isAvailable
                              ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600"
                              : activeLanguage === lang
                              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Script Display */}
                <div className="space-y-4">
                  <ScriptDisplay tool={activeTool} language={activeLanguage} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


/**
 * Animate background color to green
 */
function animateBackground() {
  const duration = 5000; // 5 seconds
  const steps = 200;
  const startSaturation = 50;
  const endSaturation = 100;
  const stepDuration = duration / steps;

  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep >= steps) {
      clearInterval(interval);
      return;
    }

    const saturation = startSaturation + ((endSaturation - startSaturation) / steps) * currentStep;
    document.body.style.backgroundColor = `hsl(119, ${saturation}%, 36%)`;
    currentStep++;
  }, stepDuration);
}

/**
 * Display script code with syntax highlighting
 */
interface ScriptDisplayProps {
  tool: Tool;
  language: Language;
}

function ScriptDisplay({ tool, language }: ScriptDisplayProps) {
  const [copied, setCopied] = useState(false);
  const code = getScriptCode(tool, language);
  const languageName = getLanguageName(language);
  const installInstructions = getInstallInstructions(tool, language);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  if (!code) {
    return <p className="text-zinc-500 dark:text-zinc-400">No script available for this combination.</p>;
  }
  return (
    <div className="space-y-4">
      {/* Installation Instructions */}
      {installInstructions && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Installation Instructions</h3>
          <InstallInstructionsDisplay instructions={installInstructions} />
        </div>
      )}

      {/* Script Code */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{languageName} Script</h3>
          <button
            onClick={handleCopyScript}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              copied
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <SyntaxHighlightedCode code={code} language={language} />
      </div>
    </div>
  );
}

/**
 * Component to render installation instructions with proper code formatting
 */
interface InstallInstructionsDisplayProps {
  instructions: string;
}

function InstallInstructionsDisplay({ instructions }: InstallInstructionsDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  return (
    <div className="space-y-2 text-sm">
      {instructions.split('\n\n').map((section, index) => {
        const lines = section.split('\n');
        const stepMatch = lines[0]?.match(/^(\d+\.)\s*(.+)$/);
        
        if (stepMatch) {
          const [, stepNum, stepText] = stepMatch;
          const codeLines = lines.slice(1).filter(line => line.trim());
          
          // Format filenames in "Save the script below to X" steps
          const formatStepText = (text: string) => {
            // Match "Save the script below to X" or "Create file and save the script below to X:"
            const saveMatch = text.match(/^((?:Create file and )?[Ss]ave the script below to (?:a file named )?)([\w/.]+)(:?)$/);
            if (saveMatch) {
              const [, prefix, filename, colon] = saveMatch;
              return (
                <>
                  {prefix}
                  <code className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                    {filename}
                  </code>
                  {colon}
                </>
              );
            }
            return text;
          };
          
          const codeText = codeLines.join('\n');
          
          return (
            <div key={index} className="space-y-1">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {stepNum} {stepText ? formatStepText(stepText) : ''}
              </p>
              {codeLines.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => handleCopy(codeText, index)}
                    className={`absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                      copiedIndex === index
                        ? "bg-zinc-600 text-zinc-100 dark:bg-zinc-500 dark:text-zinc-100"
                        : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500"
                    }`}
                    aria-label="Copy code"
                  >
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </button>
                  <SyntaxHighlighter
                    language="bash"
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      padding: '0.5rem',
                      paddingRight: '4rem',
                    }}
                  >
                    {codeText}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          );
        }
        
        return null;
      }).filter(Boolean)}
    </div>
  );
}

/**
 * Syntax highlighted code block using react-syntax-highlighter
 */
interface SyntaxHighlightedCodeProps {
  code: string;
  language: Language;
}

function SyntaxHighlightedCode({ code, language }: SyntaxHighlightedCodeProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={{
        margin: 0,
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
      }}
      showLineNumbers
    >
      {code}
    </SyntaxHighlighter>
  );
}
