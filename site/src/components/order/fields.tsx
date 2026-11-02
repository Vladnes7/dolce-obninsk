import { useSyncExternalStore, type ReactNode } from "react";

// Общие поля форм. Шрифт 16px, чтобы iOS не зумил страницу при фокусе.
export const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-soft/70 transition-colors focus:border-mint-deep focus:outline-none focus:ring-2 focus:ring-mint/60";

// Safari игнорирует отступы у нативного select: убираем системный вид и рисуем свою стрелку.
export const selectCls =
  "min-h-12 appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%233a3a38' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E\")] bg-[length:12px_8px] bg-[position:right_1rem_center] bg-no-repeat pr-10";

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-[#b3261e]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-ink-soft">{hint}</p>
      ) : null}
    </div>
  );
}

export function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base transition-colors ${
        checked ? "border-mint-deep bg-mint-light" : "border-ink/15 bg-white hover:border-ink/30"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="size-4 shrink-0 accent-[#2c7a73]"
      />
      <span>{children}</span>
    </label>
  );
}

// Ближайшая дата заказа: завтра (день в день не принимаем), или через N дней.
export function minDate(daysAhead = 1) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

// В браузере — сегодняшняя дата, при сборке страницы — пусто (иначе в HTML застынет дата сборки).
const noop = () => () => {};
export function useMinDate(daysAhead = 1) {
  return useSyncExternalStore(noop, () => minDate(daysAhead), () => "");
}

export function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export const phoneOk = (v: string) => v.replace(/\D/g, "").length >= 10;
