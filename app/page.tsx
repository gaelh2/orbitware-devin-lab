import Link from "next/link";

import { ProductTable } from "@/components/ProductTable";
import { QuickAdd } from "@/components/QuickAdd";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Orbitware Devin Lab</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Dirigiendo agentes en Frontend
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Base de laboratorio y referencia de convenciones para el Módulo 3, Sesión 1.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            href="/pedidos"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            Crear pedido
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <ProductTable />
      <QuickAdd />
    </main>
  );
}
