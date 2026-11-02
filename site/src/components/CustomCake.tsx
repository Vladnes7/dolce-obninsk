"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BENTO, CUSTOM_CAKE, PHONES, WHATSAPP, rub } from "@/data/site";
import { useOrder, whatsappLink } from "./order/OrderContext";
import { DeliveryFields, deliveryErrors, deliveryLines, useDelivery } from "./order/DeliveryFields";
import { Choice, Field, inputCls, phoneOk, selectCls } from "./order/fields";
import { Eyebrow, ScriptWord, Terrazzo } from "./Decor";
import { EASE, LineReveal, Reveal } from "./Reveal";

export function Bento() {
  const { add, setOpen } = useOrder();
  const [text, setText] = useState("");
  const [d, setD, earliest] = useDelivery(BENTO.leadDays);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);

  const errors: Record<string, string> = {
    ...deliveryErrors(d, earliest),
    name: name.trim() ? "" : "Напишите, как к вам обращаться",
    phone: phoneOk(phone) ? "" : "Нужен номер, чтобы подтвердить заказ",
  };
  const valid = Object.values(errors).every((e) => !e);
  const shown = tried ? errors : {};

  const message = [
    "Здравствуйте! Хочу заказать бенто-торт.",
    "",
    `Бенто-торт ${BENTO.weight} — ${rub(BENTO.price)}`,
    text.trim() ? `Надпись: ${text.trim()}` : "",
    ...deliveryLines(d),
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    "",
    "Фото с примером рисунка пришлю следующим сообщением.",
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n")
    .trim();

  return (
    <section id="bento" className="scallop-top relative overflow-x-clip bg-mint-light py-20 md:py-28">
      <Terrazzo seed={21} count={38} />
      <div className="relative mx-auto grid max-w-[1320px] gap-10 px-4 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Форма длинная — левая колонка едет рядом, чтобы не оставлять пустоту. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>Мини-торт в подарок</Eyebrow>
          <LineReveal
            className="font-display text-[2.2rem] font-medium leading-[1.06] tracking-[-0.015em] md:text-6xl"
            lines={[
              "Бенто-торт",
              <em key="i" className="font-normal italic text-mint-deep">
                с вашей надписью
              </em>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/85">
              Миниатюрный торт из шоколадного бисквита с крем-чизом. Лаконичная красота и приятное послание порадуют близкого человека.
            </p>
            {/* Табличка: как ценник в витрине, в золотой двойной рамке. */}
            <div className="relative mt-8 max-w-md -rotate-1 rounded-[26px] bg-white p-1.5 shadow-[0_20px_40px_-24px_rgba(35,99,93,0.4)] ring-2 ring-mint-deep">
              <dl className="grid grid-cols-3 gap-3 rounded-[20px] border border-dashed border-mint px-5 py-5">
                <div>
                  <dt className="caps !text-[0.62rem] text-mint-deep">Вес</dt>
                  <dd className="mt-1 font-display text-xl font-medium">{BENTO.weight}</dd>
                </div>
                <div>
                  <dt className="caps !text-[0.62rem] text-mint-deep">Готовим</dt>
                  <dd className="mt-1 font-display text-xl font-medium">за {BENTO.leadDays} дня</dd>
                </div>
                <div>
                  <dt className="caps !text-[0.62rem] text-mint-deep">Цена</dt>
                  <dd className="tabular mt-1 font-display text-xl font-semibold text-mint-deeper">{rub(BENTO.price)}</dd>
                </div>
              </dl>
              <span aria-hidden="true" className="script absolute -right-3 -top-7 rotate-[8deg] text-5xl text-mint-deep">
                bento
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 overflow-hidden rounded-3xl border-[6px] border-white shadow-[0_24px_50px_-28px_rgba(74,59,49,0.5)]">
            <Image src="/img/bento.jpg" alt="Бенто-торт с рисунком на белой тарелке" width={1680} height={1121} sizes="(min-width: 1024px) 600px, 100vw" className="h-auto w-full lg:aspect-[16/9] lg:object-cover" />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-[0_24px_60px_-36px_rgba(35,99,93,0.35)] md:p-8" onSubmit={(e) => e.preventDefault()} noValidate aria-labelledby="bento-form-title">
            <div>
              <h3 id="bento-form-title" className="font-display text-xl font-medium">
                Заказать бенто-торт
              </h3>
              <p className="mt-1 text-[15px] text-ink-soft">Фото с примером рисунка пришлёте следом в WhatsApp.</p>
            </div>
            <Field label="Надпись на торте" htmlFor="b-text" hint="Короткая фраза или имя">
              <input id="b-text" value={text} onChange={(e) => setText(e.target.value)} className={inputCls} placeholder="С днём рождения, мама!" />
            </Field>
            <DeliveryFields id="b" d={d} set={setD} errors={shown} earliest={earliest} dateHint={`Готовим за ${BENTO.leadDays} дня`} />
            <Field label="Ваше имя" htmlFor="b-name" error={shown.name}>
              <input id="b-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Телефон" htmlFor="b-phone" error={shown.phone}>
              <input id="b-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+7" />
            </Field>
            <div className="mt-1 flex flex-col gap-3">
              <a
                href={valid ? whatsappLink(WHATSAPP, message) : undefined}
                target="_blank"
                rel="noopener"
                role="button"
                onClick={(e) => {
                  if (!valid) {
                    e.preventDefault();
                    setTried(true);
                  }
                }}
                className="flex min-h-14 items-center justify-center rounded-full bg-mint-deeper px-8 text-base font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.98]"
              >
                Заказать за {rub(BENTO.price)}
              </a>
              {tried && !valid && (
                <p className="text-center text-sm text-[#b3261e]" role="alert">
                  Заполните отмеченные поля выше
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  add({ key: "bento", name: "Бенто-торт", variant: BENTO.weight, price: BENTO.price });
                  setOpen(true);
                }}
                className="min-h-11 text-[15px] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
              >
                или добавить в общую заявку вместе с десертами
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

const STEPS = ["Торт", "Когда и где", "Контакты"];

export function CustomCake() {
  const [step, setStep] = useState(0);
  const [flavor, setFlavor] = useState(CUSTOM_CAKE.flavors[0]);
  const [kg, setKg] = useState(2);
  const [tier, setTier] = useState(CUSTOM_CAKE.tiers[0]);
  const [d, setD, earliest] = useDelivery();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wishes, setWishes] = useState("");
  const [tried, setTried] = useState(false);

  const errors = [
    {},
    deliveryErrors(d, earliest),
    {
      name: name.trim() ? "" : "Напишите, как к вам обращаться",
      phone: phoneOk(phone) ? "" : "Нужен номер, чтобы кондитер связался с вами",
    },
  ] as Record<string, string>[];
  const stepOk = (i: number) => Object.values(errors[i]).every((e) => !e);
  const estimate = Math.round(kg * CUSTOM_CAKE.pricePerKg);

  const message = [
    "Здравствуйте! Хочу заказать торт по своему дизайну.",
    "",
    `Вкус: ${flavor}`,
    `Вес: ${kg.toString().replace(".", ",")} кг, ${tier}`,
    `Ориентировочно: ${rub(estimate)}`,
    ...deliveryLines(d),
    wishes ? `Пожелания: ${wishes}` : "",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    "",
    "Фото примера оформления пришлю следующим сообщением.",
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n")
    .trim();

  const next = () => {
    if (!stepOk(step)) return setTried(true);
    setTried(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  return (
    <section id="custom" className="scallop-top relative bg-mint-deeper py-20 text-white md:py-28">
      <Terrazzo seed={5} count={30} tone="light" className="opacity-30" />
      <div className="relative mx-auto grid max-w-[1320px] gap-12 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow className="text-mint-light">Торт на заказ</Eyebrow>
          <LineReveal
            className="font-display text-[2.2rem] font-medium leading-[1.06] tracking-[-0.015em] md:text-6xl"
            lines={[
              "Торт по вашему",
              <em key="i" className="font-normal italic text-mint">
                дизайну
              </em>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
              Индивидуально приготовленный торт от лучшего кондитера Калужской области. {rub(CUSTOM_CAKE.pricePerKg)} за кг, сложные заказы
              принимаем не менее чем за неделю.
            </p>
          </Reveal>
          <Reveal delay={0.15} as="figure" className="mt-10 grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-end gap-4 md:max-w-xl">
            {/* Арка, как ниши в зале кофейни. */}
            <div className="overflow-hidden rounded-t-full border-[5px] border-mint">
              <Image src="/img/chef.jpg" alt="Шеф-кондитер Нина Сторожко с тортом" width={1344} height={1680} sizes="(min-width: 1024px) 260px, 45vw" className="aspect-[3/4] h-auto w-full object-cover" />
            </div>
            <figcaption className="pb-1">
              <p className="text-[2.6rem] leading-none text-mint">
                <ScriptWord>Нина Сторожко</ScriptWord>
              </p>
              <p className="caps mt-3 !text-[0.62rem] text-white/70">шеф-кондитер</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/75">
                Дважды признана лучшим кондитером Калужской области в конкурсе «Лучший по профессии» — в 2018 и 2021 годах.
              </p>
            </figcaption>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-white p-5 text-ink md:p-8">
            <ol className="flex gap-2" aria-label="Шаги заказа">
              {STEPS.map((s, i) => (
                <li key={s} className="flex-1">
                  <button
                    type="button"
                    disabled={i > step}
                    onClick={() => i < step && setStep(i)}
                    aria-current={i === step ? "step" : undefined}
                    className="min-h-11 w-full text-left disabled:cursor-default"
                  >
                    <span className="block h-1 overflow-hidden rounded-full bg-mint-light">
                      <motion.span className="block h-full bg-mint-deep" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.5, ease: EASE }} />
                    </span>
                    <span className={`mt-2 block text-sm ${i === step ? "font-medium text-ink" : "text-ink-soft"}`}>
                      {i + 1}. {s}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <form className="mt-7" onSubmit={(e) => e.preventDefault()} noValidate>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex flex-col gap-5"
                >
                  {step === 0 && (
                    <>
                      <Field label="Вкус" htmlFor="c-flavor">
                        <select id="c-flavor" value={flavor} onChange={(e) => setFlavor(e.target.value)} className={`${inputCls} ${selectCls}`}>
                          {CUSTOM_CAKE.flavors.map((f) => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Вес" htmlFor="c-kg" hint="Итоговую цену подтвердит кондитер">
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => setKg((k) => Math.max(1, k - 0.5))} className="grid size-12 place-items-center rounded-full border border-ink/15 text-xl" aria-label="Меньше на 0,5 кг">
                            −
                          </button>
                          <output id="c-kg" className="tabular min-w-20 text-center font-display text-2xl font-medium">
                            {kg.toString().replace(".", ",")} кг
                          </output>
                          <button type="button" onClick={() => setKg((k) => Math.min(15, k + 0.5))} className="grid size-12 place-items-center rounded-full border border-ink/15 text-xl" aria-label="Больше на 0,5 кг">
                            +
                          </button>
                        </div>
                      </Field>
                      <fieldset className="grid gap-2 sm:grid-cols-2">
                        <legend className="mb-1.5 text-sm font-medium">Ярусы</legend>
                        {CUSTOM_CAKE.tiers.map((t) => (
                          <Choice key={t} name="c-tier" value={t} checked={tier === t} onChange={setTier}>
                            {t}
                          </Choice>
                        ))}
                      </fieldset>
                      <div className="flex items-baseline justify-between rounded-2xl bg-mint-light px-4 py-3 ring-1 ring-mint">
                        <span className="text-ink-soft">Ориентировочно</span>
                        <span className="tabular font-display text-xl font-medium">{rub(estimate)}</span>
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <DeliveryFields id="c" d={d} set={setD} errors={tried ? errors[1] : {}} earliest={earliest} dateHint="Сложный дизайн — не менее чем за неделю" />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <Field label="Пожелания" htmlFor="c-wish" hint="Повод, надпись, цвета. Фото примера пришлёте в WhatsApp">
                        <textarea id="c-wish" rows={3} value={wishes} onChange={(e) => setWishes(e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="Ваше имя" htmlFor="c-name" error={tried ? errors[2].name : ""}>
                        <input id="c-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="Телефон" htmlFor="c-phone" error={tried ? errors[2].phone : ""}>
                        <input id="c-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+7" />
                      </Field>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep((s) => s - 1)} className="min-h-12 rounded-full px-5 text-base font-medium text-ink-soft hover:text-ink">
                    Назад
                  </button>
                ) : (
                  <a href={`tel:${PHONES[0].tel}`} className="min-h-12 content-center px-1 text-[15px] text-ink-soft hover:text-ink">
                    Удобнее по телефону: <span className="tabular whitespace-nowrap font-medium text-ink">{PHONES[0].display}</span>
                  </a>
                )}
                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={next} className="inline-flex min-h-13 items-center justify-center rounded-full bg-ink px-8 text-base font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-ink-2 active:scale-[0.97]">
                    Дальше
                  </button>
                ) : (
                  <a
                    href={stepOk(2) ? whatsappLink(WHATSAPP, message) : undefined}
                    target="_blank"
                    rel="noopener"
                    role="button"
                    onClick={(e) => {
                      if (!stepOk(2)) {
                        e.preventDefault();
                        setTried(true);
                      }
                    }}
                    className="inline-flex min-h-13 items-center justify-center rounded-full bg-mint-deeper px-8 text-base font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97]"
                  >
                    Отправить в WhatsApp
                  </a>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
