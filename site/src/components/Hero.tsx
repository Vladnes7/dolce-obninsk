"use client";

import { getImageProps } from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { RATING } from "@/data/site";
import { EASE } from "./Reveal";

// Art direction: один кадр съёмки, отдельная вертикальная композиция для телефона.
// <picture> выбирает ровно один файл; фото видно сразу, без ожидания анимации.
const shared = { alt: "Торт, малиновое пирожное и капучино на столике в интерьере Dolce", sizes: "100vw", loading: "eager" as const, fetchPriority: "high" as const };
const { props: desktop } = getImageProps({ ...shared, src: "/img/hero-dolce-table.webp", width: 1672, height: 941 });
const { props: mobile } = getImageProps({ ...shared, src: "/img/hero-dolce-table-mobile.webp", width: 1024, height: 1536 });

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" aria-labelledby="hero-title" className="hero-scene relative isolate flex min-h-[max(780px,100svh)] flex-col overflow-hidden bg-ink text-white md:min-h-[max(820px,100svh)] lg:min-h-[min(100svh,1040px)]">
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 767px)" srcSet={mobile.srcSet} />
        {/* getImageProps сохраняет оптимизацию Next в адаптивном picture. */}
        <img {...desktop} alt={shared.alt} className="size-full object-cover object-[55%_65%] md:object-[65%_50%]" />
      </picture>
      <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-5 pb-10 pt-[132px] md:px-8 md:pb-12 md:pt-44 lg:justify-center lg:pb-24 lg:pt-36">
        <motion.div
          className="max-w-[580px]"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-mint-light md:text-xs md:tracking-[0.24em]">
            <span aria-hidden="true" className="size-1.5 rotate-45 bg-mint" />
            Кофейня-кондитерская · Обнинск
          </p>
          <h1 id="hero-title" className="mt-5 text-balance font-display text-[clamp(2.2rem,9.1vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] md:mt-7 md:text-[clamp(3.2rem,4.3vw,4.2rem)]">
            Торты и десерты<br />
            <span className="font-normal italic">от шеф‑кондитера</span>
          </h1>
          <p className="mt-5 max-w-[26rem] text-[15px] leading-relaxed text-white/90 md:mt-7 md:text-lg">
            Кусочек торта, любимый кофе и время для себя. Или целый торт — для вашего особенного дня.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            <a href="#custom" className="inline-flex min-h-13 items-center justify-center rounded-full bg-mint px-6 text-[15px] font-semibold text-ink transition-[background-color,transform] duration-200 hover:bg-mint-light active:scale-[0.97] md:px-7 md:text-base">
              Заказать торт
            </a>
            <a href="#catalog" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/75 bg-ink/10 px-6 text-[15px] font-medium text-white transition-[background-color,transform] duration-200 hover:bg-white/15 active:scale-[0.97] md:px-7 md:text-base">
              Выбрать десерт
            </a>
          </div>
        </motion.div>

        <div className="absolute inset-x-5 bottom-7 flex items-end justify-between gap-4 md:inset-x-8 md:bottom-10">
          <a href="#reviews" className="inline-flex min-h-11 items-center gap-3 text-sm text-white transition-opacity hover:opacity-80">
            <span className="flex items-center gap-1.5 font-display text-2xl font-medium">{RATING.value}<Star className="size-4 text-mint" /></span>
            <span className="border-l border-white/35 pl-3 leading-snug">Яндекс Карты<br /><span className="text-xs text-white/80">{new Intl.NumberFormat("ru-RU").format(RATING.count)} оценок</span></span>
          </a>
          <a href="#catalog" aria-label="Перейти к каталогу" className="hidden size-12 items-center justify-center rounded-full border border-white/50 text-xl transition-colors hover:bg-white/15 sm:flex">↓</a>
        </div>
      </div>
    </section>
  );
}

export function Star({ className = "size-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M10 1.6l2.47 5.3 5.8.68-4.29 3.96 1.14 5.73L10 14.4l-5.12 2.87 1.14-5.73L1.73 7.58l5.8-.68L10 1.6z" />
    </svg>
  );
}
