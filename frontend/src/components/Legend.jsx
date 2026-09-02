import { useLang } from "@/i18n";
import { Reveal, Kicker } from "@/components/motion";
import { SardineDivider, SardineIcon, azulejoTile } from "@/components/Sardine";

export default function Legend() {
  const { t } = useLang();
  return (
    <section id="lenda" data-testid="maria-de-lagos-section" className="relative overflow-hidden bg-azuldeep py-28 sm:py-36">
      <div className="absolute inset-0" style={azulejoTile("#FFFFFF", 0.09, 110)} aria-hidden="true" />
      <SardineIcon className="pointer-events-none absolute -right-16 top-16 w-72 rotate-12 text-amarelo/10" eyeColor="#1C3A6B" aria-hidden="true" />
      <SardineIcon className="pointer-events-none absolute -left-20 bottom-10 w-80 -rotate-6 -scale-x-100 text-white/5" eyeColor="#1C3A6B" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <Kicker className="text-amarelo">{t.legend.kicker}</Kicker>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t.legend.title}
          </h2>
          <SardineDivider className="mt-8 text-amarelo" />
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
                  className="shrink-0 font-serif text-8xl italic leading-none text-amarelo/40 sm:text-9xl md:w-44 md:text-right"
                >
                  {ch.n}
                </span>
                <div className="max-w-xl rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
                  <h3 className="font-serif text-xl italic text-amarelo sm:text-2xl">{ch.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-white/85">{ch.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
