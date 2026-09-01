import type { HTMLAttributes } from "react";

type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string;
};

export function Spinner({
  className = "",
  label = "Cargando",
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-3 text-sm text-slate-600 ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
      />
      <span>{label}</span>
    </span>
  );
}
