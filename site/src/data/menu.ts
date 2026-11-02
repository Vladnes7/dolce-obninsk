import raw from "./menu.json";

export type MenuItem = {
  slug: string;
  name: string;
  section: SectionId;
  price: number;
  mark?: string;
  short?: string;
  kcal?: string;
  variants?: { label: string; price: number }[];
  vegan?: boolean;
  limited?: boolean;
  img?: string;
  img2?: string;
  /** Абзацы полного описания (только если отличается от short). */
  full?: string[];
  composition?: string;
  weightNote?: string;
  nutrition?: { kcal?: string; protein?: string; fat?: string; carbs?: string };
  /** Все фото блюда для страницы /menu/[slug]. */
  photos?: string[];
};

export const SECTIONS = [
  { id: "cakes", label: "Торты" },
  { id: "desserts", label: "Пирожные" },
  { id: "jars", label: "В баночках" },
  { id: "pastry", label: "Выпечка" },
  { id: "pies", label: "Пироги" },
  { id: "bread", label: "Хлеб" },
  { id: "candy", label: "Конфеты" },
  { id: "cookies", label: "Печенье" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

// Карточки без фото на сайт не выводим (сейчас это только «Картошка»).
export const MENU = (raw as MenuItem[]).filter((i) => i.img);

// Пометка с карточки: вес/куски показываем как «вес», слова — как бейдж.
export function splitMark(mark?: string) {
  if (!mark) return {};
  if (/\d/.test(mark)) return { weight: mark };
  const badge = /^new$|новинка/i.test(mark) ? "Новинка" : mark[0] + mark.slice(1).toLowerCase();
  return { badge };
}
