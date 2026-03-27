import CTA from "@/src/modules/home/CTA";
import FAQ from "@/src/modules/home/FAQ";
import Helpline from "@/src/modules/home/Helpline";
import Hero from "@/src/modules/home/Hero";
import HowItWorks from "@/src/modules/home/HowItWorks";
import Impact from "@/src/modules/home/Impact";
import PlatformScope from "@/src/modules/home/PlatformScope";
import SafetyCommitment from "@/src/modules/home/SafetyCommitment";
import Stories from "@/src/modules/home/Stories";
import TrustBar from "@/src/modules/home/TrustBar";

export const metadata = {
  title: 'Nirapod Kontho | Safe Reporting Platform',
  description:
    'Report harassment, violence and corruption safely and anonymously in Bangladesh.',
};

export default function HomePage() {
  return (
    <main className="bg-neutral text-gray-800">
      <Hero />
      <TrustBar />
      <PlatformScope />
      <HowItWorks />
      <SafetyCommitment />
      <Impact />
      <Stories />
      <FAQ />
      <Helpline />
      <CTA />
    </main>
  );
}