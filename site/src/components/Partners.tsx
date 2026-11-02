"use client";

import Image from "next/image";
import { useState } from "react";
import { WHATSAPP } from "@/data/site";
import { whatsappLink } from "./order/OrderContext";
import { Field, inputCls, phoneOk } from "./order/fields";
import { LineReveal, Reveal } from "./Reveal";

// Блок «Приглашаем к сотрудничеству» со старого сайта, текст дословно.
export function Partners() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);

  const errors = {
    name: name.trim() ? "" : "Напишите, как к вам обращаться",
    phone: phoneOk(phone) ? "" : "Нужен номер телефона",
    email: email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()) ? "Проверьте адрес почты" : "",
  };
  const valid = Object.values(errors).every((e) => !e);
  const message = [
    "Здравствуйте! Хочу обсудить сотрудничество: реализация продукции Dolce.",
    "",
    `Имя: ${name.trim()}`,
    `Телефон: ${phone}`,
    email.trim() ? `E-mail: ${email.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section id="partners" className="scallop-top relative bg-mint-light py-20 md:py-28">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal className="overflow-hidden rounded-3xl max-lg:order-last">
          <div className="relative aspect-[4/3] lg:aspect-[1/1]">
            <Image src="/img/strawberry.jpg" alt="Свежая клубника в ладонях" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <div className="min-w-0">
          <p className="caps mb-4 flex items-center gap-3 text-mint-deep"><span aria-hidden="true" className="size-1.5 rotate-45 bg-current" />Сотрудничество</p>
          <LineReveal className="font-display text-[clamp(1.5rem,8.6vw,2rem)] font-medium leading-[1.08] tracking-[-0.02em] md:text-5xl" lines={["Приглашаем", "к сотрудничеству"]} />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/85">
              Приглашаем принять участие в реализации продукции брендовой кондитерской Dolce. Если вам интересно наше предложение, оставьте свои
              контакты, мы обязательно свяжемся с вами и обсудим условия сотрудничества.
            </p>
            <form className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
              <Field label="Имя" htmlFor="p-name" error={tried ? errors.name : ""}>
                <input id="p-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Телефон" htmlFor="p-phone" error={tried ? errors.phone : ""}>
                <input id="p-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+7" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="E-mail" htmlFor="p-email" hint="Необязательно" error={tried ? errors.email : ""}>
                  <input id="p-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </Field>
              </div>
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
                className="inline-flex min-h-13 items-center justify-center rounded-full bg-ink px-8 text-base font-medium text-white transition-colors hover:bg-ink-2 sm:col-span-2 sm:justify-self-start"
              >
                Отправить в WhatsApp
              </a>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
