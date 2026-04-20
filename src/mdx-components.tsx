import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import { Timeline, TimelineItem } from "@/components/mdx/Timeline";
import { ProjectCard } from "@/components/mdx/ProjectCard";
import { Disclosure } from "@/components/mdx/Disclosure";
import { Headshot } from "@/components/mdx/Headshot";
import { DetailPill, Pill, PillGrid } from "@/components/mdx/Pills";
import { StoryCard } from "@/components/mdx/StoryCard";
import { AutomationFunButton } from "@/components/AutomationFun";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, className, rel, target, ...props }: ComponentProps<"a">) => {
      const isExternal =
        typeof href === "string" &&
        (href.startsWith("http://") || href.startsWith("https://"));

      const nextTarget = isExternal ? "_blank" : target;
      const nextRel = isExternal
        ? (rel ? `${rel} noopener noreferrer` : "noopener noreferrer")
        : rel;

      return (
        <a
          href={href}
          target={nextTarget}
          rel={nextRel}
          className={
            `font-medium underline underline-offset-4 decoration-zinc-400/70 hover:decoration-zinc-800 dark:decoration-zinc-500/70 dark:hover:decoration-zinc-100 transition-colors ${className ?? ""}`.trim()
          }
          {...props}
        />
      );
    },
    Timeline,
    TimelineItem,
    ProjectCard,
    Disclosure,
    Headshot,
    Pill,
    PillGrid,
    DetailPill,
    StoryCard,
    AutomationFunButton,
    ...components,
  };
}
