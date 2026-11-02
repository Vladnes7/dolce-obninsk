"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PHONES, WHATSAPP, rub } from "@/data/site";
import { EASE } from "../Reveal";
import { DeliveryFields, deliveryErrors, deliveryLines, useDelivery } from "./DeliveryFields";
import { useOrder, whatsappLink } from "./OrderContext";
import { Field, inputCls, phoneOk } from "./fields";

export function OrderDrawer() {
  const { open, setOpen, lines, total, setQty, clear } = useOrder();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [d, setD, earliest] = useDelivery();
  const [comment, setComment] = useState("");
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setOpen]);

  const errors: Record<string, string> = {
    ...deliveryErrors(d, earliest),
    name: name.trim() ? "" : "Напишите, как к вам обращаться",
    phone: phoneOk(phone) ? "" : "Нужен номер телефона, чтобы подтвердить заказ",
  };
  const valid = lines.length > 0 && Object.values(errors).every((e) => !e);
  const shown = tried ? errors : {};

  const message = [
    "Здравствуйте! Заявка с сайта Dolce.",
    "",
    ...lines.map((l) => `• ${l.name}${l.variant ? ` (${l.variant})` : ""} × ${l.qty} — ${rub(l.price * l.qty)}`),
    `Итого по каталогу: ${rub(total)}`,
    "",
    ...deliveryLines(d),
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    comment ? `Комментарий: ${comment}` : "",
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n")
    .trim();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="order-title">
          <motion.button
            type="button"
            aria-label="Закрыть заявку"
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-[0_0_60px_rgba(0,0,0,0.18)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
              <h2 id="order-title" className="font-display text-xl font-medium">
                Заявка
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-full transition-colors hover:bg-mint-light"
                aria-label="Закрыть"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              {lines.length === 0 ? (
                <div className="rounded-2xl bg-mint-light p-5">
                  <p className="font-medium">В заявке пока пусто</p>
                  <p className="mt-1 text-ink-soft">
                    Добавьте торты и десерты из каталога кнопкой «В заявку» или закажите торт по своему дизайну.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href="/#catalog" onClick={() => setOpen(false)} className="rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white">
                      Открыть каталог
                    </Link>
                    <Link href="/#custom" onClick={() => setOpen(false)} className="rounded-full border border-ink/20 px-4 py-2.5 text-sm font-medium">
                      Торт на заказ
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-line">
                    {lines.map((l) => (
                      <li key={l.key} className="flex items-center gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-snug">{l.name}</p>
                          <p className="text-sm text-ink-soft">
                            {l.variant ? `${l.variant} · ` : ""}
                            {rub(l.price)}
                          </p>
                        </div>
                        <div className="flex items-center rounded-full border border-ink/15">
                          <button type="button" onClick={() => setQty(l.key, l.qty - 1)} className="grid size-10 place-items-center text-lg" aria-label={`Убрать одну позицию: ${l.name}`}>
                            −
                          </button>
                          <span className="tabular w-6 text-center">{l.qty}</span>
                          <button type="button" onClick={() => setQty(l.key, l.qty + 1)} className="grid size-10 place-items-center text-lg" aria-label={`Добавить ещё: ${l.name}`}>
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-baseline justify-between border-t border-ink/15 pt-3">
                    <span className="text-ink-soft">Итого по каталогу</span>
                    <span className="tabular font-display text-lg font-medium">{rub(total)}</span>
                  </div>
                  <button type="button" onClick={clear} className="mt-1 text-sm text-ink-soft underline underline-offset-4">
                    Очистить заявку
                  </button>

                  <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()} noValidate>
                    <DeliveryFields id="o" d={d} set={setD} errors={shown} earliest={earliest} />
                    <Field label="Ваше имя" htmlFor="o-name" error={shown.name}>
                      <input id="o-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Телефон" htmlFor="o-phone" error={shown.phone}>
                      <input id="o-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+7" />
                    </Field>
                    <Field label="Комментарий" htmlFor="o-comment">
                      <textarea id="o-comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className={inputCls} placeholder="Надпись на торте, пожелания" />
                    </Field>
                  </form>
                </>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-line bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <a
                  href={valid ? whatsappLink(WHATSAPP, message) : undefined}
                  target="_blank"
                  rel="noopener"
                  onClick={(e) => {
                    if (!valid) {
                      e.preventDefault();
                      setTried(true);
                    }
                  }}
                  className="flex min-h-13 w-full items-center justify-center rounded-full bg-mint-deep px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-mint-deeper"
                  role="button"
                >
                  Отправить в WhatsApp
                </a>
                <p className="mt-2 text-center text-sm text-ink-soft">
                  Или позвоните: <a className="font-medium text-ink underline-offset-4 hover:underline" href={`tel:${PHONES[0].tel}`}>{PHONES[0].display}</a>
                </p>
                {tried && !valid && (
                  <p className="mt-1 text-center text-sm text-[#b3261e]" role="alert">
                    Заполните отмеченные поля выше
                  </p>
                )}
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
