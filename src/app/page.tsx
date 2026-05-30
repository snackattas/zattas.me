import { sections } from "@/lib/sections";
import { Hero } from "@/components/Hero";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { ClientInteractions } from "@/components/ClientInteractions";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Zachary Attas",
  alternateName: "Zach Attas",
  url: "https://zattas.me",
  image: "https://zattas.me/images/headshot.png",
  jobTitle: "Staff Platform Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Capsule",
    url: "https://www.capsule.com/",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chicago",
    addressRegion: "IL",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.linkedin.com/in/zachary-attas",
    "https://github.com/snackattas",
    "https://medium.com/@zach.attas",
    "https://confengine.com/user/zachary-attas",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Zach Attas",
  url: "https://zattas.me",
  image: "https://zattas.me/og-image.png",
  author: {
    "@type": "Person",
    name: "Zachary Attas",
    url: "https://zattas.me",
  },
};

export default function Home() {
  const navSections = sections.map(({ indexLabel, navLabel, anchor }) => ({
    indexLabel,
    navLabel,
    anchor,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
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
