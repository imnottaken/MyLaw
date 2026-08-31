import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import WhyMyLawSection from "@/components/landing/WhyMyLawSection";
import WhoItsForSection from "@/components/landing/WhoItsForSection";
import AboutSection from "@/components/landing/AboutSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <WhyMyLawSection />
        <WhoItsForSection />
        <AboutSection />
        <FinalCtaSection />
      </main>
    </div>
  );
}
