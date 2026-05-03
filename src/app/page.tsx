import { sections } from "@/lib/sections";
import { Hero } from "@/components/Hero";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { ClientInteractions } from "@/components/ClientInteractions";

export default function Home() {
  const navSections = sections.map(({ indexLabel, navLabel, anchor }) => ({
    indexLabel,
    navLabel,
    anchor,
  }));

  return (
    <>
      {/* Sticky nav */}
      <Nav sections={navSections} />

      {/* Full-viewport hero */}
      <Hero />

      {/* Scrolling skills strip */}
      <SkillsMarquee />

      {/* Content sections */}
      <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {sections.map(({ anchor, indexLabel, Content }) => (
          <Section key={anchor} anchor={anchor} indexLabel={indexLabel}>
            <Content />
          </Section>
        ))}
      </main>

      <Footer />

      {/* All client-side interactions: cursor, tilt, scroll reveal, Konami */}
      <ClientInteractions />
    </>
  );
}
