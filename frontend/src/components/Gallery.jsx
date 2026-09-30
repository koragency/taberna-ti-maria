import { useLang } from "@/i18n";
import { Reveal, Kicker } from "@/components/motion";
import { SardineIcon } from "@/components/Sardine";

const PHOTOS = [
  { src: "/assets/g5.jpg", caption: 4, rot: "-rotate-2" },
  { src: "/assets/g2.jpg", caption: 1, rot: "rotate-2" },
  { src: "/assets/g3.jpg", caption: 2, rot: "-rotate-1" },
  { src: "/assets/g4.jpg", caption: 3, rot: "rotate-1" },
  { src: "/assets/g1.jpg", caption: 0, rot: "-rotate-2" },
];

export default function Gallery() {
  const { t } = useLang();
  return (
    <section id="galeria" data-testid="gallery-section" className="relative overflow-hidden bg-menta px-5 py-28 sm:px-8 sm:py-32">
      <SardineIcon className="pointer-events-none absolute -left-14 top-14 w-64 rotate-6 text-white/10" eyeColor="#7FC8B4" aria-hidden="true" />
      <SardineIcon className="pointer-events-none absolute -right-16 bottom-16 w-72 -rotate-6 -scale-x-100 text-white/10" eyeColor="#7FC8B4" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Kicker className="text-white">{t.gallery.kicker}</Kicker>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t.gallery.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/85">{t.gallery.sub}</p>
        </Reveal>

        <div className="mt-16 flex flex-wrap items-start justify-center gap-7 sm:gap-8">
          {PHOTOS.map((photo, i) => (
            <Reveal key={photo.src} delay={0.08 * i}>
              <figure
                data-testid="gallery-photo"
                className={`group relative w-60 bg-white p-3 pb-4 shadow-xl shadow-tinta/20 transition-all duration-500 hover:z-10 hover:rotate-0 hover:scale-105 hover:shadow-2xl sm:w-64 ${photo.rot}`}
              >
                <span
                  className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 bg-amarelo/70 shadow-sm"
                  aria-hidden="true"
                />
                <img
                  src={photo.src}
                  alt={t.gallery.captions[photo.caption]}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
                <figcaption className="pt-3 text-center font-serif text-base italic text-tinta/80">
                  {t.gallery.captions[photo.caption]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
