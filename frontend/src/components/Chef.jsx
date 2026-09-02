import { useLang } from "@/i18n";
import { Reveal, Kicker } from "@/components/motion";

const CHEF_IMG =
  "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzg4MzM1NzY5fDA&ixlib=rb-4.1.0&q=85";

export default function Chef() {
  const { t } = useLang();
  const statColors = ["text-terra", "text-azul", "text-rosa"];
  return (
    <section id="cozinheiro" data-testid="chef-angelo-section" className="bg-[#FBEBC0] px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="absolute left-1/2 top-1/2 -z-0 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rosa/20 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-t-[999px] shadow-2xl shadow-terra/30 ring-4 ring-white">
            <img src={CHEF_IMG} alt="Sr. Ângelo na cozinha" className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Kicker>{t.chef.kicker}</Kicker>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-tinta sm:text-4xl lg:text-5xl">
              {t.chef.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <div className="grid grid-cols-3 gap-4">
              {t.chef.stats.map((s, i) => (
                <div key={s.label} className="rounded-2xl border border-tinta/10 bg-white px-4 py-5 text-center shadow-md shadow-tinta/5">
                  <p className={`font-serif text-4xl sm:text-5xl ${statColors[i % statColors.length]}`}>{s.value}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-widest text-tinta/60">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-8 text-base leading-relaxed text-tinta/75">{t.chef.text1}</p>
            <p className="mt-4 text-base leading-relaxed text-tinta/75">{t.chef.text2}</p>
            <blockquote className="mt-8 border-l-4 border-terra pl-5 font-serif text-lg italic text-tinta sm:text-xl">
              {t.chef.quote}
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
