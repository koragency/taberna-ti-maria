import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import MenuSection from "@/components/MenuSection";
import Legend from "@/components/Legend";
import Chef from "@/components/Chef";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { AzulejoStrip, SwimmingSardine } from "@/components/Sardine";

export default function Landing() {
  return (
    <main data-testid="landing-page" className="bg-creme text-tinta">
      <Nav />
      <SwimmingSardine />
      <Hero />
      <Marquee />
      <MenuSection />
      <AzulejoStrip color="#D96B43" />
      <Legend />
      <Chef />
      <AzulejoStrip color="#2B5FAB" />
      <Contact />
      <Footer />
    </main>
  );
}
