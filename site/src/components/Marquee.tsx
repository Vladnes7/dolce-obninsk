"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

// Бесконечная лента: контент дублируется, трек сдвигается на половину ширины.
// Мышь: пауза при наведении (CSS). Палец: пауза, пока касаешься, и ещё 2 с после, чтобы дочитать.
export function Marquee({
  children,
  duration = 40,
  className = "",
  label,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  label?: string;
}) {
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const hold = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    clearTimeout(timer.current);
    setPaused(true);
  };
  const release = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPaused(false), 2000);
  };

  return (
    <div
      className={`marquee overflow-hidden [@media(pointer:coarse)]:select-none [@media(pointer:coarse)]:[-webkit-touch-callout:none] ${className}`}
      aria-label={label}
      role={label ? "region" : undefined}
      data-paused={paused ? "" : undefined}
      onPointerDown={hold}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div className="marquee-track flex w-max" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

const FACTS = [
  "Хорошее место 2026 на Яндекс Картах",
  "Торты кусочками и целиком",
  "Выпечка, пироги и хлеб",
  "Доставка по Обнинску с 11:00 до 19:00",
  "Кофе и десерты навынос",
  "Самовывоз из Кривского −10%",
];

export function FactsBand() {
  return (
    <div className="relative z-10 bg-mint-deeper py-4 text-white">
      <Marquee duration={38} label="Коротко о Dolce">
        {FACTS.map((f) => (
          <span key={f} className="flex items-center whitespace-nowrap font-display text-base italic md:text-lg">
            <span className="px-7">{f}</span>
            <span aria-hidden="true" className="size-2 rotate-45 bg-mint" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
