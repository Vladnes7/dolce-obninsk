"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type OrderLine = {
  key: string; // slug + вариант
  name: string;
  variant?: string;
  price: number;
  qty: number;
};

type OrderState = {
  lines: OrderLine[];
  count: number;
  total: number;
  add: (line: Omit<OrderLine, "qty">) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<OrderState | null>(null);
const STORAGE = "dolce-order-v1";

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [open, setOpen] = useState(false);

  // Черновик заявки — удобство для посетителя, без него сайт работает так же.
  const restored = useRef(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(STORAGE);
        if (saved) setLines(JSON.parse(saved));
      } catch {}
      restored.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    if (!restored.current) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add = useCallback((line: Omit<OrderLine, "qty">) => {
    setLines((prev) => {
      const found = prev.find((l) => l.key === line.key);
      if (found) return prev.map((l) => (l.key === line.key ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { ...line, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l))));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
    return { lines, count, total, add, setQty, clear, open, setOpen };
  }, [lines, add, setQty, clear, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrder() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useOrder вне OrderProvider");
  return v;
}

export function whatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
