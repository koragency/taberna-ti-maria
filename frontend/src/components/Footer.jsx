import { useLang } from "@/i18n";
import { SardineIcon } from "@/components/Sardine";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer data-testid="site-footer" className="border-t border-gold/10 bg-ink py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center sm:px-8">
        <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-cream ring-1 ring-gold/30">
          <img src="/assets/logo.png" alt="Taberna Ti Maria" className="h-full w-full object-cover" />
        </span>
        <p className="font-serif text-xl italic text-gold sm:text-2xl">{t.footer.slogan}</p>
        <div className="flex items-center gap-3 text-sand/60">
          <SardineIcon className="w-6" />
          <p className="font-mono text-xs uppercase tracking-[0.25em]">
            © 2026 {t.footer.rights}
          </p>
          <SardineIcon className="w-6 -scale-x-100" />
        </div>
        <p className="text-xs italic text-sand/50">{t.footer.made}</p>
      </div>
    </footer>
  );
}
