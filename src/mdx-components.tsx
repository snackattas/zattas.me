import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import { Timeline, TimelineItem, TimelineItemGroup } from "@/components/mdx/Timeline";
import { ProjectCard } from "@/components/mdx/ProjectCard";
import { Disclosure } from "@/components/mdx/Disclosure";
import { Headshot } from "@/components/mdx/Headshot";
import { DetailPill, Pill, PillGrid } from "@/components/mdx/Pills";
import { StoryCard } from "@/components/mdx/StoryCard";
import { AutomationFunSection } from "@/components/AutomationFun/AutomationFunSection";

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
          style={{
            color: "var(--accent)",
            textDecoration: "underline",
            transition: "opacity 0.12s",
            cursor: "pointer",
          }}
          className={className}
          {...props}
        />
      );
    },
    Timeline,
    TimelineItem,
    TimelineItemGroup,
    ProjectCard,
    Disclosure,
    Headshot,
    Pill,
    PillGrid,
    DetailPill,
    StoryCard,
    AutomationFunSection,
    ...components,
  };
}
