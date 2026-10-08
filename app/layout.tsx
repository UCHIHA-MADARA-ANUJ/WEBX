import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { FAQ, SITE } from "@/lib/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://verde-compendium.vercel.app"),
  title: {
    default: `${SITE.name} — ${SITE.edition}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.summary,
  applicationName: SITE.name,
  keywords: [
    "Project Verde",
    "vertical farming",
    "autonomous irrigation",
    "ESP32",
    "ESP8266",
    "Firebase Realtime Database",
    "TensorFlow Lite",
    "plant disease detection",
    "IoT",
    "smart agriculture",
    "Delhi",
  ],
  authors: [{ name: "Anuj Phulera" }, { name: "Aarav Choudhary" }],
  creator: "Anuj Phulera",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    title: `${SITE.name} — ${SITE.edition}`,
    description: SITE.summary,
    siteName: SITE.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.edition}`,
    description: SITE.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#030604",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/** Structured data so search engines read this as a technical project, not a landing page. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      headline: `${SITE.name} — ${SITE.edition}`,
      description: SITE.summary,
      inLanguage: "en-IN",
      datePublished: "2024-06-01",
      dateModified: new Date().toISOString().slice(0, 10),
      keywords: "autonomous irrigation, ESP32, Firebase, TensorFlow Lite, vertical farming",
      author: [
        { "@type": "Person", name: "Anuj Phulera", jobTitle: "Project lead · software architect" },
        { "@type": "Person", name: "Aarav Choudhary", jobTitle: "Hardware node · PCB design" },
      ],
      about: {
        "@type": "Project",
        name: SITE.name,
        description: SITE.summary,
        locationCreated: { "@type": "Place", name: SITE.location },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-calm="false" className={fontVariables} suppressHydrationWarning>
      <body className="bg-void text-bone antialiased">
        {children}
        <script
          type="application/ld+json"
          // Content is authored, not user-supplied — safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
