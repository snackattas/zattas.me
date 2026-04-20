declare module "*.mdx" {
  import type { ComponentProps } from "react";
  export default function MDXContent(props: ComponentProps<"div">): JSX.Element;
}
