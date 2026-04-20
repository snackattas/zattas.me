import type { MDXComponents } from "mdx/types";
import { useMDXComponents as useCustomMDXComponents } from "./src/mdx-components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return useCustomMDXComponents(components);
}
