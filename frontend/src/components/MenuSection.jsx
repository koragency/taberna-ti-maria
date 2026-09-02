import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/i18n";
import api from "@/api";
import { Reveal, Kicker } from "@/components/motion";
import { SardineDivider, SardineIcon } from "@/components/Sardine";

const TABS = ["petiscos", "vinhos", "cervejas"];

const SARDINES_IMG =
  "https://images.unsplash.com/photo-1534121222821-9e2e2936f059?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHw0fHxncmlsbGVkJTIwc2FyZGluZXN8ZW58MHx8fHwxNzg4MzM1NzY5fDA&ixlib=rb-4.1.0&q=85";

export default function MenuSection() {
  const { lang, t } = useLang();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("petiscos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/menu")
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((i) => i.category === tab && i.available !== false);

  return (
    <section id="ementa" data-testid="menu-section" className="relative mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="grid gap-14 lg:grid-cols-[1fr_360px]">
        <div>
          <Reveal>
            <Kicker>{t.menu.kicker}</Kicker>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-cream sm:text-4xl lg:text-5xl">
              {t.menu.title}
            </h2>
            <p className="mt-5 max-w-xl text-base text-sand">{t.menu.sub}</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <div className="inline-flex flex-wrap gap-2 rounded-full border border-gold/15 bg-coal/70 p-1.5">
              {TABS.map((key) => (
                <button
                  key={key}
                  data-testid={`menu-tab-${key}`}
                  onClick={() => setTab(key)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                    tab === key ? "bg-gold text-ink" : "text-sand hover:text-cream"
                  }`}
                >
                  {t.menu.tabs[key]}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 min-h-[300px]">
            {loading ? (
              <div className="flex items-center gap-3 text-sand" data-testid="menu-loading">
                <SardineIcon className="w-10 animate-pulse text-gold/50" />
                <span className="font-mono text-xs uppercase tracking-widest">...</span>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.ul
                  key={tab}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-7"
                >
                  {filtered.length === 0 && (
                    <li className="font-serif text-lg italic text-sand" data-testid="menu-empty">
                      {t.menu.empty}
                    </li>
                  )}
                  {filtered.map((item, i) => (
                    <motion.li
                      key={item.id}
                      data-testid="menu-item-card"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="group"
                    >
                      <div className="flex items-baseline gap-3">
                        <h3 className="font-serif text-xl text-cream transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                          {lang === "pt" ? item.name_pt : item.name_en}
                        </h3>
                        <span className="flex-1 -translate-y-1 border-b border-dotted border-gold/25" />
                        <span className="whitespace-nowrap font-mono text-sm font-medium text-gold sm:text-base">
                          {item.price}
                        </span>
                      </div>
                      <p className="mt-1.5 max-w-xl text-sm text-sand">
                        {lang === "pt" ? item.description_pt : item.description_en}
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>

          <p className="mt-12 font-mono text-xs italic tracking-wide text-sand/70">{t.menu.note}</p>
        </div>

        <Reveal delay={0.2} className="hidden lg:block">
          <div className="sticky top-28">
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-gold/20">
              <img src={SARDINES_IMG} alt="Sardinhas assadas" className="h-[480px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-serif text-lg italic text-cream">“Na brasa, com sal grosso e graça.”</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">— Sr. Ângelo</p>
              </div>
            </div>
            <SardineDivider className="mt-8" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
