import { motion, useScroll, useTransform } from "framer-motion";

export const SardineIcon = ({ className = "", eyeColor = "#FAF2DF" }) => (
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
  <div className={`flex items-center justify-center gap-4 text-terra ${className}`} aria-hidden="true">
    <span className="h-px w-16 bg-current opacity-60" />
    <SardineIcon className="w-10 h-4" />
    <span className="h-px w-16 bg-current opacity-60" />
  </div>
);

const TILE_SVG = (color, opacity) =>
  `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><g fill='none' stroke='${color}' stroke-opacity='${opacity}' stroke-width='2'><rect x='1.5' y='1.5' width='93' height='93'/><circle cx='48' cy='48' r='13'/><path d='M48 18 C 60 34, 60 62, 48 78 C 36 62, 36 34, 48 18 Z'/><path d='M18 48 C 34 36, 62 36, 78 48 C 62 60, 34 60, 18 48 Z'/><circle cx='0' cy='0' r='16'/><circle cx='96' cy='0' r='16'/><circle cx='0' cy='96' r='16'/><circle cx='96' cy='96' r='16'/></g></svg>`;

export const azulejoTile = (color, opacity = 0.5, size = 96) => ({
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(TILE_SVG(color, opacity))}")`,
  backgroundSize: `${size}px ${size}px`,
});

export const AzulejoStrip = ({ color = "#2B5FAB", tile = 44, className = "" }) => (
  <div
    aria-hidden="true"
    className={`h-11 w-full ${className}`}
    style={{ ...azulejoTile(color, 0.85, tile), backgroundRepeat: "repeat-x", backgroundPosition: "center top" }}
  />
);

const FISH = [
  { cls: "left-[5%] top-[16%] w-20", color: "text-terra", rot: "-8deg", delay: "0s" },
  { cls: "right-[7%] top-[26%] w-28 -scale-x-100", color: "text-azul", rot: "6deg", delay: "1.2s" },
  { cls: "left-[12%] bottom-[16%] w-14", color: "text-amarelo", rot: "4deg", delay: "0.6s" },
  { cls: "right-[14%] bottom-[22%] w-16 -scale-x-100", color: "text-rosa", rot: "-5deg", delay: "1.8s" },
  { cls: "left-[42%] top-[8%] w-12", color: "text-menta", rot: "10deg", delay: "2.4s" },
  { cls: "right-[38%] bottom-[8%] w-12 -scale-x-100", color: "text-roxo", rot: "-10deg", delay: "0.9s" },
];

export const FloatingSardines = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {FISH.map((f, i) => (
      <span key={i} className={`animate-float-slow absolute ${f.cls}`} style={{ "--rot": f.rot, animationDelay: f.delay }}>
        <SardineIcon className={`h-full w-full ${f.color}`} />
      </span>
    ))}
  </div>
);

export const SwimmingSardine = () => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ["-18vw", "112vw"]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], ["34vh", "60vh", "38vh", "64vh", "40vh", "56vh"]);
  const rotate = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [9, -11, 9, -11, 9, -7]);
  const color = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], ["#D96B43", "#2B5FAB", "#E4607F", "#5E9E54", "#7A5AA6"]);
  return (
    <motion.div
      aria-hidden="true"
      data-testid="swimming-sardine"
      className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
      style={{ x, y }}
    >
      <motion.div style={{ rotate, scaleX: -1, color }}>
        <div className="animate-tail-wag">
          <SardineIcon className="h-10 w-24 drop-shadow-lg" />
        </div>
      </motion.div>
    </motion.div>
  );
};
