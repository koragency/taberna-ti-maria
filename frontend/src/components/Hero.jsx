import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, UtensilsCrossed } from "lucide-react";
import { useLang } from "@/i18n";
import { MaskedLine } from "@/components/motion";
import { FloatingSardines, azulejoTile } from "@/components/Sardine";
import { WHATSAPP_URL } from "@/components/Contact";

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
        <div className="h-[120%] w-full" style={azulejoTile("#2B5FAB", 0.07, 130)} />
        <div className="absolute inset-0 bg-gradient-to-b from-creme/30 via-transparent to-creme" />
      </motion.div>
      <FloatingSardines />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-14 font-mono text-xs uppercase tracking-[0.4em] text-azul sm:text-sm"
          data-testid="hero-kicker"
        >
          {t.hero.kicker}
        </motion.p>

        <motion.div style={{ y: logoY, scale: logoScale }} className="relative mb-12">
          <svg
            viewBox="0 0 200 200"
            className="animate-spin-slower absolute -inset-7 h-[calc(100%+3.5rem)] w-[calc(100%+3.5rem)] sm:-inset-10 sm:h-[calc(100%+5rem)] sm:w-[calc(100%+5rem)]"
            aria-hidden="true"
          >
            <defs>
              <path id="ti-maria-ring" d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" />
            </defs>
            <text fill="#D96B43" fillOpacity="0.75" style={{ fontSize: "9.2px", letterSpacing: "2.6px", fontFamily: "'JetBrains Mono', monospace" }}>
              <textPath href="#ti-maria-ring">
                PETISCOS · VINHOS · CERVEJA FRESCA · LAGOS · DESDE 1954 ·
              </textPath>
            </text>
          </svg>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-56 w-56 overflow-hidden rounded-full bg-white p-2 shadow-[0_24px_90px_-20px_rgba(217,107,67,0.5)] ring-2 ring-terra/40 sm:h-72 sm:w-72 lg:h-96 lg:w-96"
          >
            <img
              src="/assets/logo.png"
              alt="Taberna Ti Maria — logotipo"
              data-testid="brand-logo-large"
              className="h-full w-full rounded-full object-cover"
            />
          </motion.div>
        </motion.div>

        <h1 className="font-sans text-4xl font-extrabold leading-[1.08] tracking-tight text-tinta sm:text-6xl lg:text-7xl" data-testid="brand-slogan">
          <MaskedLine delay={0.55}>{t.hero.slogan1}</MaskedLine>
          <MaskedLine delay={0.75} className="text-terra">
            {t.hero.slogan2}
          </MaskedLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05 }}
          className="mt-8 max-w-xl text-base text-tinta/70 sm:text-lg"
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
            className="group flex items-center gap-2.5 rounded-full bg-terra px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-terra/30 transition-all duration-300 hover:bg-amarelo hover:text-tinta hover:shadow-xl hover:shadow-amarelo/40"
          >
            <UtensilsCrossed className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            {t.hero.ctaMenu}
          </button>
          <a
            data-testid="hero-call-button"
            href={WHATSAPP_URL(t.contact.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-full border-2 border-verde/50 bg-white/50 px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-verde transition-all duration-300 hover:border-verde hover:bg-verde hover:text-white"
          >
            <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12" />
            {t.hero.ctaBook}
          </a>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.35em] text-azul/50"
        aria-hidden="true"
      >
        ↓ {t.hero.scroll} ↓
      </motion.p>
    </section>
  );
}
