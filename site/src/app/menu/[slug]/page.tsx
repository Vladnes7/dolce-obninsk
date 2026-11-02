import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactProvider } from "@/components/Contact";
import { DishBuy } from "@/components/dish/DishBuy";
import { DishGallery } from "@/components/dish/DishGallery";
import { Header } from "@/components/Header";
import { OrderDrawer } from "@/components/order/OrderDrawer";
import { Footer } from "@/components/Sections";
import { MENU, SECTIONS, splitMark } from "@/data/menu";
import { rub } from "@/data/site";

export function generateStaticParams() {
  return MENU.map((i) => ({ slug: i.slug }));
}

const find = (slug: string) => MENU.find((i) => i.slug === slug);

export async function generateMetadata({ params }: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const item = find((await params).slug);
  if (!item) return {};
  const description = item.full?.[0] ?? item.short ?? `${item.name} из кондитерской Dolce в Обнинске`;
  return {
    title: `${item.name}: ${rub(item.price)} — кондитерская Dolce, Обнинск`,
    description,
    openGraph: { title: item.name, description, images: item.img ? [{ url: item.img }] : undefined },
  };
}

export default async function DishPage({ params }: PageProps<"/menu/[slug]">) {
  const item = find((await params).slug);
  if (!item) notFound();

  const section = SECTIONS.find((s) => s.id === item.section)!;
  const { weight, badge } = splitMark(item.mark);
  const tag = item.vegan ? "Веган" : badge;
  const photos = item.photos?.length ? item.photos : [item.img!, ...(item.img2 ? [item.img2] : [])];
  const text = item.full ?? (item.short && !item.short.startsWith("Ккал") ? [item.short] : []);
  const n = item.nutrition;
  const kcal = n?.kcal ?? item.kcal;
  const facts = [
    { label: "Ккал", value: kcal },
    { label: "Белки, г", value: n?.protein },
    { label: "Жиры, г", value: n?.fat },
    { label: "Углеводы, г", value: n?.carbs },
  ].filter((f) => f.value);
  const more = MENU.filter((i) => i.section === item.section && i.slug !== item.slug).slice(0, 4);

  return (
    <ContactProvider>
      <Header />
      <main className="bg-white pt-16 md:pt-[76px]">
        <div className="mx-auto max-w-[1320px] md:px-8 md:pt-6 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14 lg:pt-10">
          <DishGallery photos={photos} name={item.name} badge={tag} />

          <div className="dish-text-in px-4 pb-4 pt-6 md:px-0 lg:sticky lg:top-28 lg:self-start lg:pt-2">
            <nav aria-label="Навигация" className="flex items-center gap-2 text-sm text-ink-soft">
              <Link href="/#catalog" className="inline-flex min-h-11 items-center gap-1.5 font-medium text-mint-deeper hover:text-ink">
                <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
                  <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Каталог
              </Link>
              <span aria-hidden="true" className="size-1 rotate-45 bg-mint-deep" />
              <span>{section.label}</span>
            </nav>

            <h1 className="mt-2 font-display text-[2.2rem] font-medium leading-[1.06] tracking-[-0.015em] md:text-5xl">{item.name}</h1>
            {(weight || item.weightNote) && <p className="mt-3 text-[15px] text-ink-soft">{weight ?? item.weightNote}</p>}

            <DishBuy item={item} />

            {text.length > 0 && (
              <div className="mt-9 max-w-prose space-y-3 border-t border-line pt-7 text-[17px] leading-relaxed text-ink">
                {text.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}

            {item.composition && (
              <div className="mt-7 max-w-prose">
                <h2 className="caps text-mint-deep">Состав</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.composition}</p>
              </div>
            )}

            {facts.length > 0 && (
              <div className="mt-7">
                <h2 className="caps text-mint-deep">На 100 г</h2>
                <dl className="mt-3 grid max-w-md grid-cols-4 divide-x divide-line rounded-2xl bg-mint-light/70 py-3">
                  {facts.map((f) => (
                    <div key={f.label} className="flex flex-col-reverse items-center gap-0.5 px-1 text-center">
                      <dt className="text-xs text-ink-soft">{f.label}</dt>
                      <dd className="tabular font-display text-xl font-semibold">{f.value!.replace(".", ",")}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {more.length > 0 && (
          <section aria-labelledby="more-title" className="mx-auto mt-16 max-w-[1320px] px-4 pb-20 md:mt-24 md:px-8 md:pb-28">
            <div className="flex items-end justify-between gap-4">
              <h2 id="more-title" className="font-display text-[1.9rem] font-medium leading-[1.1] md:text-4xl">
                Ещё <em className="font-normal italic text-mint-deep">{section.label.toLowerCase()}</em>
              </h2>
              <Link href="/#catalog" className="hidden min-h-11 items-center text-[15px] font-medium text-mint-deeper hover:text-ink sm:inline-flex">
                Весь каталог
              </Link>
            </div>
            <ul className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-6">
              {more.map((m) => (
                <li key={m.slug}>
                  <Link href={`/menu/${m.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-mint-light transition-transform duration-200 ease-out group-active:scale-[0.97]">
                      <Image
                        src={m.img!}
                        alt={m.name}
                        fill
                        loading="lazy"
                        sizes="(min-width: 1320px) 300px, (min-width: 768px) 25vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="mt-3 text-[15px] font-medium leading-snug group-hover:text-mint-deeper md:text-base">{m.name}</p>
                    <p className="tabular mt-1 font-display text-lg font-semibold">{rub(m.variants?.[0]?.price ?? m.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
      <OrderDrawer />
    </ContactProvider>
  );
}
