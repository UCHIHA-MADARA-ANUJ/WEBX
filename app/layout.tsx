import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { SITE } from "@/lib/content/site";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-calm="false" className={fontVariables} suppressHydrationWarning>
      <body className="bg-void text-bone antialiased">{children}</body>
    </html>
  );
}
