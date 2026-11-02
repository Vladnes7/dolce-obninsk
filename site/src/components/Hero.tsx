"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RATING } from "@/data/site";
import { Wordmark } from "./Decor";
import { EASE, LineReveal } from "./Reveal";

/*
  Первый экран. Компьютер: мятная колонка с текстом и фото меренги справа (не на весь экран).
  Телефон: вертикальное фото на весь экран, текст сверху на мятной дымке (верх кадра и так мятная стена).
  Параллакс: фото медленнее, карточки десертов быстрее.
*/
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const k = reduce ? 0 : 1;
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", `${12 * k}%`]);
  const cardA = useTransform(scrollYProgress, [0, 1], [0, -160 * k]);
  const cardB = useTransform(scrollYProgress, [0, 1], [0, -80 * k]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-mint lg:grid lg:min-h-[min(100svh,940px)] lg:grid-cols-[1.2fr_1fr]"
    >
      <div className="relative z-10 flex flex-col px-4 pb-[17rem] pt-24 md:px-8 lg:justify-center lg:pb-20 lg:pl-[max(2rem,calc((100vw-1320px)/2+2rem))] lg:pr-12 lg:pt-32">
        <motion.p className="caps flex items-center gap-3 text-ink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <span aria-hidden="true" className="size-1.5 rotate-45 bg-current" />
          Кофейня-кондитерская · Обнинск
        </motion.p>
        <motion.div
          className="mt-5 text-mint-deeper"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        >
          <Wordmark className="w-[min(78vw,340px)] lg:w-[min(30vw,400px)]" />
        </motion.div>
        <LineReveal
          as="h1"
          inView={false}
          delay={0.35}
          className="mt-5 font-display text-[clamp(2rem,8.4vw,2.8rem)] font-medium leading-[1.06] tracking-[-0.015em] lg:mt-7 lg:text-[clamp(2.8rem,4.2vw,4.4rem)]"
          lines={[
            "Торты и десерты",
            <em key="i" className="font-normal italic text-mint-deeper">
              от шеф‑кондитера
            </em>,
          ]}
        />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}>
          <p className="mt-6 hidden max-w-[33rem] text-lg leading-relaxed text-ink/85 lg:block">
            Готовые торты кусочками и целиком, пирожные, выпечка и хлеб. Торт по вашему дизайну от 3 050 ₽ за кг. Заказ накануне до 19:00,
            доставка по Обнинску.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-8">
            <a
              href="#custom"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-mint-deeper px-7 text-base font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97]"
            >
              Заказать торт
            </a>
            <a
              href="#catalog"
              className="inline-flex min-h-13 items-center justify-center rounded-full border-[1.5px] border-ink bg-white/40 px-7 text-base font-medium backdrop-blur-sm transition-colors duration-200 hover:bg-white lg:bg-transparent"
            >
              Выбрать десерт
            </a>
          </div>
          <a
            href="#reviews"
            className="mt-7 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-white/80 py-2 pl-2 pr-4 text-[15px] backdrop-blur-sm transition-colors hover:bg-white lg:mt-9"
          >
            <span className="flex items-center gap-1 rounded-full bg-mint-light px-3 py-0.5 font-display text-lg font-semibold">
              {RATING.value} <Star className="size-4 text-mint-deep" />
            </span>
            <span>Яндекс Карты · {new Intl.NumberFormat("ru-RU").format(RATING.count)} оценок</span>
          </a>
        </motion.div>
      </div>

      {/* Фото: на телефоне фоном на весь экран, на компьютере правая колонка. */}
      <div className="absolute inset-0 -z-20 lg:relative lg:inset-auto lg:z-auto lg:h-auto">
        <motion.div className="absolute inset-0 -top-[6%] h-[112%]" style={{ y: photoY }}>
          <motion.div className="relative size-full" initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: EASE }}>
            <Image
              src="/img/hero.jpg"
              alt="Безе на блюдце на столике кофейни Dolce, за ним мятная стена с логотипом"
              fill
              preload
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[50%_70%] lg:object-[50%_55%]"
            />
          </motion.div>
        </motion.div>

        {/* Телефон: мятная дымка под текстом сверху, кадр с меренгой остаётся чистым внизу. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[78%] bg-gradient-to-b from-mint via-mint/85 via-55% to-transparent lg:hidden" />

        {/* Арки с десертами. Телефон: лимонные справа, малиновые снизу слева. Компьютер: по краям фото. */}
        <motion.figure
          style={{ y: cardA }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
          className="absolute bottom-6 left-4 w-[28%] max-w-[190px] md:left-8 overflow-hidden rounded-t-full border-4 border-white shadow-[0_24px_50px_-20px_rgba(23,46,43,0.4)] lg:-left-[11%] lg:bottom-[12%] lg:w-[34%] lg:max-w-[260px] lg:border-[5px]"
        >
          <Image src="/img/raspberry.jpg" alt="Малиновые пирожные-муссы" width={600} height={600} sizes="(min-width: 1024px) 260px, 32vw" className="aspect-[3/4] object-cover" />
        </motion.figure>
        <motion.figure
          style={{ y: cardB }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
          className="absolute bottom-28 right-4 w-[24%] max-w-[160px] md:right-8 lg:bottom-auto overflow-hidden rounded-t-full border-4 border-white shadow-[0_24px_50px_-20px_rgba(23,46,43,0.4)] lg:right-6 lg:top-[18%] lg:w-[28%] lg:max-w-[200px] lg:border-[5px]"
        >
          <Image src="/img/lemon.jpg" alt="Лимонные пирожные с фисташкой" width={400} height={600} sizes="(min-width: 1024px) 200px, 26vw" className="aspect-[2/3] object-cover" />
        </motion.figure>
      </div>

    </section>
  );
}

export function Star({ className = "size-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 1.6l2.47 5.3 5.8.68-4.29 3.96 1.14 5.73L10 14.4l-5.12 2.87 1.14-5.73L1.73 7.58l5.8-.68L10 1.6z"
      />
    </svg>
  );
}
