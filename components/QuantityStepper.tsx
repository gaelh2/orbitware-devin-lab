"use client";

import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/Button";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

function clamp(n: number, min: number, max: number | undefined): number {
  if (Number.isNaN(n)) return min;
  if (n < min) return min;
  if (max !== undefined && n > max) return max;
  return n;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
}: QuantityStepperProps) {
  const [draft, setDraft] = useState(() => String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && (max === undefined || value < max);

  function decrement() {
    if (!canDecrement) return;
    onChange(clamp(value - 1, min, max));
  }

  function increment() {
    if (!canIncrement) return;
    onChange(clamp(value + 1, min, max));
  }

  function handleBlur() {
    const parsed = Number(draft);
    const clamped = clamp(parsed, min, max);
    setDraft(String(clamped));
    onChange(clamped);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.target.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  }

  return (
    <div className="flex items-stretch gap-2">
      <Button
        variant="secondary"
        className="size-10 px-0"
        onClick={decrement}
        disabled={!canDecrement}
        aria-label="Disminuir cantidad"
      >
        −
      </Button>

      <input
        type="number"
        min={min}
        max={max}
        inputMode="numeric"
        value={draft}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm text-slate-900 focus:border-blue-500 focus:outline-2 focus:outline-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Cantidad"
      />

      <Button
        variant="secondary"
        className="size-10 px-0"
        onClick={increment}
        disabled={!canIncrement}
        aria-label="Aumentar cantidad"
      >
        +
      </Button>
    </div>
  );
}
