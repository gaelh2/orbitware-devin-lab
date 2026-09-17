const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === "string" ? Number(amount.replace(",", ".")) : amount;
  return currencyFormatter.format(numericAmount);
}

export function formatDate(date: Date | string): string {
  return dateFormatter.format(typeof date === "string" ? new Date(date) : date);
}
