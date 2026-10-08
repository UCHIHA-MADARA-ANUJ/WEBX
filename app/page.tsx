"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { PodProvider } from "@/components/providers/PodProvider";
import { ScrollProvider } from "@/components/providers/ScrollProvider";
import { Backdrop } from "@/components/chrome/Backdrop";
import { BootOverlay } from "@/components/chrome/BootOverlay";
import { NavBar } from "@/components/chrome/NavBar";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { SectionRail } from "@/components/chrome/SectionRail";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { CommandPalette } from "@/components/chrome/CommandPalette";
import { Footer } from "@/components/chrome/Footer";
import { Hero } from "@/components/sections/Hero";

/** Below-the-fold sections are code-split but still server-rendered for SEO. */
const Manifesto = dynamic(() => import("@/components/sections/Manifesto").then((m) => m.Manifesto));
const SystemSection = dynamic(() => import("@/components/sections/SystemSection").then((m) => m.SystemSection));
const TelemetrySection = dynamic(() => import("@/components/sections/TelemetrySection").then((m) => m.TelemetrySection));
const HardwareSection = dynamic(() => import("@/components/sections/HardwareSection").then((m) => m.HardwareSection));
const FirmwareSection = dynamic(() => import("@/components/sections/FirmwareSection").then((m) => m.FirmwareSection));
const SpecimensSection = dynamic(() => import("@/components/sections/SpecimensSection").then((m) => m.SpecimensSection));
const JourneySection = dynamic(() => import("@/components/sections/JourneySection").then((m) => m.JourneySection));
const ImpactSection = dynamic(() => import("@/components/sections/ImpactSection").then((m) => m.ImpactSection));
const BuildLogSection = dynamic(() => import("@/components/sections/BuildLogSection").then((m) => m.BuildLogSection));
const RecognitionSection = dynamic(() =>
  import("@/components/sections/RecognitionSection").then((m) => m.RecognitionSection),
);
const TeamSection = dynamic(() => import("@/components/sections/TeamSection").then((m) => m.TeamSection));
const FaqSection = dynamic(() => import("@/components/sections/FaqSection").then((m) => m.FaqSection));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then((m) => m.ContactSection));

function Shell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [egg, setEgg] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // a small nod for anyone who types the project name
  useEffect(() => {
    let buffer = "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key.length !== 1) return;
      buffer = `${buffer}${event.key.toLowerCase()}`.slice(-5);
      if (buffer === "verde") {
        setEgg(true);
        window.setTimeout(() => setEgg(false), 2600);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-md focus:border focus:border-chloro/50 focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.16em] focus:text-chloro"
      >
        skip to content
      </a>

      <Backdrop />
      <BootOverlay />
      <NavBar onOpenPalette={() => setPaletteOpen(true)} />
      <ScrollProgress />
      <SectionRail />
      <CustomCursor />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <main id="main-content" className="relative z-10">
        <Hero />
        <Manifesto />
        <SystemSection />
        <TelemetrySection />
        <HardwareSection />
        <FirmwareSection />
        <SpecimensSection />
        <JourneySection />
        <ImpactSection />
        <BuildLogSection />
        <RecognitionSection />
        <TeamSection />
        <FaqSection />
        <ContactSection />
      </main>

      <Footer />

      {egg ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-chloro/40 bg-void/90 px-5 py-2.5 backdrop-blur"
        >
          <span className="label-signal">chlorophyll detected · regrowth protocol armed 🌿</span>
        </div>
      ) : null}
    </>
  );
}

export default function Home() {
  return (
    <SettingsProvider>
      <PodProvider>
        <ScrollProvider>
          <Shell />
        </ScrollProvider>
      </PodProvider>
    </SettingsProvider>
  );
}
