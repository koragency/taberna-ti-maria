import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import MenuSection from "@/components/MenuSection";
import Legend from "@/components/Legend";
import Chef from "@/components/Chef";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <main data-testid="landing-page" className="bg-ink text-cream">
      <Nav />
      <Hero />
      <Marquee />
      <MenuSection />
      <Legend />
      <Chef />
      <Contact />
      <Footer />
    </main>
  );
}
