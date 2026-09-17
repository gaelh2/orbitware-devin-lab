import type { OrderLine } from "@/lib/types";

function toMoney(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

export function isValidDiscountPct(discountPct: number): boolean {
  if (!Number.isFinite(discountPct)) return false;
  return discountPct >= 0 && discountPct <= 100;
}

export function buildOrderSummary(lines: OrderLine[], discountPct: number) {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
  const discount = Math.round(subtotal * (discountPct / 100));
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.16);
  const total = taxable + tax;

  return {
    subtotal,
    discount,
    taxable,
    tax,
    total,
    display: {
      subtotal: toMoney(subtotal),
      discount: toMoney(discount),
      taxable: toMoney(taxable),
      tax: toMoney(tax),
      total: toMoney(total),
    },
  };
}
