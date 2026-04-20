import type { ReactNode } from "react";

export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 px-6 py-12">
      <div className="prose prose-zinc max-w-none dark:prose-invert [&_h1]:text-5xl sm:[&_h1]:text-6xl [&_h2]:text-4xl sm:[&_h2]:text-5xl [&_h3]:text-3xl sm:[&_h3]:text-4xl">
        {children}
      </div>
    </section>
  );
}
