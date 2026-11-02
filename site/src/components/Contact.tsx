"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { PHONES, WHATSAPP } from "@/data/site";
import { useOrder, whatsappLink } from "./order/OrderContext";
import { Field, inputCls, phoneOk } from "./order/fields";
import { EASE } from "./Reveal";

// «Заказать звонок» и «Обратная связь», как на старом сайте. Без сервера: сообщение уходит в WhatsApp.
type Dialog = "callback" | "feedback" | null;

const Ctx = createContext<(d: Dialog) => void>(() => {});

export function ContactProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const close = useCallback(() => setDialog(null), []);
  return (
    <Ctx.Provider value={setDialog}>
      {children}
      <ContactLauncher />
      <ContactDialog dialog={dialog} onClose={close} />
    </Ctx.Provider>
  );
}

export function ContactLink({ dialog, children, className }: { dialog: Exclude<Dialog, null>; children: ReactNode; className?: string }) {
  const openDialog = useContext(Ctx);
  return (
    <button type="button" onClick={() => openDialog(dialog)} className={className}>
      {children}
    </button>
  );
}

function ContactLauncher() {
  const openDialog = useContext(Ctx);
  const { open: orderOpen } = useOrder();
  const [visible, setVisible] = useState(false);
  const [menu, setMenu] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Появляется после первого экрана, чтобы не спорить с кнопками героя.
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const onDown = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && setMenu(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  const pick = (d: Exclude<Dialog, null>) => {
    setMenu(false);
    openDialog(d);
  };
  const item = "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] font-medium transition-colors hover:bg-mint-light";

  return (
    <AnimatePresence>
      {visible && !orderOpen && (
        <motion.div
          ref={rootRef}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 md:right-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <AnimatePresence>
            {menu && (
              <motion.div
                id="contact-menu"
                className="w-64 origin-bottom-right rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(58,58,56,0.18)]"
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 8 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                <a href={`tel:${PHONES[0].tel}`} className={item}>
                  <Icon d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                  <span>
                    Позвонить
                    <span className="tabular block text-sm font-normal text-ink-soft">{PHONES[0].display}</span>
                  </span>
                </a>
                <button type="button" onClick={() => pick("callback")} className={item}>
                  <Icon d="M15 3h6v6M21 3l-7 7M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                  Заказать звонок
                </button>
                <a href={whatsappLink(WHATSAPP, "Здравствуйте! Пишу с сайта Dolce.")} target="_blank" rel="noopener" className={item}>
                  <Icon d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
                  Написать в WhatsApp
                </a>
                <button type="button" onClick={() => pick("feedback")} className={item}>
                  <Icon d="M4 5h16v11H8l-4 4z" />
                  Обратная связь
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-label={menu ? "Закрыть меню связи" : "Связаться с нами"}
            aria-expanded={menu}
            aria-controls="contact-menu"
            onClick={() => setMenu((v) => !v)}
            className="grid size-14 place-items-center rounded-full bg-ink text-white shadow-[0_8px_24px_rgba(58,58,56,0.3)] transition-colors hover:bg-ink-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />}
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint-light text-mint-deep">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </span>
  );
}

const COPY = {
  callback: { title: "Заказать звонок", lead: "Оставьте номер — перезвоним и ответим на вопросы.", button: "Отправить в WhatsApp" },
  feedback: { title: "Обратная связь", lead: "Вопрос, отзыв или пожелание — прочитаем и ответим.", button: "Отправить в WhatsApp" },
};

function ContactDialog({ dialog, onClose }: { dialog: Dialog; onClose: () => void }) {
  return <AnimatePresence>{dialog && <DialogBody key={dialog} dialog={dialog} onClose={onClose} />}</AnimatePresence>;
}

function DialogBody({ dialog, onClose }: { dialog: Exclude<Dialog, null>; onClose: () => void }) {
  const firstRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");
  const [tried, setTried] = useState(false);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const errors = {
    phone: phoneOk(phone) ? "" : "Нужен номер телефона",
    text: dialog === "feedback" && !text.trim() ? "Напишите сообщение" : "",
  };
  const valid = !errors.phone && !errors.text;
  const message =
    dialog === "callback"
      ? ["Здравствуйте! Перезвоните мне, пожалуйста.", "", name.trim() ? `Имя: ${name.trim()}` : "", `Телефон: ${phone}`]
      : ["Здравствуйте! Сообщение с сайта Dolce.", "", text.trim(), "", name.trim() ? `Имя: ${name.trim()}` : "", `Телефон: ${phone}`];
  const copy = COPY[dialog];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <motion.button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-ink/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-md rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-3xl sm:p-7"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="contact-title" className="font-display text-xl font-medium">
              {copy.title}
            </h2>
            <p className="mt-1 text-[15px] text-ink-soft">{copy.lead}</p>
          </div>
          <button type="button" onClick={onClose} className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-mint-light" aria-label="Закрыть окно">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form className="mt-5 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()} noValidate>
          <Field label="Телефон" htmlFor="ct-phone" error={tried ? errors.phone : ""}>
            <input ref={firstRef} id="ct-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+7" />
          </Field>
          <Field label="Ваше имя" htmlFor="ct-name">
            <input id="ct-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          {dialog === "feedback" && (
            <Field label="Сообщение" htmlFor="ct-text" error={tried ? errors.text : ""}>
              <textarea id="ct-text" rows={4} value={text} onChange={(e) => setText(e.target.value)} className={inputCls} />
            </Field>
          )}
          <a
            href={valid ? whatsappLink(WHATSAPP, message.filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n").trim()) : undefined}
            target="_blank"
            rel="noopener"
            role="button"
            onClick={(e) => {
              if (!valid) {
                e.preventDefault();
                setTried(true);
              } else onClose();
            }}
            className="mt-1 flex min-h-13 items-center justify-center rounded-full bg-mint-deep px-6 text-base font-medium text-white transition-colors hover:bg-mint-deeper"
          >
            {copy.button}
          </a>
          <p className="text-center text-sm text-ink-soft">
            Или позвоните сами:{" "}
            <a className="tabular font-medium text-ink underline-offset-4 hover:underline" href={`tel:${PHONES[0].tel}`}>
              {PHONES[0].display}
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
