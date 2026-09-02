import { Clock, MapPin, Phone } from "lucide-react";
import { useLang } from "@/i18n";
import { Reveal, Kicker } from "@/components/motion";
import { SardineDivider } from "@/components/Sardine";

export default function Contact() {
  const { t } = useLang();
  return (
    <section id="reservas" data-testid="contact-reservation-section" className="relative overflow-hidden bg-rosa py-28 sm:py-36">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-amarelo/30 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <Kicker className="text-white">{t.contact.kicker}</Kicker>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t.contact.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/85">{t.contact.text}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <a
            data-testid="phone-reservation-button"
            href="tel:+351282123456"
            aria-label={t.contact.phoneLabel}
            className="group mt-10 inline-flex items-center gap-4 rounded-full bg-white px-8 py-5 shadow-xl shadow-tinta/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-tinta/30"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terra text-white transition-colors duration-300 group-hover:bg-azul">
              <Phone className="h-5 w-5" />
            </span>
            <span className="text-left">
              <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-terra">{t.contact.phoneLabel}</span>
              <span className="block font-serif text-2xl text-tinta sm:text-3xl">+351 282 123 456</span>
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.2}>
          <SardineDivider className="mt-14 text-white" />
          <div className="mt-10 grid gap-8 text-left sm:grid-cols-2">
            <div className="flex gap-4 rounded-2xl bg-white/15 p-6 ring-1 ring-white/25 backdrop-blur-sm">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-amarelo" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">{t.contact.addressLabel}</p>
                <p className="mt-2 text-base font-medium text-white">{t.contact.address}</p>
                <a
                  data-testid="maps-link"
                  href="https://maps.google.com/?q=Lagos,Algarve,Portugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-amarelo"
                >
                  {t.contact.maps} →
                </a>
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl bg-white/15 p-6 ring-1 ring-white/25 backdrop-blur-sm">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-amarelo" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">{t.contact.hoursLabel}</p>
                <p className="mt-2 text-base font-medium text-white">{t.contact.hours}</p>
                <p className="mt-2 text-sm italic text-white/75">{t.contact.hoursNote}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
