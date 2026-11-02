"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "@/data/menu";
import { rub } from "@/data/site";
import { useOrder } from "../order/OrderContext";

export const TAB_STORAGE = "dolce-catalog-tab";

// Размер, цена и «В заявку». Ключ строки тот же, что в карточке каталога, поэтому позиции складываются.
export function DishBuy({ item }: { item: MenuItem }) {
  const { lines, add, setQty, setOpen } = useOrder();
  const [v, setV] = useState(0);
  const variant = item.variants?.[v];
  const price = variant?.price ?? item.price;
  const key = item.slug + (variant ? `:${v}` : "");
  const inOrder = lines.find((l) => l.key === key);

  // Вернувшись в каталог, посетитель окажется в разделе этого блюда.
  useEffect(() => {
    try {
      sessionStorage.setItem(TAB_STORAGE, item.section);
    } catch {}
  }, [item.section]);

  return (
    <div className="mt-6">
      {item.variants && (
        <fieldset>
          <legend className="mb-2.5 text-sm text-ink-soft">Размер</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Размер: ${item.name}`}>
            {item.variants.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                role="radio"
                aria-checked={i === v}
                onClick={() => setV(i)}
                className={`min-h-11 rounded-full border px-4 text-[15px] transition-colors ${
                  i === v ? "border-mint-deep bg-mint-deep text-white" : "border-ink/20 hover:border-mint-deep/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
        <span className="tabular whitespace-nowrap font-display text-[2rem] font-semibold leading-none md:text-[2.4rem]">{rub(price)}</span>
        {inOrder ? (
          <div className="flex items-center gap-3">
            <div className="flex h-12 items-center rounded-full bg-mint">
              <button type="button" onClick={() => setQty(key, inOrder.qty - 1)} className="grid size-12 place-items-center text-xl" aria-label={`Убрать: ${item.name}`}>
                −
              </button>
              <span className="tabular min-w-6 text-center text-base font-medium" aria-live="polite">
                {inOrder.qty}
              </span>
              <button
                type="button"
                onClick={() => add({ key, name: item.name, variant: variant?.label, price })}
                className="grid size-12 place-items-center text-xl"
                aria-label={`Ещё: ${item.name}`}
              >
                +
              </button>
            </div>
            <button type="button" onClick={() => setOpen(true)} className="min-h-11 text-[15px] font-medium text-mint-deeper underline decoration-mint-deep/40 underline-offset-4 hover:decoration-mint-deep">
              Открыть заявку
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => add({ key, name: item.name, variant: variant?.label, price })}
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-mint-deeper px-7 text-base font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97]"
          >
            В заявку
          </button>
        )}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-soft">Заявку отправите в WhatsApp. Заказ накануне до 19:00, день в день не принимаем.</p>
    </div>
  );
}
