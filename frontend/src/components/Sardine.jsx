export const SardineIcon = ({ className = "", eyeColor = "#0F0D0C" }) => (
  <svg viewBox="0 0 120 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M8 24 C 24 8, 62 4, 86 16 L 112 5 C 108 16, 108 32, 112 43 L 86 32 C 62 44, 24 40, 8 24 Z"
      fill="currentColor"
    />
    <circle cx="20" cy="21" r="3" fill={eyeColor} />
    <path d="M34 15 C 30 21, 30 27, 34 33" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const SardineDivider = ({ className = "" }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
    <span className="h-px w-16 bg-gold/30" />
    <SardineIcon className="w-10 h-4 text-gold/70" />
    <span className="h-px w-16 bg-gold/30" />
  </div>
);

export const FloatingSardines = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <SardineIcon className="animate-float-slow absolute left-[6%] top-[18%] w-20 text-sardine/25" />
    <SardineIcon className="animate-float-slow absolute right-[8%] top-[30%] w-28 -scale-x-100 text-gold/20" eyeColor="#0F0D0C" />
    <SardineIcon className="animate-float-slow absolute left-[14%] bottom-[14%] w-14 text-terra/25" />
    <SardineIcon className="animate-float-slow absolute right-[16%] bottom-[24%] w-16 -scale-x-100 text-sardine/20" />
  </div>
);
