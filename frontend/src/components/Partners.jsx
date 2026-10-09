import { useLang } from "@/i18n";
import { Reveal, Kicker } from "@/components/motion";
import { SardineDivider } from "@/components/Sardine";

const PARTNERS = [
  { src: "/assets/parceria1.png", alt: "Instituto do Emprego e Formação Profissional" },
  { src: "/assets/parceria2.png", alt: "AMADRI" },
];

export default function Partners() {
  const { t } = useLang();
  return (
    <section id="parcerias" data-testid="partners-section" className="bg-papel px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Kicker>{t.partners.kicker}</Kicker>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-tinta sm:text-4xl">
            {t.partners.title}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-tinta/70">{t.partners.sub}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {PARTNERS.map((p) => (
              <div
                key={p.src}
                data-testid="partner-logo-card"
                className="flex h-32 w-64 items-center justify-center rounded-2xl border border-tinta/10 bg-white px-6 py-4 shadow-md shadow-tinta/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-72"
              >
                <img src={p.src} alt={p.alt} loading="lazy" className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
          <SardineDivider className="mt-14" />
        </Reveal>
      </div>
    </section>
  );
}
