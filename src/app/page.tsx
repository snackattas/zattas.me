import { CollapsingHeader } from "@/components/CollapsingHeader";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { sections } from "@/lib/sections";

export default function Home() {
  const navSections = sections.map(({ indexLabel, navLabel, anchor }) => ({
    indexLabel,
    navLabel,
    anchor,
  }));

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-black dark:text-zinc-50">
      <CollapsingHeader sections={navSections} />
      <main className="mx-auto w-full max-w-3xl py-10">
        {sections.map((s) => (
          <Section key={s.anchor} id={s.anchor}>
            <s.Content />
          </Section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
