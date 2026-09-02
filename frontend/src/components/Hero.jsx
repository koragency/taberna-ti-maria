import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, UtensilsCrossed } from "lucide-react";
import { useLang } from "@/i18n";
import { MaskedLine } from "@/components/motion";
import { FloatingSardines } from "@/components/Sardine";

const HERO_BG =
  "https://images.unsplash.com/photo-1662738221889-2344690f7dc1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHw0fHx3aW5lJTIwZ2xhc3MlMjBydXN0aWMlMjB0YXZlcm58ZW58MHx8fHwxNzg4MzM1NzcwfDA&ixlib=rb-4.1.0&q=85";

export default function Hero() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28">
      <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden="true">
        <img src={HERO_BG} alt="" className="h-[120%] w-full object-cover opacity-[0.13]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
      </motion.div>
      <FloatingSardines />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-14 font-mono text-xs uppercase tracking-[0.4em] text-sardine sm:text-sm"
          data-testid="hero-kicker"
        >
          {t.hero.kicker}
        </motion.p>

        <motion.div style={{ y: logoY, scale: logoScale }} className="relative mb-12">
          <svg viewBox="0 0 200 200" className="animate-spin-slower absolute -inset-7 sm:-inset-10" aria-hidden="true">
            <defs>
              <path id="ti-maria-ring" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
            </defs>
            <text fill="#E6BE8A" fillOpacity="0.55" style={{ fontSize: "9.2px", letterSpacing: "2.6px", fontFamily: "'JetBrains Mono', monospace" }}>
              <textPath href="#ti-maria-ring">
                PETISCOS · VINHOS DO ALGARVE · CERVEJA FRESCA · LAGOS · DESDE 1954 ·
              </textPath>
            </text>
          </svg>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-56 w-56 overflow-hidden rounded-full bg-cream p-2 shadow-[0_0_120px_-20px_rgba(230,190,138,0.45)] ring-1 ring-gold/40 sm:h-72 sm:w-72 lg:h-96 lg:w-96"
          >
            <img
              src="/assets/logo.png"
              alt="Taberna Ti Maria — logotipo"
              data-testid="brand-logo-large"
              className="h-full w-full rounded-full object-cover"
            />
          </motion.div>
        </motion.div>

        <h1 className="font-serif text-4xl italic leading-[1.05] text-cream sm:text-6xl lg:text-7xl" data-testid="brand-slogan">
          <MaskedLine delay={0.55}>{t.hero.slogan1}</MaskedLine>
          <MaskedLine delay={0.75} className="text-gold">
            {t.hero.slogan2}
          </MaskedLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05 }}
          className="mt-8 max-w-xl text-base text-sand sm:text-lg"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.25 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            data-testid="hero-menu-button"
            onClick={() => document.getElementById("ementa")?.scrollIntoView({ behavior: "smooth" })}
            className="group flex items-center gap-2.5 rounded-full bg-terra px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-cream transition-all duration-300 hover:bg-gold hover:text-ink hover:shadow-[0_0_40px_-8px_rgba(230,190,138,0.6)]"
          >
            <UtensilsCrossed className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            {t.hero.ctaMenu}
          </button>
          <a
            data-testid="hero-call-button"
            href="tel:+351282123456"
            className="group flex items-center gap-2.5 rounded-full border border-gold/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-gold transition-all duration-300 hover:border-gold hover:bg-gold/10"
          >
            <Phone className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
            {t.hero.ctaBook}
          </a>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.35em] text-sand/50"
        aria-hidden="true"
      >
        ↓ {t.hero.scroll} ↓
      </motion.p>
    </section>
  );
}
