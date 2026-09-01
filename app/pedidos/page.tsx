import Link from "next/link";

import { OrderForm } from "@/components/OrderForm";

export default function OrdersPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        ← Volver al dashboard
      </Link>
      <header className="mb-8 mt-8">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Pedidos</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Nuevo pedido</h1>
        <p className="mt-3 text-slate-600">
          Completa los datos básicos. Los productos se integrarán durante la sesión.
        </p>
      </header>
      <OrderForm />
    </main>
  );
}
