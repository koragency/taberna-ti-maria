import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/i18n";
import api from "@/api";
import { Reveal, Kicker } from "@/components/motion";
import { SardineIcon, azulejoTile } from "@/components/Sardine";
import { WHATSAPP_URL } from "@/components/Contact";

const CatHeader = ({ title, part }) => (
  <div>
    <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-terra">Taberna Ti Maria</p>
    <h3 className="mt-1.5 font-serif text-2xl leading-tight text-tinta">
      {title}
      {part ? <span className="text-terra"> · {part}</span> : null}
    </h3>
    <div className="mt-3 h-0.5 w-14 rounded-full bg-terra" />
  </div>
);

const ItemList = ({ items, lang }) => {
  const dense = items.length > 11;
  return (
    <ul className={dense ? "mt-3 space-y-1.5" : "mt-5 space-y-3"}>
      {items.map((item) => {
        const name = lang === "pt" ? item.name_pt : item.name_en;
        const desc = lang === "pt" ? item.description_pt : item.description_en;
        return (
          <li key={item.id} data-testid="menu-book-item">
            <div className={`flex items-baseline gap-2 ${dense ? "text-[12.5px]" : "text-sm"}`}>
              <span className={`flex items-center gap-1.5 ${item.highlight ? "font-bold text-terra" : "font-medium text-tinta"}`}>
                {item.highlight ? <SardineIcon className="w-4 shrink-0 self-center" eyeColor="#FDF8EC" /> : null}
                {name}
              </span>
              <span className="flex-1 -translate-y-1 border-b border-dotted border-tinta/20" />
              <span className="whitespace-nowrap font-mono text-xs font-semibold text-azul">{item.price}</span>
            </div>
            {desc ? <p className="mt-0.5 text-[11px] italic text-tinta/50">{desc}</p> : null}
          </li>
        );
      })}
    </ul>
  );
};

const BookPage = ({ n, label, children }) => (
  <div className="relative h-full w-full overflow-hidden" data-testid="menu-book-page">
    <div className="flex h-full flex-col px-6 pb-10 pt-6 sm:px-8">{children}</div>
    <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-6 sm:px-8">
      <SardineIcon className="w-6 text-terra/40" eyeColor="#FDF8EC" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-tinta/40">
        {label} {n}
      </span>
    </div>
  </div>
);

export default function MenuSection() {
  const { lang, t } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(0);

  useEffect(() => {
    api
      .get("/menu")
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const byCat = (c) => items.filter((i) => i.category === c && i.available !== false);
  const pratos = byCat("pratos");
  const pl = t.menu.pageLabel;

  const cover = (
    <div className="relative h-full w-full overflow-hidden" data-testid="menu-book-cover">
      <div className="absolute inset-0" style={azulejoTile("#FFFFFF", 0.1, 84)} aria-hidden="true" />
      <div className="relative flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
        <span className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 shadow-2xl ring-2 ring-amarelo/70 sm:h-36 sm:w-36">
          <img src="/assets/logo.png" alt="Taberna Ti Maria" className="h-full w-full rounded-full object-cover" />
        </span>
        <h3 className="font-serif text-5xl italic text-amarelo">{t.menu.coverTitle}</h3>
        <SardineIcon className="w-12 text-amarelo/80" eyeColor="#1C3A6B" />
        <p className="max-w-[240px] font-sans text-sm font-semibold text-white/90">{t.footer.slogan}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/60">Lagos · Desde 1954</p>
      </div>
    </div>
  );

  const back = (
    <div className="relative h-full w-full overflow-hidden" data-testid="menu-book-back">
      <div className="absolute inset-0" style={azulejoTile("#FFFFFF", 0.12, 84)} aria-hidden="true" />
      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
        <h3 className="font-serif text-4xl italic text-white">{t.menu.backTitle}</h3>
        <p className="text-sm text-white/85">{t.menu.backText}</p>
        <a
          href={WHATSAPP_URL(t.contact.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="book-back-whatsapp"
          className="mt-1 rounded-full bg-white px-6 py-3 font-mono text-xs font-bold tracking-widest text-tinta shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
        >
          +351 927 915 314
        </a>
        <SardineIcon className="mt-3 w-12 text-white/80" eyeColor="#D96B43" />
      </div>
    </div>
  );

  const pages = [
    { node: cover, face: "book-face-cover" },
    { node: <BookPage n={2} label={pl}><CatHeader title={t.menu.cats.cafes} /><ItemList items={byCat("cafes")} lang={lang} /></BookPage> },
    { node: <BookPage n={3} label={pl}><CatHeader title={t.menu.cats["pequeno-almoco"]} /><ItemList items={byCat("pequeno-almoco")} lang={lang} /></BookPage> },
    { node: <BookPage n={4} label={pl}><CatHeader title={t.menu.cats.pratos} part="I" /><ItemList items={pratos.slice(0, 10)} lang={lang} /></BookPage> },
    { node: <BookPage n={5} label={pl}><CatHeader title={t.menu.cats.pratos} part="II" /><ItemList items={pratos.slice(10)} lang={lang} /></BookPage> },
    { node: (
        <BookPage n={6} label={pl}>
          <CatHeader title={t.menu.cats.sobremesas} />
          <ItemList items={byCat("sobremesas")} lang={lang} />
          <div className="mt-7"><CatHeader title={t.menu.cats.gelados} /></div>
          <ItemList items={byCat("gelados")} lang={lang} />
        </BookPage>
      ) },
    { node: <BookPage n={7} label={pl}><CatHeader title={t.menu.cats.bebidas} /><ItemList items={byCat("bebidas")} lang={lang} /></BookPage> },
    { node: <BookPage n={8} label={pl}><CatHeader title={t.menu.cats.vinhos} /><ItemList items={byCat("vinhos")} lang={lang} /></BookPage> },
    { node: <BookPage n={9} label={pl}><CatHeader title={t.menu.cats.doses} /><ItemList items={byCat("doses")} lang={lang} /></BookPage> },
    { node: back, face: "book-face-cover-back" },
  ];

  const leaves = [];
  for (let i = 0; i < pages.length; i += 2) leaves.push([pages[i], pages[i + 1]]);
  const total = leaves.length;
  const flipNext = () => setFlipped((f) => Math.min(total, f + 1));
  const flipPrev = () => setFlipped((f) => Math.max(0, f - 1));

  return (
    <section id="ementa" data-testid="menu-section" className="relative overflow-hidden bg-papel px-5 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Kicker>{t.menu.kicker}</Kicker>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-tinta sm:text-4xl lg:text-5xl">
            {t.menu.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-tinta/70">{t.menu.sub}</p>
        </Reveal>

        {loading ? (
          <div className="mt-16 flex items-center justify-center gap-3 text-tinta/60" data-testid="menu-loading">
            <SardineIcon className="w-10 animate-pulse text-terra/60" />
            <span className="font-mono text-xs uppercase tracking-widest">...</span>
          </div>
        ) : items.length === 0 ? (
          <p className="mt-16 text-center font-serif text-lg italic text-tinta/60" data-testid="menu-empty">
            {t.menu.empty}
          </p>
        ) : (
          <div>
            <p className="mb-6 mt-12 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-tinta/50">
              {t.menu.bookHint}
            </p>
            <div className="relative mx-auto w-full max-w-[460px] md:max-w-[940px]" data-testid="menu-book">
              <div className="book h-[580px] sm:h-[640px] md:h-[660px]">
                <div className="absolute inset-0 overflow-hidden rounded-lg ring-1 ring-tinta/10 md:grid md:grid-cols-2" aria-hidden="true">
                  <div className="hidden items-center justify-center md:flex" style={azulejoTile("#D96B43", 0.14, 92)}>
                    <SardineIcon className="w-12 text-terra/50" />
                  </div>
                  <div className="hidden md:block" style={azulejoTile("#2B5FAB", 0.1, 92)} />
                  <div className="h-full md:hidden" style={azulejoTile("#D96B43", 0.12, 92)} />
                </div>

                {leaves.map(([front, backPage], i) => (
                  <div
                    key={i}
                    className={`book-leaf ${i < flipped ? "flipped" : ""}`}
                    style={{ zIndex: i < flipped ? i + 1 : total - i }}
                  >
                    <div className={`book-face book-face-front ${front.face || ""}`}>{front.node}</div>
                    <div className={`book-face book-face-back ${backPage.face || ""}`}>{backPage.node}</div>
                  </div>
                ))}

                <button
                  data-testid="book-zone-prev"
                  aria-label="Página anterior"
                  onClick={flipPrev}
                  className="absolute inset-y-0 left-0 z-20 w-[16%] cursor-pointer"
                  style={{ display: flipped === 0 ? "none" : "block" }}
                />
                <button
                  data-testid="book-zone-next"
                  aria-label="Página seguinte"
                  onClick={flipNext}
                  className="absolute inset-y-0 right-0 z-20 w-[16%] cursor-pointer"
                  style={{ display: flipped === total ? "none" : "block" }}
                />
              </div>

              <button
                data-testid="book-prev-button"
                aria-label="Página anterior"
                onClick={flipPrev}
                className="absolute top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-terra text-white shadow-lg shadow-terra/30 transition-colors duration-300 hover:bg-azul md:-left-6 md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                data-testid="book-next-button"
                aria-label="Página seguinte"
                onClick={flipNext}
                className="absolute top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-terra text-white shadow-lg shadow-terra/30 transition-colors duration-300 hover:bg-azul md:-right-6 md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
              <button
                data-testid="book-prev-button-mobile"
                aria-label="Página anterior"
                onClick={flipPrev}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-terra text-white shadow-lg shadow-terra/30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                data-testid="book-next-button-mobile"
                aria-label="Página seguinte"
                onClick={flipNext}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-terra text-white shadow-lg shadow-terra/30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2.5">
              <SardineIcon className="w-5 text-terra" eyeColor="#FDF8EC" />
              <p className="text-xs italic text-tinta/60">{t.menu.highlightLegend}</p>
            </div>
            <p className="mt-6 text-center font-mono text-xs italic tracking-wide text-tinta/50">{t.menu.note}</p>
          </div>
        )}
      </div>
    </section>
  );
}
