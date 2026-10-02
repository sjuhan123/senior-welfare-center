import type { MealData } from '@common/shared';

export const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const shiftDate = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIso(date);
};

export const weekOf = (iso: string) => {
  const date = new Date(`${iso}T00:00:00`);
  const sunday = toIso(new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay()));
  return Array.from({ length: 7 }, (_, i) => shiftDate(sunday, i));
};

export const monthLabel = (month: string) => `${month.slice(0, 4)}년 ${Number(month.slice(5, 7))}월`;

export const dateLabel = (iso: string) => {
  const date = new Date(`${iso}T00:00:00`);
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${Number(iso.slice(8, 10))}일 ${weekday}`;
};

export type CalendarDay = {
  iso: string;
  num: number;
  dayOfWeek: number;
  inMonth: boolean;
  weekend: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasMeal: boolean;
  needsMeal: boolean;
  preview: string;
};

export const calendarDays = (month: string, selectedDate: string, todayIso: string, mealsByDate: Map<string, MealData>): CalendarDay[] => {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;
  const first = new Date(year, monthIndex, 1);
  const start = new Date(year, monthIndex, 1 - first.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const iso = toIso(date);
    const inMonth = date.getMonth() === monthIndex;
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const meal = mealsByDate.get(iso);

    return {
      iso,
      num: date.getDate(),
      dayOfWeek: date.getDay(),
      inMonth,
      weekend,
      isToday: iso === todayIso,
      isSelected: iso === selectedDate,
      hasMeal: !!meal && inMonth,
      needsMeal: !meal && inMonth && !weekend,
      preview: meal ? meal.items.slice(0, 3).join(', ') : '',
    };
  });
};
