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
