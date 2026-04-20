import { seleniumInstructions } from './instructions/selenium';
import { playwrightInstructions } from './instructions/playwright';
import { cypressInstructions } from './instructions/cypress';
import { vibiumInstructions } from './instructions/vibium';

import { seleniumScripts } from './scripts/selenium';
import { playwrightScripts } from './scripts/playwright';
import { cypressScripts } from './scripts/cypress';
import { vibiumScripts } from './scripts/vibium';

export type Tool = "selenium" | "playwright" | "cypress" | "vibium";
export type Language = "python" | "java" | "javascript" | "ruby";

/**
 * Get script code for a given tool and language
 */
export function getScriptCode(tool: Tool, language: Language): string {
  const scripts: Record<Tool, Record<Language, string>> = {
    selenium: seleniumScripts,
    playwright: playwrightScripts,
    cypress: cypressScripts,
    vibium: vibiumScripts,
  };

  return scripts[tool][language] || '';
}

/**
 * Get installation instructions for a given tool and language
 */
export function getInstallInstructions(tool: Tool, language: Language): string {
  const instructions: Record<Tool, Record<Language, string>> = {
    selenium: seleniumInstructions,
    playwright: playwrightInstructions,
    cypress: cypressInstructions,
    vibium: vibiumInstructions,
  };

  return instructions[tool][language] || '';
}

/**
 * Get available languages for a given tool
 */
export function getAvailableLanguages(tool: Tool): Language[] {
  if (tool === "cypress" || tool === "vibium") {
    return ["javascript"];
  }
  return ["python", "java", "javascript", "ruby"];
}

/**
 * Get language name for syntax highlighting
 */
export function getLanguageName(language: Language): string {
  const names: Record<Language, string> = {
    python: 'Python',
    java: 'Java',
    javascript: 'JavaScript',
    ruby: 'Ruby'
  };
  return names[language];
}
