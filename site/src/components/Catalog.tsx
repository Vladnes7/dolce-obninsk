"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { TAB_STORAGE } from "./dish/DishBuy";
import { MENU, SECTIONS, splitMark, type MenuItem, type SectionId } from "@/data/menu";
import { rub } from "@/data/site";
import { useOrder } from "./order/OrderContext";
import { Eyebrow, Terrazzo } from "./Decor";
import { EASE, LineReveal, Reveal } from "./Reveal";

export function Catalog() {
  const [tab, setTabState] = useState<SectionId>("cakes");
  const items = MENU.filter((i) => i.section === tab);

  // Возврат со страницы блюда: открываем тот раздел, где посетитель был.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const saved = sessionStorage.getItem(TAB_STORAGE);
        if (saved && SECTIONS.some((s) => s.id === saved)) setTabState(saved as SectionId);
      } catch {}
    });
    return () => cancelAnimationFrame(id);
  }, []);
  const setTab = (id: SectionId) => {
    setTabState(id);
    try {
      sessionStorage.setItem(TAB_STORAGE, id);
    } catch {}
  };

  return (
    <section id="catalog" className="relative bg-white py-20 md:py-28">
      <Terrazzo seed={11} count={40} className="h-[560px]" />
      <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Витрина</Eyebrow>
            <LineReveal
              className="font-display text-[2.2rem] font-medium leading-[1.06] tracking-[-0.015em] md:text-6xl"
              lines={[
                "Что есть",
                <em key="i" className="font-normal italic text-mint-deep">
                  в кондитерской
                </em>,
              ]}
            />
          </div>
          <Reveal>
            <p className="max-w-md text-ink-soft lg:text-right">
              Добавляйте позиции в заявку и отправьте её в WhatsApp. Заказ — накануне до 19:00, день в день не принимаем.
            </p>
          </Reveal>
        </div>

        <div className="sticky top-16 z-20 -mx-4 mt-10 bg-white/95 px-4 py-3 backdrop-blur md:top-[72px] md:mx-0 md:px-0">
          <div role="tablist" aria-label="Разделы каталога" className="no-scrollbar flex gap-2 overflow-x-auto">
            {SECTIONS.map((s) => {
              const active = s.id === tab;
              const n = MENU.filter((i) => i.section === s.id).length;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={active}
                  aria-controls="catalog-grid"
                  onClick={() => setTab(s.id)}
                  className={`relative flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors ${
                    active ? "text-ink" : "bg-white text-ink/80 ring-1 ring-line hover:text-ink hover:ring-mint"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-mint" transition={{ duration: 0.4, ease: EASE }} />
                  )}
                  <span className="relative">{s.label}</span>
                  <span className="tabular relative text-sm text-ink/60">{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div id="catalog-grid" role="tabpanel" className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={tab}
              className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 xl:grid-cols-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {items.map((item, i) => (
                <ProductCard key={item.slug} item={item} eager={i < 4} />
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item, eager }: { item: MenuItem; eager: boolean }) {
  const { lines, add, setQty } = useOrder();
  const [v, setV] = useState(0);
  const variant = item.variants?.[v];
  const price = variant?.price ?? item.price;
  const key = item.slug + (variant ? `:${v}` : "");
  const inOrder = lines.find((l) => l.key === key);
  const { weight, badge } = splitMark(item.mark);
  const tag = item.vegan ? "Веган" : badge;
  const photoCount = item.photos?.length ?? (item.img2 ? 2 : 1);

  return (
    <li className="group flex flex-col">
      {/* Фото, название и описание ведут на страницу блюда; размер и «В заявку» работают прямо в карточке. */}
      <Link href={`/menu/${item.slug}`} className="block rounded-2xl focus-visible:outline-offset-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-mint-light transition-transform duration-200 ease-out group-active:scale-[0.97]">
        <Image
          src={item.img!}
          alt={item.name}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        {/* Второй ракурс при наведении, как на старом сайте. На тач-экранах скрыт и не грузится. */}
        {item.img2 && (
          <div aria-hidden="true" className="absolute inset-0 hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:block">
            <Image
              src={item.img2}
              alt=""
              fill
              loading="lazy"
              sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
            />
          </div>
        )}
        {tag && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink md:left-3 md:top-3">
            {tag}
          </span>
        )}
        {photoCount > 1 && (
          <span className="tabular absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-ink backdrop-blur md:bottom-3 md:right-3">
            <svg viewBox="0 0 20 20" className="size-3.5" aria-hidden="true">
              <path fill="currentColor" d="M7.2 3.5 6 5.2H3.8A1.8 1.8 0 0 0 2 7v8.2A1.8 1.8 0 0 0 3.8 17h12.4a1.8 1.8 0 0 0 1.8-1.8V7a1.8 1.8 0 0 0-1.8-1.8H14l-1.2-1.7H7.2ZM10 7.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Z" />
            </svg>
            {photoCount}
            <span className="sr-only"> фото</span>
          </span>
        )}
      </div>

        <h3 className="mt-3 text-[15px] font-medium leading-snug decoration-mint-deep/50 underline-offset-4 group-hover:underline md:text-base">{item.name}</h3>
        {(weight || item.kcal) && (
          <p className="mt-0.5 text-sm text-ink-soft">
            {weight}
            {weight && item.kcal ? " · " : ""}
            {item.kcal ? `${item.kcal.replace(".", ",")} ккал/100 г` : ""}
          </p>
        )}
        {item.short && !item.short.startsWith("Ккал") && (
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft max-md:hidden">
            <span className="line-clamp-2">{item.short}</span>
            <span className="mt-1 inline-block font-medium text-mint-deeper">Подробнее →</span>
          </p>
        )}
      </Link>

      <div className="flex flex-1 flex-col">

        {item.variants && (
          <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Размер: ${item.name}`}>
            {item.variants.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                role="radio"
                aria-checked={i === v}
                onClick={() => setV(i)}
                className={`min-h-11 rounded-full border px-3 text-xs transition-colors md:min-h-9 ${
                  i === v ? "border-mint-deep bg-mint-deep text-white" : "border-ink/20 hover:border-mint-deep/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2.5 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="tabular whitespace-nowrap font-display text-lg font-semibold md:text-xl">{rub(price)}</span>
          {inOrder ? (
            <div className="flex items-center justify-between rounded-full bg-mint">
              <button type="button" onClick={() => setQty(key, inOrder.qty - 1)} className="grid size-10 place-items-center text-lg" aria-label={`Убрать: ${item.name}`}>
                −
              </button>
              <span className="tabular min-w-5 text-center text-[15px] font-medium" aria-live="polite">
                {inOrder.qty}
              </span>
              <button
                type="button"
                onClick={() => add({ key, name: item.name, variant: variant?.label, price })}
                className="grid size-10 place-items-center text-lg"
                aria-label={`Ещё: ${item.name}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => add({ key, name: item.name, variant: variant?.label, price })}
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full bg-mint px-3.5 text-sm font-semibold text-ink transition-[background-color,transform] duration-200 hover:bg-mint-2 active:scale-[0.96] md:px-4"
            >
              В заявку
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
