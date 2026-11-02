"use client";

import { useState } from "react";
import { DELIVERY_HOURS, DELIVERY_ZONES, SHOPS, rub } from "@/data/site";
import { Choice, Field, formatDate, inputCls, selectCls, useMinDate } from "./fields";

// Общий блок «когда и куда» для заявки из каталога, бенто-торта и торта на заказ.
export type Delivery = {
  date: string;
  time: string;
  how: string; // id точки самовывоза или "delivery"
  town: string;
  street: string;
  house: string;
  entrance: string;
  floor: string;
  flat: string;
  pay: "card" | "cash";
  change: string;
  cutlery: boolean;
};

const EMPTY: Delivery = {
  date: "",
  time: "",
  how: SHOPS[0].id,
  town: "Обнинск",
  street: "",
  house: "",
  entrance: "",
  floor: "",
  flat: "",
  pay: "card",
  change: "",
  cutlery: false,
};

const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

// Доставка — окно курьера целиком, самовывоз — до часа до закрытия точки.
export function timeSlots(how: string) {
  const shop = SHOPS.find((s) => s.id === how);
  const [from, to] = shop?.pickupHours ? [shop.pickupHours[0], shop.pickupHours[1] - 1] : DELIVERY_HOURS;
  return Array.from({ length: to - from + 1 }, (_, i) => hh(from + i));
}

// minDays — за сколько дней минимум принимаем заказ; earliest — эта дата в формате input[type=date].
export function useDelivery(minDays = 1) {
  const [d, setD] = useState<Delivery>(EMPTY);
  const earliest = useMinDate(minDays);
  const set = (patch: Partial<Delivery>) =>
    setD((prev) => {
      const next = { ...prev, ...patch };
      if (next.time && !timeSlots(next.how).includes(next.time)) next.time = "";
      return next;
    });
  return [d, set, earliest] as const;
}

// earliest — из useMinDate: при сборке страницы пусто, проверка срока включается в браузере.
export function deliveryErrors(d: Delivery, earliest: string): Record<string, string> {
  const shop = SHOPS.find((s) => s.id === d.how);
  const day = d.date ? new Date(`${d.date}T12:00`).getDay() : -1;
  const closed = shop?.noPickupDays?.includes(day);
  const delivery = d.how === "delivery";
  return {
    date: !d.date
      ? "Выберите дату"
      : earliest && d.date < earliest
        ? `Ближайшая дата — ${formatDate(earliest)}`
        : closed
          ? `В этот день самовывоза здесь нет: ${shop!.hours.join(", ").toLowerCase()}`
          : "",
    time: d.time ? "" : "Выберите время",
    town: delivery && !d.town.trim() ? "Укажите населённый пункт" : "",
    street: delivery && !d.street.trim() ? "Укажите улицу" : "",
    house: delivery && !d.house.trim() ? "Укажите дом" : "",
  };
}

export function deliveryLines(d: Delivery) {
  const shop = SHOPS.find((s) => s.id === d.how);
  const address = [
    d.town,
    d.street,
    d.house && `д. ${d.house}`,
    d.entrance && `подъезд ${d.entrance}`,
    d.floor && `этаж ${d.floor}`,
    d.flat && `кв. ${d.flat}`,
  ]
    .filter(Boolean)
    .join(", ");
  return [
    `Дата: ${formatDate(d.date)}, к ${d.time}`,
    shop ? `Самовывоз: ${shop.address}${shop.pickupDiscount ? " (скидка 10%)" : ""}` : `Доставка: ${address}`,
    d.pay === "card" ? "Оплата: картой при получении" : `Оплата: наличными${d.change.trim() ? `, сдача с ${d.change.trim()} ₽` : ""}`,
    d.cutlery ? "Положить одноразовые ложку и вилку" : "",
  ].filter(Boolean);
}

export function DeliveryFields({
  id,
  d,
  set,
  errors,
  earliest,
  dateHint = "Заказы день в день не принимаем",
}: {
  id: string;
  d: Delivery;
  set: (patch: Partial<Delivery>) => void;
  errors: Record<string, string>;
  earliest: string;
  dateHint?: string;
}) {
  const slots = timeSlots(d.how);
  return (
    <>
      <div className="grid gap-4 min-[400px]:grid-cols-[1.3fr_1fr]">
        <Field label="Приготовить к дате" htmlFor={`${id}-date`} error={errors.date} hint={dateHint}>
          <input id={`${id}-date`} type="date" min={earliest || undefined} value={d.date} onChange={(e) => set({ date: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Ко времени" htmlFor={`${id}-time`} error={errors.time}>
          <select id={`${id}-time`} value={d.time} onChange={(e) => set({ time: e.target.value })} className={`${inputCls} ${selectCls}`}>
            <option value="" disabled>
              Время
            </option>
            {slots.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium">Доставка или самовывоз</legend>
        {SHOPS.map((s) => (
          <Choice key={s.id} name={`${id}-how`} value={s.id} checked={d.how === s.id} onChange={(how) => set({ how })}>
            Самовывоз: {s.address}
            {s.pickupDiscount ? <span className="text-mint-deep"> · скидка 10%</span> : null}
          </Choice>
        ))}
        <Choice name={`${id}-how`} value="delivery" checked={d.how === "delivery"} onChange={(how) => set({ how })}>
          Доставка курьером, {hh(DELIVERY_HOURS[0])}–{hh(DELIVERY_HOURS[1])}
        </Choice>
      </fieldset>

      {d.how === "delivery" && (
        <div className="flex flex-col gap-4 rounded-2xl bg-mint-light/60 p-4">
          <p className="text-sm text-ink-soft">
            Заказ на доставку — от {rub(DELIVERY_ZONES[0].min)} по Обнинску, дальше дороже. Время курьера согласует оператор.
          </p>
          <Field label="Населённый пункт" htmlFor={`${id}-town`} error={errors.town}>
            <input id={`${id}-town`} autoComplete="address-level2" value={d.town} onChange={(e) => set({ town: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Улица" htmlFor={`${id}-street`} error={errors.street}>
            <input id={`${id}-street`} autoComplete="address-line1" value={d.street} onChange={(e) => set({ street: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-4">
            <Field label="Дом" htmlFor={`${id}-house`} error={errors.house}>
              <input id={`${id}-house`} value={d.house} onChange={(e) => set({ house: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Подъезд" htmlFor={`${id}-entrance`}>
              <input id={`${id}-entrance`} inputMode="numeric" value={d.entrance} onChange={(e) => set({ entrance: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Этаж" htmlFor={`${id}-floor`}>
              <input id={`${id}-floor`} inputMode="numeric" value={d.floor} onChange={(e) => set({ floor: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Кв." htmlFor={`${id}-flat`}>
              <input id={`${id}-flat`} inputMode="numeric" value={d.flat} onChange={(e) => set({ flat: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </div>
      )}

      <fieldset className="grid gap-2 sm:grid-cols-2">
        <legend className="mb-1.5 text-sm font-medium">Оплата при получении</legend>
        <Choice name={`${id}-pay`} value="card" checked={d.pay === "card"} onChange={() => set({ pay: "card" })}>
          Картой
        </Choice>
        <Choice name={`${id}-pay`} value="cash" checked={d.pay === "cash"} onChange={() => set({ pay: "cash" })}>
          Наличными
        </Choice>
      </fieldset>
      {d.pay === "cash" && (
        <Field label="Сдача с" htmlFor={`${id}-change`} hint="Если без сдачи — оставьте пустым">
          <input id={`${id}-change`} inputMode="numeric" value={d.change} onChange={(e) => set({ change: e.target.value })} className={inputCls} placeholder="5000" />
        </Field>
      )}

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-base">
        <input type="checkbox" checked={d.cutlery} onChange={(e) => set({ cutlery: e.target.checked })} className="size-5 accent-[#2c7a73]" />
        Положить одноразовые ложку и вилку
      </label>
    </>
  );
}
