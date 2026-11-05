import type { Metadata, Viewport } from "next";
import { Anton, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { Preloader } from "@/components/Preloader";
import { site } from "@/content/site";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const plexMono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Zain Ali · Full Stack Developer & UI/UX Designer", template: "%s · Zain Ali" },
  description:
    "Zain Ali designs and builds websites and web apps in Lahore: restaurant and café sites with real menus and ordering, booking platforms, CRMs and dashboards.",
  openGraph: {
    title: "Zain Ali · Full Stack Developer & UI/UX Designer",
    description: "Websites and web apps, designed and built end to end.",
    type: "website",
    images: [{ url: "/work/four/d-0.jpg", width: 1440, height: 900 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f2ef",
  width: "device-width",
  initialScale: 1,
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Zain Ali",
  jobTitle: "Full Stack Developer and UI/UX Designer",
  address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
  email: `mailto:${site.email}`,
  url: site.url,
  alumniOf: site.education.school,
  sameAs: site.socials.map((s) => s.href),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable} ${plexMono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10001] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Cursor />
          <Nav />
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
