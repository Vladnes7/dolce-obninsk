"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { EASE } from "./Reveal";

/*
  Терраццо: цветная крошка, как пол в зале Dolce. Детерминированный генератор,
  чтобы сервер и клиент рисовали одно и то же. Крошка гуще по краям, центр под текстом чистый.
*/
// Основа: мятные оттенки. «warm» только для отзывов, где Влад оставил золото и малину.
const PALETTE = {
  mint: ["#86d3ca", "#2c7a73", "#74c8be", "#b9e6e0"],
  light: ["#ffffff", "#e4f5f2", "#b9e6e0"],
  warm: ["#e3a530", "#c8325f", "#86d3ca", "#f2cf7f"],
};

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function chips(seed: number, count: number, colors: string[]) {
  const r = rng(seed);
  return Array.from({ length: count }, () => {
    // Почти вся крошка у левого/правого края: середина, где текст, остаётся чистой.
    const edge = r() < 0.85;
    const x = edge ? (r() < 0.5 ? r() * 6 : 93 + r() * 7) : 40 + r() * 20;
    const y = r() * 100;
    const size = Math.round(6 + r() * 14);
    // Неровный пятиугольник в процентах своей коробки: форма не тянется вместе с секцией.
    const poly = Array.from({ length: 5 }, (_, i) => {
      const a = (i / 5) * Math.PI * 2 + r() * 0.8;
      const d = 30 + r() * 20;
      return `${(50 + Math.cos(a) * d).toFixed(1)}% ${(50 + Math.sin(a) * d).toFixed(1)}%`;
    }).join(",");
    return { x, y, size, poly, fill: colors[Math.floor(r() * colors.length)], o: 0.4 + r() * 0.45, rot: Math.round(r() * 180) };
  });
}

export function Terrazzo({
  seed = 7,
  count = 46,
  tone = "mint",
  className = "",
  drift = 60,
}: {
  seed?: number;
  count?: number;
  tone?: keyof typeof PALETTE;
  className?: string;
  drift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const list = chips(seed, count, PALETTE[tone]);
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="terrazzo-drift absolute inset-x-0 -inset-y-[10%]">
        {list.map((c, i) => (
          <span
            key={i}
            className="absolute block"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: c.size,
              height: c.size,
              background: c.fill,
              opacity: c.o,
              clipPath: `polygon(${c.poly})`,
              transform: `rotate(${c.rot}deg)`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* Фирменное название: настоящий вордмарк DOLCE (маска в globals.css), красится через text-*. */
export function Wordmark({ full = false, className = "" }: { full?: boolean; className?: string }) {
  return <span role="img" aria-label="Dolce" className={`${full ? "wordmark" : "wordmark-name"} align-baseline ${className}`} />;
}

/* Рукописное слово «пишется» слева направо, как кремом из кондитерского мешка. */
export function ScriptWord({ children, className = "", delay = 0, inView = true }: { children: ReactNode; className?: string; delay?: number; inView?: boolean }) {
  const hidden = { clipPath: "inset(-30% 100% -30% -10%)" };
  const shown = { clipPath: "inset(-30% -10% -30% -10%)" };
  return (
    <motion.span
      className={`script script-word inline-block px-[0.08em] ${className}`}
      initial={hidden}
      {...(inView ? { whileInView: shown, viewport: { once: true, margin: "0px 0px -10% 0px" } } : { animate: shown })}
      transition={{ duration: 1.4, ease: EASE, delay }}
    >
      {children}
    </motion.span>
  );
}

/* Подпись капсом с ромбиком, единая для всех секций. Ромбик того же цвета, что текст. */
export function Eyebrow({ children, className = "text-mint-deep" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`caps mb-4 flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="size-1.5 rotate-45 bg-current" />
      {children}
    </p>
  );
}
