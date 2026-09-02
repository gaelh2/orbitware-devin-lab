"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

import { getProduct, searchProducts } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

type ProductPickerProps = {
  value: string | null;
  onChange: (id: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
};

type PickerState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "success"; products: Product[] };

export function ProductPicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Buscar producto…",
}: ProductPickerProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<PickerState>({ status: "idle" });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRequestId = useRef(0);
  const resolveRequestId = useRef(0);
  const lastResolvedValue = useRef<string | null>(null);

  function performSearch(searchQuery: string, request: number) {
    setIsOpen(true);
    setState({ status: "loading" });
    setActiveIndex(null);

    searchProducts(searchQuery)
      .then((products) => {
        if (request !== searchRequestId.current) return;

        const available = products.filter((product) => product.stock > 0);

        if (available.length === 0) {
          setState({ status: "empty" });
        } else {
          setState({ status: "success", products: available });
          setActiveIndex(0);
        }
      })
      .catch((error) => {
        if (request !== searchRequestId.current) return;

        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
        });
      });
  }

  function handleSelect(product: Product) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    lastResolvedValue.current = product.id;
    setQuery(product.name);
    setIsOpen(false);
    setState({ status: "idle" });
    setActiveIndex(null);
    onChange(product.id);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setQuery(next);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!next.trim()) {
      setIsOpen(false);
      setState({ status: "idle" });
      setActiveIndex(null);
      return;
    }

    const request = ++searchRequestId.current;
    debounceRef.current = setTimeout(() => {
      performSearch(next, request);
    }, 300);
  }

  function handleRetry() {
    const trimmed = query.trim();
    if (!trimmed) return;

    const request = ++searchRequestId.current;
    performSearch(trimmed, request);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    if (event.key === "Escape") {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      setIsOpen(false);
      setActiveIndex(null);
      event.preventDefault();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!isOpen) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        const trimmed = query.trim();
        if (trimmed) {
          const request = ++searchRequestId.current;
          performSearch(trimmed, request);
        }
        return;
      }

      if (state.status !== "success" || state.products.length === 0) return;

      const isDown = event.key === "ArrowDown";
      const last = state.products.length - 1;

      setActiveIndex((prev) => {
        if (prev === null) return 0;
        if (isDown) return prev >= last ? 0 : prev + 1;
        return prev <= 0 ? last : prev - 1;
      });

      event.preventDefault();
      return;
    }

    if (event.key === "Enter") {
      if (isOpen && state.status === "success" && activeIndex !== null) {
        const product = state.products[activeIndex];
        if (product) handleSelect(product);
      }
      event.preventDefault();
    }
  }

  useEffect(() => {
    if (value === lastResolvedValue.current) return;
    lastResolvedValue.current = value;

    setIsOpen(false);
    setActiveIndex(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (value === null) {
      setQuery("");
      setState({ status: "idle" });
      return;
    }

    const request = ++resolveRequestId.current;
    getProduct(value)
      .then((product) => {
        if (request !== resolveRequestId.current) return;
        setQuery(product?.name ?? value);
      })
      .catch(() => {
        if (request !== resolveRequestId.current) return;
        setQuery(value);
      });
  }, [value]);

  useEffect(() => {
    if (!disabled) return;

    setIsOpen(false);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, [disabled]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-2 focus:outline-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
        aria-autocomplete="list"
        aria-controls="product-picker-listbox"
        aria-expanded={isOpen}
        role="combobox"
      />

      {isOpen && (
        <div
          id="product-picker-listbox"
          role="listbox"
          className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
        >
          {state.status === "loading" && (
            <div className="flex items-center justify-center p-4">
              <Spinner label="Cargando…" />
            </div>
          )}

          {state.status === "empty" && (
            <div className="p-4 text-sm text-slate-600">
              Sin resultados para «{query.trim()}»
            </div>
          )}

          {state.status === "error" && (
            <div className="flex flex-col items-center p-4 text-center">
              <p className="text-sm text-slate-600">{state.message}</p>
              <Button className="mt-3" variant="ghost" onClick={handleRetry}>
                Reintentar
              </Button>
            </div>
          )}

          {state.status === "success" && (
            <ul className="space-y-1">
              {state.products.map((product, index) => {
                const isActive = index === activeIndex;

                return (
                  <li key={product.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => handleSelect(product)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                        isActive ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-slate-900">{product.name}</span>
                        <span className="font-mono text-xs text-slate-500">{product.sku}</span>
                      </div>
                      <div className="mt-1 text-sm text-slate-700">
                        {formatCurrency(product.price)}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
