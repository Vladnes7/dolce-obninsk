"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// Галерея блюда: на телефоне листается свайпом (scroll-snap), на компьютере стрелками и миниатюрами.
export function DishGallery({ photos, name, badge }: { photos: string[]; name: string; badge?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const many = photos.length > 1;

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = Math.max(0, Math.min(photos.length - 1, i));
      el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    },
    [photos.length, reduce],
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lg:flex lg:flex-row-reverse lg:gap-4">
      <div className="dish-photo-in relative min-w-0 flex-1">
        {/* Лента: только по горизонтали (overflow-y-hidden — фото не съезжает вверх-вниз при свайпе наискосок),
            без фокуса (иначе Safari по касанию прокручивает к ней страницу), свайп не уходит в страницу и жест «назад». */}
        <ul
          ref={track}
          aria-label={many ? `Фото: ${name}, ${photos.length} шт.` : undefined}
          className="no-scrollbar flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain bg-mint-light md:rounded-2xl"
        >
          {photos.map((src, i) => (
            <li key={src} className="relative h-full w-full shrink-0 snap-center snap-always overflow-hidden">
              <Image
                src={src}
                alt={i === 0 ? name : `${name}, фото ${i + 1}`}
                fill
                preload={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                sizes="(min-width: 1320px) 600px, (min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>

        {badge && <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-medium text-ink md:left-4 md:top-4">{badge}</span>}

        {many && (
          <>
            <span className="tabular absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-sm font-medium text-white backdrop-blur md:bottom-4 md:right-4" aria-live="polite">
              {index + 1} / {photos.length}
            </span>
            {/* Стрелки только для мыши: на телефоне листают пальцем. */}
            <div className="pointer-events-none absolute inset-x-3 top-1/2 hidden -translate-y-1/2 justify-between [@media(hover:hover)_and_(pointer:fine)]:flex">
              <Arrow dir={-1} disabled={index === 0} onClick={() => go(index - 1)} />
              <Arrow dir={1} disabled={index === photos.length - 1} onClick={() => go(index + 1)} />
            </div>
            {/* Точки на телефоне */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 lg:hidden" aria-hidden="true">
              {photos.map((src, i) => (
                <span key={src} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {many && (
        // h-0 + min-h-full: колонка миниатюр не выше главного фото, лишние прокручиваются.
        <ul className="no-scrollbar hidden lg:flex lg:h-0 lg:min-h-full lg:w-[96px] lg:shrink-0 lg:flex-col lg:gap-2.5 lg:overflow-y-auto lg:p-1" aria-label="Миниатюры">
          {photos.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Показать фото ${i + 1}`}
                aria-current={i === index}
                className={`relative block aspect-[4/5] w-[88px] overflow-hidden rounded-xl bg-mint-light transition-[box-shadow,opacity] ${
                  i === index ? "ring-2 ring-mint-deep ring-offset-2" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill loading="lazy" sizes="88px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Arrow({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? "Следующее фото" : "Предыдущее фото"}
      className="pointer-events-auto grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-[opacity,transform] hover:bg-white active:scale-95 disabled:opacity-0"
    >
      <svg viewBox="0 0 20 20" className={`size-5 ${dir === -1 ? "rotate-180" : ""}`} aria-hidden="true">
        <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
