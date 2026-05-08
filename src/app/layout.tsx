import type { Metadata } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Zach Attas - Staff Platform Engineer",
  description:
    "Staff Platform Engineer at Capsule building core infrastructure, internal tooling, and sustainable test systems. SDET background, self-taught engineer from Chicago.",
  icons: {
    icon: "/icons/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  metadataBase: new URL("https://zattas.me"),
  openGraph: {
    title: "Zach Attas - Staff Platform Engineer",
    description:
      "Building core infrastructure, internal tooling, and sustainable test systems at Capsule",
    url: "https://zattas.me",
    type: "website",
    siteName: "Zach Attas",
    images: [
      {
        url: "https://zattas.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zach Attas - Staff Platform Engineer",
        type: "image/png",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zach Attas - Staff Platform Engineer",
    description:
      "Building core infrastructure, internal tooling, and sustainable test systems at Capsule",
    images: ["https://zattas.me/og-image.png"],
    creator: "@snackattas",
  },
  keywords: [
    "Platform Engineer",
    "SDET",
    "Test Infrastructure",
    "Quality Engineering",
    "Chicago",
    "Developer Experience",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${spaceMono.variable} antialiased`}>
        {/* Custom cursor elements — animated via globals.css + cursor JS */}
        <div id="cursor-dot" aria-hidden="true" />
        <div id="cursor-ring" aria-hidden="true" />
        {/* Konami easter egg toast */}
        <div id="konami-toast" aria-hidden="true">
          🦎 LIZARD MODE ACTIVATED
          <br />
          <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>
            You found the secret. RIP LizardApp (2016–2016)
          </span>
        </div>
        {children}
      </body>
    </html>
  );
}
