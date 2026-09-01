# AGENTS.md — orbitware-devin-lab

## Stack
- Next.js App Router · TypeScript estricto · Tailwind
- Gestor de paquetes: pnpm

## Estructura
- Primitivos de UI: components/ui/ — reúsalos, no crees equivalentes nuevos
- Componentes de dominio: components/<Nombre>.tsx
- Tipos compartidos: lib/types.ts — no redefinas tipos localmente

## Convenciones
- Componentes controlados por defecto: value + onChange
- El callback de cambio se llama onChange, nunca onSelect ni onUpdate
- Los estados de carga usan components/ui/Spinner
- Formato de moneda y fecha: siempre lib/format.ts

## Frontera cliente/servidor
- Las páginas de app/ son Server Components
- "use client" solo en el componente que realmente necesita estado o efectos
- No muevas la frontera hacia arriba para simplificar

## Al terminar
- pnpm typecheck debe pasar
- No agregues dependencias sin justificarlo en el PR
