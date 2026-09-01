"use client";

import { useState, type FormEvent } from "react";

import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function OrderForm() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(
      `Borrador preparado para ${customerName}, con entrega el ${formatDate(deliveryDate)}.`,
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-700">Datos del pedido</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Información del cliente</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="customerName">
              Nombre del cliente
            </label>
            <input
              required
              id="customerName"
              name="customerName"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-2 focus:outline-blue-200"
              placeholder="Ana García"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="customerEmail">
              Correo electrónico
            </label>
            <input
              required
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-2 focus:outline-blue-200"
              placeholder="ana@empresa.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="deliveryDate">
              Fecha de entrega
            </label>
            <input
              required
              id="deliveryDate"
              name="deliveryDate"
              type="date"
              value={deliveryDate}
              onChange={(event) => setDeliveryDate(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-2 focus:outline-blue-200"
            />
          </div>
        </div>
      </Card>

      {/* // ProductPicker se integra en vivo durante la Sesión 1 del Módulo 3 — no implementes el selector. */}
      <Card className="border-dashed bg-slate-50">
        <p className="text-sm font-semibold text-slate-900">Productos del pedido</p>
        <p className="mt-2 text-sm text-slate-600">
          El selector de productos se construirá durante la sesión en vivo.
        </p>
      </Card>

      {confirmation && (
        <p className="rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-800" role="status">
          {confirmation}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit">Guardar borrador</Button>
      </div>
    </form>
  );
}
