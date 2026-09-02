import { useLang } from "@/i18n";
import { Reveal, Kicker } from "@/components/motion";
import { SardineDivider, SardineIcon } from "@/components/Sardine";

export default function Legend() {
  const { t } = useLang();
  return (
    <section id="lenda" data-testid="maria-de-lagos-section" className="relative overflow-hidden border-y border-gold/10 bg-coal/40 py-28 sm:py-36">
      <SardineIcon className="pointer-events-none absolute -right-16 top-16 w-72 rotate-12 text-gold/[0.05]" aria-hidden="true" />
      <SardineIcon className="pointer-events-none absolute -left-20 bottom-10 w-80 -rotate-6 -scale-x-100 text-sardine/[0.05]" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <Kicker>{t.legend.kicker}</Kicker>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl tracking-tight text-cream sm:text-4xl lg:text-5xl">
            {t.legend.title}
          </h2>
          <SardineDivider className="mt-8" />
        </Reveal>

        <div className="mt-20 space-y-20">
          {t.legend.chapters.map((ch, i) => (
            <Reveal key={ch.n} delay={0.08 * i}>
              <article
                data-testid={`legend-chapter-${i + 1}`}
                className={`flex flex-col gap-6 md:items-start md:gap-12 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 font-serif text-8xl italic leading-none text-terra/25 sm:text-9xl md:w-44 md:text-right"
                >
                  {ch.n}
                </span>
                <div className="max-w-xl">
                  <h3 className="font-serif text-xl italic text-gold sm:text-2xl">{ch.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-sand">{ch.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
