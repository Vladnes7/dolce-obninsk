import Image from "next/image";
import { Eyebrow } from "./Decor";
import { Reveal } from "./Reveal";

// Редакционная подборка из сохранённых постов: дата и источник видны,
// наличие и цены сезонных позиций не выдаём за подтверждённые.
const STORIES = [
  {
    title: "Кофе с осенним характером",
    text: "Капучино «Булочка с корицей», какао «Буэно» и другие напитки из специального меню Dolce × ЭкоНива.",
    date: "14 октября 2026", iso: "2026-10-14", href: "https://t.me/dolcebiancogroup/895",
    position: "50% 100%", image: "/img/journal/cinnamon-cappuccino.webp", alt: "Капучино «Булочка с корицей» из публикации Dolce",
  },
  {
    title: "Маленькая тыква с секретом",
    text: "Шоколадный корпус, мусс крем-брюле, вишнёвая начинка и хрустящая крошка — знакомство с осенним десертом.",
    date: "26 октября 2026", iso: "2026-10-26", href: "https://t.me/dolcebiancogroup/909",
    position: "50% 50%", image: "/img/journal/pumpkin-dessert.webp", alt: "Пирожное «Тыква» на белой тарелке",
  },
  {
    title: "Сладкий повод для подарка",
    text: "Шоколад, печенье и конфеты: восемь видов сладостей ручной работы в одном подарочном наборе.",
    date: "15 октября 2026", iso: "2026-10-15", href: "https://t.me/dolcebiancogroup/902",
    position: "50% 0%", image: "/img/journal/sweet-gift.webp", alt: "Подарочная коробка со сладостями Dolce",
  },
];

export function Journal() {
  return (
    <section id="journal" aria-labelledby="journal-title" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Новинки и напитки</Eyebrow>
            <h2 id="journal-title" className="text-balance font-display text-[2.2rem] font-medium leading-[1.06] tracking-[-0.015em] md:text-6xl">Из дневника Dolce</h2>
          </div>
          <a href="https://t.me/dolcebiancogroup" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-fit shrink-0 items-center gap-3 text-[15px] font-medium text-mint-deeper underline decoration-mint/70 underline-offset-8 hover:decoration-mint-deep">Наш Telegram <span aria-hidden="true">↗</span></a>
        </div>
        <ul className="mt-9 grid gap-x-6 gap-y-10 md:mt-12 md:grid-cols-3">
          {STORIES.map((story, i) => (
            <Reveal as="li" key={story.href} delay={i * 0.06}>
              <a href={story.href} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mint-light">
                  <Image src={story.image} alt={story.alt} style={{ objectPosition: story.position }} fill sizes="(min-width: 1320px) 403px, (min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
                </div>
                <time dateTime={story.iso} className="mt-5 block text-xs text-ink-soft">{story.date}</time>
                <h3 className="mt-2 font-display text-2xl font-medium leading-tight group-hover:text-mint-deeper">{story.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{story.text}</p>
                <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-mint-deeper">Читать в Telegram <span aria-hidden="true">↗</span></span>
              </a>
            </Reveal>
          ))}
        </ul>
        <p className="mt-7 text-sm leading-relaxed text-ink-soft">Наличие сезонных десертов и меню напитков уточняйте в кофейне: на разных точках они могут отличаться.</p>
      </div>
    </section>
  );
}
