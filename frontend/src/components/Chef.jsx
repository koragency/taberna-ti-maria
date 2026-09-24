import { useLang } from "@/i18n";
import { Reveal, Kicker } from "@/components/motion";
import { SardineDivider } from "@/components/Sardine";

export default function Chef() {
  const { t } = useLang();
  return (
    <section id="cozinheiro" data-testid="kitchen-video-section" className="bg-[#FBEBC0] px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <Kicker>{t.kitchen.kicker}</Kicker>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-tinta sm:text-4xl lg:text-5xl">
            {t.kitchen.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-tinta/70">{t.kitchen.sub}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mx-auto mt-12 max-w-4xl">
            <div className="absolute -inset-6 -z-0 rounded-[2rem] bg-rosa/20 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-terra/30 ring-4 ring-white">
              <video
                data-testid="kitchen-video"
                poster="/assets/cozinha-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-video w-full object-cover"
              >
                <source src="/assets/cozinha.webm" type="video/webm" />
                <source src="/assets/cozinha.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <SardineDivider className="mt-10" />
          <p className="mt-4 font-serif text-lg italic text-tinta/70">{t.kitchen.caption}</p>
        </Reveal>
      </div>
    </section>
  );
}
