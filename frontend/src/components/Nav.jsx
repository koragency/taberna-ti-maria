import { useLang } from "@/i18n";
import { KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const links = [
    { id: "ementa", label: t.nav.menu },
    { id: "lenda", label: t.nav.legend },
    { id: "cozinheiro", label: t.nav.chef },
    { id: "reservas", label: t.nav.contact },
  ];

  return (
    <header
      data-testid="nav-header"
      className="fixed inset-x-0 top-0 z-40 border-b border-gold/10 bg-ink/75 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
          data-testid="nav-logo-button"
        >
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-cream shadow-lg shadow-black/40">
            <img src="/assets/logo.png" alt="Taberna Ti Maria" className="h-full w-full object-cover" />
          </span>
          <span className="hidden font-serif text-lg italic text-cream sm:block">Ti Maria</span>
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-sm text-sand transition-colors duration-300 hover:text-gold"
              data-testid={`nav-link-${l.id}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-gold/25 p-0.5" data-testid="language-toggle">
            {["pt", "en"].map((l) => (
              <button
                key={l}
                data-testid={`language-toggle-${l}`}
                onClick={() => setLang(l)}
                className={`rounded-full px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${
                  lang === l ? "bg-gold text-ink" : "text-sand hover:text-cream"
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
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 text-sand transition-colors duration-300 hover:border-gold/50 hover:text-gold"
          >
            <KeyRound className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
