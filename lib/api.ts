import productsData from "@/mocks/products.json";

import type { Product } from "@/lib/types";

const API_DELAY_MS = 600;
const products: Product[] = productsData;
let apiFailureEnabled = false;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));
}

async function simulateRequest(): Promise<void> {
  await delay();

  if (apiFailureEnabled) {
    throw new Error("No se pudo conectar con el catálogo de productos.");
  }
}

export function setApiFailure(enabled: boolean): void {
  apiFailureEnabled = enabled;
}

export async function searchProducts(query: string): Promise<Product[]> {
  await simulateRequest();
  const normalizedQuery = query.trim().toLocaleLowerCase("es");

  if (!normalizedQuery) {
    return [...products];
  }

  return products.filter(
    ({ name, sku }) =>
      name.toLocaleLowerCase("es").includes(normalizedQuery) ||
      sku.toLocaleLowerCase("es").includes(normalizedQuery),
  );
}

export async function getProduct(id: string): Promise<Product | null> {
  await simulateRequest();
  return products.find((product) => product.id === id) ?? null;
}
