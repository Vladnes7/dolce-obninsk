"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { PHONES } from "@/data/site";
import { Terrazzo } from "./Decor";
import { useOrder } from "./order/OrderContext";
import { EASE } from "./Reveal";

const NAV = [
  { href: "/#catalog", label: "Каталог" },
  { href: "/#custom", label: "Торт на заказ" },
  { href: "/#bento", label: "Бенто-торт" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#delivery", label: "Доставка" },
  { href: "/#shops", label: "Адреса" },
];

// Фирменный Dolce Bianco восстановлен по исходному логотипу, без подмены шрифта.
export function Logo({ className = "w-[130px]", inverse = false }: { className?: string; inverse?: boolean }) {
  return <Image src="/img/brand/dolce-bianco.webp" alt="Кондитерская Dolce Bianco" loading="eager" width={768} height={265} sizes="190px" className={`h-auto ${inverse ? "brightness-0 invert" : ""} ${className}`} />;
}

export function Header() {
  const { count, setOpen } = useOrder();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Открытое меню: страница под ним не скроллится, Esc закрывает.
  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] text-ink transition-[background-color,box-shadow] duration-300 ${
        scrolled && !menu ? "bg-white/92 shadow-[0_1px_0_rgba(31,58,55,0.08)] backdrop-blur-md" : "bg-white/95"
      }`}
    >
      <div className="relative z-10 mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-4 md:gap-5 md:h-[76px] md:px-8">
        <Link href="/#top" onClick={() => setMenu(false)} className="flex min-h-11 items-center" aria-label="Dolce, на главную">
          <Logo className="w-[124px] shrink-0 md:w-[148px]" />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Разделы">
          {NAV.filter((n) => n.href !== "/#bento").map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-3.5 py-2 text-[15px] transition-colors hover:bg-mint-light/70">
              {n.label}
            </Link>
          ))}
        </nav>

        <a href={`tel:${PHONES[0].tel}`} className="hidden text-[15px] font-medium tabular xl:block">
          {PHONES[0].display}
        </a>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative ml-auto flex h-11 items-center gap-2 rounded-full bg-mint-deeper px-5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97] lg:ml-0"
        >
          Заявка
          <AnimatePresence initial={false}>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="tabular grid h-6 min-w-6 place-items-center rounded-full bg-mint px-1.5 text-sm text-ink"
                aria-label={`позиций: ${count}`}
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Мятный бургер: три линии сходятся в крестик. На мятном меню кнопка становится белой. */}
        <button
          type="button"
          className={`grid size-12 place-items-center rounded-full text-ink shadow-[0_6px_16px_-8px_rgba(23,46,43,0.45)] transition-[background-color,transform] duration-200 active:scale-[0.94] lg:hidden ${
            menu ? "bg-white" : scrolled ? "burger-glow bg-mint" : "bg-white"
          }`}
          aria-expanded={menu}
          aria-controls="mobile-nav"
          aria-label={menu ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenu((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-3.5 w-5">
            <span className={`absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-transform duration-300 ${menu ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[6px] h-[2px] w-3.5 rounded-full bg-current transition-opacity duration-200 ${menu ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-3 h-[2px] w-5 rounded-full bg-current transition-transform duration-300 ${menu ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-nav"
            aria-label="Разделы"
            className="fixed inset-0 z-0 flex flex-col overflow-y-auto bg-mint pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))] text-ink lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <Terrazzo seed={3} count={34} tone="light" drift={0} />
            <ul className="relative flex flex-col px-6">
              {NAV.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.12 + i * 0.05 }}
                  className="border-b border-ink/10"
                >
                  <Link href={n.href} onClick={() => setMenu(false)} className="flex items-center justify-between py-4 font-display text-[1.85rem] leading-tight">
                    {n.label}
                    <span aria-hidden="true" className="text-xl text-mint-deeper">
                      →
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="relative mt-8 flex flex-col gap-3 px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <Link
                href="/#custom"
                onClick={() => setMenu(false)}
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-mint-deeper text-base font-semibold text-white"
              >
                Заказать торт
              </Link>
              <div className="mt-4 flex flex-col">
                {PHONES.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="tabular py-2 text-lg font-medium text-ink">
                    {p.display}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
