import CTA from "@/src/modules/home/CTA";
import Helpline from "@/src/modules/home/Helpline";
import Hero from "@/src/modules/home/Hero";
import HowItWorks from "@/src/modules/home/HowItWorks";
import Impact from "@/src/modules/home/Impact";

export const metadata = {
  title: 'Nirapod Kontho | Safe Reporting Platform',
  description:
    'Report harassment, violence and corruption safely and anonymously in Bangladesh.',
};

export default function HomePage() {
  return (
    <main className="bg-neutral text-gray-800">
      <Hero />
      <HowItWorks />
      <Impact />
      <Helpline />
      <CTA />
    </main>
  );
}