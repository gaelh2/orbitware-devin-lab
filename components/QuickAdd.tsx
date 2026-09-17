"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { searchProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

const currencyFmt = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

function isValidQuantity(quantity: number, stock: number): boolean {
  if (!Number.isFinite(quantity) || !Number.isInteger(quantity)) return false;
  return quantity >= 1 && quantity <= stock;
}

export function QuickAdd() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const searchQuery = query.trim();
    const request = ++requestId.current;

    if (!searchQuery || selectedProduct?.name === query) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);

      searchProducts(searchQuery)
        .then((products) => {
          if (request !== requestId.current) return;
          setResults(products);
        })
        .catch((searchError) => {
          if (request !== requestId.current) return;
          setResults([]);
          setError(
            searchError instanceof Error
              ? searchError.message
              : "Ocurrió un error inesperado.",
          );
        })
        .finally(() => {
          if (request === requestId.current) setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, selectedProduct]);

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setSelectedProduct(null);
    setConfirmation(null);
  }

  function handleProductChange(product: Product) {
    setSelectedProduct(product);
    setQuery(product.name);
    setResults([]);
    setQuantity("1");
    setConfirmation(null);
  }

  function handleAdd() {
    if (!selectedProduct) return;

    const parsedQuantity = Number(quantity);
    if (!isValidQuantity(parsedQuantity, selectedProduct.stock)) return;

    setConfirmation(`${parsedQuantity} × ${selectedProduct.name} agregado al pedido.`);
  }

  const parsedQuantity = Number(quantity);
  const quantityIsValid = selectedProduct
    ? isValidQuantity(parsedQuantity, selectedProduct.stock)
    : false;

  return (
    <Card className="mt-8">
      <p className="text-sm font-semibold text-blue-700">Captura rápida</p>
      <h2 className="mt-1 text-xl font-bold text-slate-950">Agregar producto</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_9rem_auto] sm:items-end">
        <div className="relative">
          <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="quick-add-search">
            Producto
          </label>
          <input
            id="quick-add-search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Buscar por nombre o SKU…"
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-2 focus:outline-blue-200"
          />
          {(loading || error || results.length > 0) && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              {loading && <Spinner className="p-3" label="Buscando…" />}
              {error && <p className="p-3 text-sm text-red-700">{error}</p>}
              {!loading && !error && results.length > 0 && (
                <ul className="space-y-1">
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => handleProductChange(product)}
                        className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left hover:bg-slate-50"
                      >
                        <span>
                          <span className="block font-medium text-slate-900">{product.name}</span>
                          <span className="font-mono text-xs text-slate-500">{product.sku}</span>
                        </span>
                        <span className="text-sm text-slate-700">
                          {currencyFmt.format(Number(String(product.price).replace(",", ".")))}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="quick-add-quantity">
            Cantidad
          </label>
          <input
            id="quick-add-quantity"
            type="number"
            min={1}
            max={selectedProduct?.stock}
            step={1}
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value);
              setConfirmation(null);
            }}
            disabled={!selectedProduct}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-2 focus:outline-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Button onClick={handleAdd} disabled={!quantityIsValid}>
          Agregar
        </Button>
      </div>
      {selectedProduct && !quantityIsValid && (
        <p className="mt-3 text-sm text-red-700">
          La cantidad debe ser un entero entre 1 y {selectedProduct.stock}.
        </p>
      )}
      {confirmation && <p className="mt-3 text-sm font-medium text-emerald-700" role="status">{confirmation}</p>}
    </Card>
  );
}
