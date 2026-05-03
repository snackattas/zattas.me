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
  title: "Zach Attas",
  description:
    "Staff Platform Engineer specializing in test infrastructure, quality engineering, and developer experience",
  icons: { icon: "/icons/favicon.png" },
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
