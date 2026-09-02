import { Clock, MapPin, Phone } from "lucide-react";
import { useLang } from "@/i18n";
import { Reveal, Kicker } from "@/components/motion";
import { SardineDivider } from "@/components/Sardine";

export default function Contact() {
  const { t } = useLang();
  return (
    <section id="reservas" data-testid="contact-reservation-section" className="relative overflow-hidden border-t border-gold/10 bg-coal/40 py-28 sm:py-36">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <Kicker>{t.contact.kicker}</Kicker>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-cream sm:text-4xl lg:text-5xl">
            {t.contact.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-sand">{t.contact.text}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <a
            data-testid="phone-reservation-button"
            href="tel:+351282123456"
            aria-label={t.contact.phoneLabel}
            className="group mt-10 inline-flex items-center gap-4 rounded-full border border-gold/25 bg-ink/60 px-8 py-5 transition-all duration-300 hover:border-gold hover:shadow-[0_0_50px_-12px_rgba(230,190,138,0.5)]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terra text-cream transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
              <Phone className="h-5 w-5" />
            </span>
            <span className="text-left">
              <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-sand">{t.contact.phoneLabel}</span>
              <span className="block font-serif text-2xl text-cream sm:text-3xl">+351 282 123 456</span>
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.2}>
          <SardineDivider className="mt-14" />
          <div className="mt-10 grid gap-8 text-left sm:grid-cols-2">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-terra" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sand">{t.contact.addressLabel}</p>
                <p className="mt-2 text-base text-cream">{t.contact.address}</p>
                <a
                  data-testid="maps-link"
                  href="https://maps.google.com/?q=Lagos,Algarve,Portugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-gold underline-offset-4 transition-colors hover:text-cream hover:underline"
                >
                  {t.contact.maps} →
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-terra" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sand">{t.contact.hoursLabel}</p>
                <p className="mt-2 text-base text-cream">{t.contact.hours}</p>
                <p className="mt-2 text-sm italic text-sand">{t.contact.hoursNote}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
