"use client";

import { LandingNavbar } from "./navbar";
import { LandingHero } from "./hero";
import { IntegrationsStrip } from "./integrations-strip";
import { Capabilities } from "./capabilities";
import { HowItWorks } from "./how-it-works";
import { FeaturePreview } from "./feature-preview";
import { RolesSection } from "./roles";
import { TrustByDesign } from "./trust-by-design";
import { FaqSection } from "./faq";
import { CtaBanner } from "./cta-banner";
import { LandingFooter } from "./footer";
import { Reveal } from "@/components/reveal";

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-white selection:bg-blue-500/20 selection:text-blue-600 font-sans">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />

        <Reveal>
          <IntegrationsStrip />
        </Reveal>

        <Reveal>
          <Capabilities />
        </Reveal>

        <Reveal>
          <HowItWorks />
        </Reveal>

        <Reveal>
          <FeaturePreview />
        </Reveal>

        <Reveal>
          <RolesSection />
        </Reveal>

        <Reveal>
          <TrustByDesign />
        </Reveal>

        <Reveal>
          <FaqSection />
        </Reveal>

        <Reveal>
          <CtaBanner />
        </Reveal>
      </main>
      <LandingFooter />
    </div>
  );
}

export default Landing;
export { LandingNavbar } from "./navbar";
export { LandingHero } from "./hero";
export { IntegrationsStrip } from "./integrations-strip";
export { Capabilities } from "./capabilities";
export { HowItWorks } from "./how-it-works";
export { FeaturePreview } from "./feature-preview";
export { RolesSection } from "./roles";
export { TrustByDesign } from "./trust-by-design";
export { FaqSection } from "./faq";
export { CtaBanner } from "./cta-banner";
export { LandingFooter } from "./footer";

