import { useEffect, useState } from "react";
import { useLang } from "@/i18n";
import { KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const isOpenNow = () => {
  const lisbon = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Lisbon" }));
  const day = lisbon.getDay();
  if (day === 1) return false;
  const mins = lisbon.getHours() * 60 + lisbon.getMinutes();
  const close = day === 0 ? 17 * 60 : 21 * 60;
  return mins >= 9 * 60 && mins < close;
};

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setOpen(isOpenNow());
    const timer = setInterval(() => setOpen(isOpenNow()), 60000);
    return () => clearInterval(timer);
  }, []);

  const links = [
    { id: "ementa", label: t.nav.menu },
    { id: "lenda", label: t.nav.legend },
    { id: "cozinheiro", label: t.nav.chef },
    { id: "reservas", label: t.nav.contact },
  ];

  return (
    <header
      data-testid="nav-header"
      className="fixed inset-x-0 top-0 z-40 border-b border-azul/10 bg-creme/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
          data-testid="nav-logo-button"
        >
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-md shadow-terra/20 ring-1 ring-terra/20">
            <img src="/assets/logo.png" alt="Taberna Ti Maria" className="h-full w-full object-cover" />
          </span>
          <span className="hidden font-serif text-lg italic text-tinta sm:block">Ti Maria</span>
        </button>

        {open !== null && (
          <span
            data-testid="open-now-badge"
            className={`ml-2 hidden items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] sm:inline-flex ${
              open ? "border-verde/40 bg-verde/10 text-verde" : "border-vinho/30 bg-vinho/10 text-vinho"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verde opacity-60" />}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${open ? "bg-verde" : "bg-vinho"}`} />
            </span>
            {open ? t.nav.openNow : t.nav.closed}
          </span>
        )}

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-sm font-medium text-tinta/70 transition-colors duration-300 hover:text-terra"
              data-testid={`nav-link-${l.id}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-azul/25 bg-white/60 p-0.5" data-testid="language-toggle">
            {["pt", "en"].map((l) => (
              <button
                key={l}
                data-testid={`language-toggle-${l}`}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${
                  lang === l ? "bg-azul text-white" : "text-tinta/60 hover:text-tinta"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <Link
            to="/admin"
            data-testid="nav-admin-link"
            aria-label={t.nav.admin}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-azul/25 text-tinta/60 transition-colors duration-300 hover:border-terra hover:text-terra"
          >
            <KeyRound className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
