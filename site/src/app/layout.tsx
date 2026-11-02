import type { Metadata, Viewport } from "next";
import { Great_Vibes, Onest, Playfair_Display } from "next/font/google";
import { MotionRoot } from "@/components/Reveal";
import { OrderProvider } from "@/components/order/OrderContext";
import { PHONES, RATING, SHOPS } from "@/data/site";
import "./globals.css";

// Заголовки: контрастная антиква. Акцент: каллиграфия (ближайшая к «Amoresa» с кириллицей).
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const vibes = Great_Vibes({
  variable: "--font-vibes",
  subsets: ["latin", "cyrillic"],
  weight: "400",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dolcecake.ru"),
  // Демо до утверждения клиентом: не индексировать, чтобы не конкурировать со старым dolcecake.ru.
  robots: { index: false, follow: false },
  title: "Dolce: торты и десерты на заказ в Обнинске, кофейня-кондитерская",
  description:
    "Торты, пирожные, выпечка и хлеб от шеф-кондитера. Торт на заказ от 3 050 ₽/кг, бенто-торт, доставка по Обнинску. Пр-т Маркса, 34, ежедневно 09:00–21:00. Рейтинг " +
    RATING.value +
    " на Яндекс Картах.",
  openGraph: {
    title: "Dolce: торты и десерты на заказ в Обнинске",
    description: "Кофейня-кондитерская: торты из витрины и на заказ, доставка по Обнинску.",
    images: [{ url: "/img/hero.jpg", width: 1734, height: 2600 }],
    locale: "ru_RU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#86d3ca",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Dolce",
  url: "https://dolcecake.ru",
  telephone: PHONES[0].tel,
  image: "https://dolcecake.ru/img/hero.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "пр-т Маркса, 34",
    addressLocality: "Обнинск",
    addressCountry: "RU",
  },
  geo: { "@type": "GeoCoordinates", latitude: 55.11546, longitude: 36.59509 },
  openingHours: "Mo-Su 09:00-21:00",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", ratingCount: RATING.count },
  department: SHOPS.slice(1).map((s) => ({ "@type": "Bakery", name: "Dolce", address: s.address })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: при переходе между страницами Next прыгает наверх сразу, без плавной прокрутки.
    <html lang="ru" data-scroll-behavior="smooth" className={`${playfair.variable} ${vibes.variable} ${onest.variable}`}>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MotionRoot>
          <OrderProvider>{children}</OrderProvider>
        </MotionRoot>
      </body>
    </html>
  );
}
