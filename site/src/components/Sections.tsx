import Link from "next/link";
import Image from "next/image";
import {
  CAFE_FEATURES,
  DELIVERY_ZONES,
  LEGAL,
  ORDER_RULES,
  PHONES,
  RATING,
  REVIEWS,
  SHOPS,
  SOCIALS,
  YANDEX_REVIEWS,
  rub,
} from "@/data/site";
import { ContactLink } from "./Contact";
import { Star } from "./Hero";
import { Logo } from "./Header";
import { Marquee } from "./Marquee";
import { Eyebrow, Terrazzo, Wordmark } from "./Decor";
import { LineReveal, Reveal } from "./Reveal";

const h2 = "font-display text-[2.2rem] font-medium leading-[1.06] tracking-[-0.015em] md:text-6xl";

export function Reviews() {
  const half = Math.ceil(REVIEWS.length / 2);
  const rows = [REVIEWS.slice(0, half), REVIEWS.slice(half)];
  return (
    <section id="reviews" className="scallop-top relative bg-butter py-20 md:py-28">
      <Terrazzo seed={31} count={34} tone="warm" />
      <div className="relative mx-auto flex max-w-[1320px] flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <Eyebrow className="text-gold-deep">Отзывы с Яндекс Карт</Eyebrow>
          <LineReveal
            className={h2}
            lines={[
              "За тортом",
              <em key="i" className="font-normal italic text-berry">
                только сюда
              </em>,
            ]}
          />
        </div>
        {/* Золотая плашка рейтинга: главный сигнал доверия, её видно издалека. */}
        <Reveal className="relative w-fit rotate-[1.5deg] rounded-[28px] bg-gold p-1.5 shadow-[0_24px_50px_-24px_rgba(138,90,18,0.7)]">
          <div className="rounded-[22px] border border-dashed border-ink/25 px-6 py-5 md:px-8">
            <p className="flex items-center gap-4 font-display text-6xl font-semibold leading-none md:text-7xl">
              {RATING.value}
              <span className="flex flex-col gap-1 font-sans text-sm font-medium leading-tight">
                <span className="flex" aria-label="5 звёзд">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-5" />
                  ))}
                </span>
                Яндекс Карты
              </span>
            </p>
            <p className="mt-3 text-[15px] font-medium">
              {new Intl.NumberFormat("ru-RU").format(RATING.count)} оценок · {RATING.award}
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-12 flex flex-col gap-4 overflow-hidden">
        {rows.map((row, r) => (
          <Marquee key={r} duration={r ? 70 : 60} className={r ? "[&_.marquee-track]:[animation-direction:reverse]" : ""}>
            {row.map((rev) => (
              <figure
                key={rev.date + rev.text.slice(0, 12)}
                className="mr-4 flex w-[300px] shrink-0 flex-col justify-between rounded-2xl border-t-4 border-gold bg-white p-5 shadow-[0_14px_30px_-22px_rgba(138,90,18,0.5)] md:w-[380px] md:p-6"
              >
                <blockquote className="text-[15px] leading-relaxed md:text-base">«{rev.text}»</blockquote>
                <figcaption className="mt-4 flex items-center justify-between text-sm text-ink-soft">
                  <span className="flex text-gold" aria-label="Оценка 5 из 5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-4" />
                    ))}
                  </span>
                  {rev.date}
                </figcaption>
              </figure>
            ))}
          </Marquee>
        ))}
      </div>

      <div className="relative mx-auto mt-10 max-w-[1320px] px-4 md:px-8">
        <a href={YANDEX_REVIEWS} target="_blank" rel="noopener" className="inline-flex min-h-13 items-center rounded-full bg-ink px-7 font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-ink-2 active:scale-[0.97]">
          Все 510 отзывов на Яндекс Картах
        </a>
      </div>
    </section>
  );
}

const GALLERY = [
  { src: "/img/interer-069.jpg", w: 1350, h: 1800, alt: "Зал кофейни: арки с зеркалами и бархатный диван", cls: "row-span-2" },
  { src: "/img/interer-029.jpg", w: 1800, h: 1350, alt: "Стойка у окна с видом на улицу", cls: "" },
  { src: "/img/interer-081.jpg", w: 1600, h: 1200, alt: "Витрина с тортами и пирожными", cls: "" },
  { src: "/img/interer-032.jpg", w: 1200, h: 1800, alt: "Кофемашина за стойкой", cls: "row-span-2" },
  { src: "/img/latte-cake.jpg", w: 1500, h: 1002, alt: "Латте и кусочек торта", cls: "" },
  { src: "/img/cups.jpg", w: 801, h: 1200, alt: "Стаканы для кофе навынос с логотипом Dolce", cls: "" },
];

export function Cafe() {
  return (
    <section id="cafe" className="scallop-top relative bg-mint py-20 md:py-28">
      <Terrazzo seed={41} count={40} tone="light" />
      <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow className="text-ink">Кофейня</Eyebrow>
            <LineReveal
              className={h2}
              lines={[
                "Зайти на кофе",
                <em key="i" className="font-normal italic">
                  с пирожным
                </em>,
              ]}
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/85">
                Зал с арками и терраццо на проспекте Маркса, 34. Кофе, чай и десерты можно взять с собой.
              </p>
              <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-1">
                {CAFE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 size-2 shrink-0 rotate-45 bg-mint-deep" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <ul className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:gap-4 lg:auto-rows-[230px]">
            {GALLERY.map((g, i) => (
              <Reveal
                as="li"
                key={g.src}
                delay={(i % 3) * 0.06}
                className={`relative overflow-hidden border-4 border-white ${g.cls ? "rounded-t-full rounded-b-2xl" : "rounded-2xl"} ${g.cls}`}
              >
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 400px, 50vw" className="object-cover transition-transform duration-700 hover:scale-[1.03]" />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Delivery() {
  return (
    <section id="delivery" className="scallop-top relative bg-mint-light py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1320px] gap-12 px-4 md:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <Eyebrow>Доставка и самовывоз</Eyebrow>
          <LineReveal
            className={h2}
            lines={[
              "Привезём торт",
              <em key="i" className="font-normal italic text-mint-deep">
                к празднику
              </em>,
            ]}
          />
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-col gap-4">
              {ORDER_RULES.map((r) => (
                <li key={r} className="flex gap-3 text-[17px] leading-relaxed">
                  <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rotate-45 bg-mint-deep" />
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-10 overflow-hidden rounded-2xl border-t-4 border-mint bg-white">
              <table className="w-full text-left text-[15px]">
                <caption className="px-5 pt-5 text-left font-display text-lg font-medium">Минимальная сумма доставки</caption>
                <thead className="sr-only">
                  <tr>
                    <th>Куда</th>
                    <th>Заказ от</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {DELIVERY_ZONES.map((z) => (
                    <tr key={z.zone}>
                      <td className="px-5 py-3.5">{z.zone}</td>
                      <td className="tabular whitespace-nowrap px-5 py-3.5 text-right font-medium">
                        от {rub(z.min)}
                        {z.note ? <span className="block text-sm font-normal text-ink-soft">{z.note}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="grid grid-cols-2 gap-3 self-start md:gap-4 lg:sticky lg:top-28">
          <div className="relative col-span-2 aspect-[4/3] overflow-hidden rounded-2xl sm:col-span-1 sm:aspect-[2/3]">
            <Image src="/img/boxes.jpg" alt="Мятные фирменные коробки Dolce в руках" fill sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="relative hidden aspect-[2/3] overflow-hidden rounded-2xl sm:block sm:translate-y-10">
            <Image src="/img/bakery.jpg" alt="Свежая выпечка упаковывается в бумажный пакет" fill sizes="(min-width: 1024px) 260px, 50vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Shops() {
  return (
    <section id="shops" className="scallop-top relative bg-white py-20 md:py-28">
      <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
        <Eyebrow>Адреса</Eyebrow>
        <h2 className={h2}>
          Три точки <Wordmark className="ml-1 h-[0.74em] text-mint-deep" />
        </h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SHOPS.map((s, i) => (
            <Reveal
              as="li"
              key={s.id}
              delay={i * 0.08}
              // На планшете две колонки, третья карточка во всю ширину: кнопкам «Маршрут» хватает места.
              className={`flex flex-col rounded-2xl border-t-4 border-mint bg-white p-6 shadow-[0_16px_36px_-28px_rgba(31,58,55,0.4)] ${
                i === SHOPS.length - 1 && SHOPS.length % 2 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <h3 className="font-display text-lg font-medium">{s.title}</h3>
              <p className="mt-3 text-[17px]">{s.address}</p>
              {s.note && <p className="mt-1 text-ink-soft">{s.note}</p>}
              <ul className="mb-6 mt-4 flex flex-col gap-1 text-[15px]">
                {s.hours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <a
                href={s.route}
                target="_blank"
                rel="noopener"
                className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 whitespace-nowrap rounded-full border border-mint-deep/25 bg-mint-light/60 pl-3 pr-4 text-sm font-medium text-mint-deeper transition-colors hover:border-mint-deep/50 hover:bg-mint-light"
              >
                <svg viewBox="0 0 20 20" className="size-4 shrink-0" aria-hidden="true">
                  <path fill="currentColor" d="M10 1.8a6 6 0 0 0-6 6c0 4.4 6 10.4 6 10.4s6-6 6-10.4a6 6 0 0 0-6-6Zm0 8.4a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Z" />
                </svg>
                Маршрут в Яндекс Картах
              </a>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-4 overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/9]">
            <Image src="/img/dolce-storefront-wide.webp" alt="Вход и вывеска кондитерской Dolce Bianco" fill sizes="(min-width: 1320px) 1256px, 100vw" className="object-contain bg-mint-light" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="scallop-top relative bg-ink pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16 text-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo inverse className="w-[190px]" />
          <p className="mt-3 max-w-xs text-white/70">Кофейня-кондитерская в Обнинске</p>
        </div>
        <div>
          <p className="text-sm text-white/60">Телефоны</p>
          <ul className="mt-1 flex flex-col">
            {PHONES.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="tabular inline-flex min-h-11 items-center text-lg font-medium hover:text-mint">
                  {p.display}
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${LEGAL.email}`} className="inline-flex min-h-11 items-center text-white/80 hover:text-mint">
            {LEGAL.email}
          </a>
        </div>
        <div>
          <p className="text-sm text-white/60">Мы в соцсетях</p>
          <ul className="mt-1 flex flex-col">
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center text-lg font-medium hover:text-mint">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm text-white/60">Связаться</p>
          <ul className="mt-1 flex flex-col">
            <li>
              <ContactLink dialog="callback" className="inline-flex min-h-11 items-center text-lg font-medium hover:text-mint">
                Заказать звонок
              </ContactLink>
            </li>
            <li>
              <ContactLink dialog="feedback" className="inline-flex min-h-11 items-center text-lg font-medium hover:text-mint">
                Обратная связь
              </ContactLink>
            </li>
            <li>
              <Link href="/#partners" className="inline-flex min-h-11 items-center text-lg font-medium hover:text-mint">
                Сотрудничество
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 max-w-[1320px] border-t border-white/10 px-4 pt-6 text-sm text-white/55 md:px-8">
        {LEGAL.company} · ИНН {LEGAL.inn} · ОГРН {LEGAL.ogrn}
      </div>
    </footer>
  );
}
