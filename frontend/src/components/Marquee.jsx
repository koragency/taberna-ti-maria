import { useLang } from "@/i18n";
import { SardineIcon } from "@/components/Sardine";

export default function Marquee() {
  const { t } = useLang();
  const items = [...t.marquee, ...t.marquee, ...t.marquee];
  return (
    <div className="relative overflow-hidden border-y-2 border-tinta/10 bg-terra py-5" data-testid="editorial-marquee" aria-hidden="true">
      <div className="animate-marquee-x flex w-max items-center gap-10">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="whitespace-nowrap font-serif text-xl italic text-white sm:text-2xl">{item}</span>
            <SardineIcon className="w-9 text-amarelo" eyeColor="#D96B43" />
          </span>
        ))}
      </div>
    </div>
  );
}
