"use client";

import { useRef, useState } from "react";

import { searchProducts, setApiFailure } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

type TableState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; products: Product[] }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "disabled" };

const demoStates = ["idle", "loading", "empty", "error", "disabled"] as const;
const stateLabels: Record<(typeof demoStates)[number], string> = {
  idle: "Idle",
  loading: "Loading",
  empty: "Empty",
  error: "Error",
  disabled: "Disabled",
};

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <Badge variant="danger">Sin existencias</Badge>;
  }

  if (stock <= 5) {
    return <Badge variant="warning">Stock bajo · {stock}</Badge>;
  }

  return <Badge variant="success">Disponible · {stock}</Badge>;
}

export function ProductTable() {
  const [state, setState] = useState<TableState>({ status: "idle" });
  const requestId = useRef(0);

  async function loadProducts(forceFailure = false) {
    const currentRequest = ++requestId.current;
    setState({ status: "loading" });
    setApiFailure(forceFailure);

    try {
      const products = await searchProducts("");

      if (currentRequest === requestId.current) {
        setState(products.length > 0 ? { status: "success", products } : { status: "empty" });
      }
    } catch (error) {
      if (currentRequest === requestId.current) {
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
        });
      }
    } finally {
      setApiFailure(false);
    }
  }

  function forceState(status: (typeof demoStates)[number]) {
    if (status === "loading") {
      void loadProducts();
      return;
    }

    if (status === "error") {
      void loadProducts(true);
      return;
    }

    requestId.current += 1;
    setApiFailure(false);
    setState({ status });
  }

  const isLoading = state.status === "loading";

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold text-blue-700">Referencia de estados</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">Catálogo de productos</h2>
            <p className="mt-1 text-sm text-slate-600">
              Fuerza cada estado para revisar el patrón visual y de interacción.
            </p>
          </div>
          <Button disabled={isLoading} onClick={() => void loadProducts()}>
            Cargar datos
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Estados de demostración">
          {demoStates.map((status) => (
            <Button
              key={status}
              variant={state.status === status ? "primary" : "secondary"}
              disabled={isLoading}
              onClick={() => forceState(status)}
            >
              {stateLabels[status]}
            </Button>
          ))}
        </div>
      </div>

      <div className="min-h-64">
        {state.status === "idle" && (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <Badge>Idle</Badge>
            <h3 className="mt-4 font-semibold text-slate-900">La consulta aún no ha comenzado</h3>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              Pulsa “Cargar datos” para solicitar el catálogo.
            </p>
          </div>
        )}

        {state.status === "loading" && (
          <div className="flex min-h-64 items-center justify-center p-8">
            <Spinner label="Cargando productos…" />
          </div>
        )}

        {state.status === "empty" && (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <Badge variant="neutral">Empty</Badge>
            <h3 className="mt-4 font-semibold text-slate-900">No hay productos que mostrar</h3>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              La consulta terminó correctamente, pero no devolvió resultados.
            </p>
          </div>
        )}

        {state.status === "error" && (
          <div className="flex min-h-64 flex-col items-center justify-center bg-red-50/50 p-8 text-center">
            <Badge variant="danger">Error</Badge>
            <h3 className="mt-4 font-semibold text-slate-900">No pudimos cargar el catálogo</h3>
            <p className="mt-1 max-w-md text-sm text-slate-600">{state.message}</p>
            <Button className="mt-5" onClick={() => void loadProducts()}>
              Reintentar
            </Button>
          </div>
        )}

        {state.status === "disabled" && (
          <div className="min-h-64 bg-slate-50 p-6" aria-disabled="true">
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 opacity-60">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Badge>Disabled</Badge>
                  <h3 className="mt-3 font-semibold text-slate-900">Catálogo no disponible</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Esta sección está deshabilitada hasta completar los datos del pedido.
                  </p>
                </div>
                <Button disabled>Agregar producto</Button>
              </div>
            </div>
          </div>
        )}

        {state.status === "success" && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-semibold" scope="col">Producto</th>
                  <th className="px-6 py-3 font-semibold" scope="col">SKU</th>
                  <th className="px-6 py-3 font-semibold" scope="col">Precio</th>
                  <th className="px-6 py-3 font-semibold" scope="col">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <th className="px-6 py-4 font-medium text-slate-900" scope="row">
                      {product.name}
                    </th>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{product.sku}</td>
                    <td className="px-6 py-4 text-slate-700">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4"><StockBadge stock={product.stock} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
