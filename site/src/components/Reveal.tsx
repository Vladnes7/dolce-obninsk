"use client";

import { motion, MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export const EASE = [0.23, 1, 0.32, 1] as const;

// Появление при скролле. Reduced motion (MotionConfig ниже): только прозрачность.
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "figure" | "article";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

// Заголовок, который раскрывается построчно из-под маски.
export function LineReveal({
  lines,
  className = "",
  delay = 0,
  inView = true,
  as = "h2",
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  inView?: boolean;
  as?: "h1" | "h2";
}) {
  // Наблюдаем за самим заголовком: строки под маской обрезаны и в IntersectionObserver не видны.
  const Tag = motion[as];
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } }
    : { animate: "show" };
  return (
    <Tag className={className} initial="hidden" {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function MotionRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Скрипт запустился: отключаем CSS-страховку из globals.css, дальше анимациями управляет Motion.
  useEffect(() => {
    document.documentElement.dataset.hydrated = "";
  }, []);
  // Фон под страницей («пружинка» iPhone): сверху в цвет первого экрана, ниже середины — в цвет подвала.
  useEffect(() => {
    const html = document.documentElement;
    const top = pathname === "/" ? "mint" : "white";
    const onScroll = () => {
      html.dataset.bg = window.scrollY > (html.scrollHeight - window.innerHeight) / 2 ? "ink" : top;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
