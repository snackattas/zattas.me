import type { Haiku } from "@/data/haikus";
import type { AutomationDetection } from "./AutomationDetector";

interface HaikuDisplayProps {
  haiku: Haiku;
  detection: AutomationDetection;
}

/**
 * Displays a personalized haiku message for automation tool users
 */
export function HaikuDisplay({ haiku, detection }: HaikuDisplayProps) {
  // Format haiku text with line breaks
  const formattedHaiku = haiku.text.split('\n').map((line, index) => (
    <span key={index}>
      {index > 0 && <>&emsp;</>}
      {line}
      {index < haiku.text.split('\n').length - 1 && <br />}
    </span>
  ));

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg text-zinc-700 dark:text-zinc-300">
        Welcome, automation script runner{' '}
        <span className="font-bold text-zinc-900 dark:text-zinc-50">
          {detection.username}
        </span>
        , running{' '}
        <span className="font-bold text-zinc-900 dark:text-zinc-50">
          {detection.tool?.charAt(0).toUpperCase()}{detection.tool?.slice(1)}
        </span>
        {detection.language && (
          <>
            {' '}with{' '}
            <span className="font-bold text-zinc-900 dark:text-zinc-50">
              {detection.language.charAt(0).toUpperCase()}{detection.language.slice(1)}
            </span>
          </>
        )}
        !
      </p>
      
      <div className="space-y-4">
        <p className="text-base text-zinc-700 dark:text-zinc-300">
          Here&rsquo;s the Haiku I chose for you:
        </p>
        
        <div className="italic text-zinc-800 dark:text-zinc-200">
          {formattedHaiku}
        </div>
        
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          &mdash; {haiku.author}
        </p>
      </div>
      
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Haiku list from{' '}
        <a
          href="https://github.com/penumbra1/haiku/blob/master/db.json"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          here
        </a>
      </p>
    </div>
  );
}
