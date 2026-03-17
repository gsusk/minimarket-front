export function toNumber(value: string | number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function toCurrency(value: number, locale = "es-CO"): string {
  return value.toLocaleString(locale, { minimumFractionDigits: 0 });
}

export function formatDate(iso: string, locale = "es-CO"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
