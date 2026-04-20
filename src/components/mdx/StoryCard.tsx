"use client";

import { type ReactNode, useState } from "react";

export function StoryCard({
  title,
  hook,
  children,
}: {
  title: string;
  hook: string;
  children: ReactNode;
}) {
  const [clickedState, setClickedState] = useState<boolean | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // If clicked, use clicked state; otherwise use hover state
  const shouldShow = clickedState !== null ? clickedState : isHovered;

  const handleClick = () => {
    // Toggle the current visible state and make it sticky
    setClickedState(!shouldShow);
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-xl border border-zinc-200/70 bg-white/50 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-900/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        className="w-full px-5 py-4 text-left transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
        aria-expanded={shouldShow}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="m-0 text-lg font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
              {title}
            </h3>
            <p className="mt-3 mb-0 text-sm italic text-zinc-600 dark:text-zinc-400">
              &ldquo;{hook}&rdquo;
            </p>
          </div>
          <div className="flex-shrink-0 pt-1">
            <span
              className={`inline-block text-zinc-500 transition-transform duration-200 dark:text-zinc-400 ${
                shouldShow ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </div>
        </div>
      </button>

      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          shouldShow ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-zinc-200/70 px-6 pb-5 pt-4 dark:border-zinc-800/70">
          <div className="prose prose-zinc dark:prose-invert prose-sm [&_p]:mb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
