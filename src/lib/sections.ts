import type { ComponentType } from "react";

import About from "../../content/about.mdx";
import AutomationFun from "../../content/automation-fun.mdx";
import Experience from "../../content/experience.mdx";
import Speaking from "../../content/speaking.mdx";
import Stories from "../../content/stories.mdx";
import Projects from "../../content/projects.mdx";

export type SiteSection = {
  indexLabel: string;
  navLabel: string;
  anchor: string;
  Content: ComponentType;
};

export type NavSection = Pick<SiteSection, "indexLabel" | "navLabel" | "anchor">;

export const sections: SiteSection[] = [
  { indexLabel: "01", navLabel: "About Me", anchor: "about", Content: About },
  {
    indexLabel: "02",
    navLabel: "Experience",
    anchor: "experience",
    Content: Experience,
  },
  { indexLabel: "03", navLabel: "Speaking", anchor: "speaking", Content: Speaking },
  { indexLabel: "04", navLabel: "Stories", anchor: "stories", Content: Stories },
  { indexLabel: "05", navLabel: "Projects", anchor: "projects", Content: Projects },
  {
    indexLabel: "06",
    navLabel: "Automation Fun",
    anchor: "automation-fun",
    Content: AutomationFun,
  },
];
