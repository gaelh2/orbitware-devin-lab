# Orbitware Devin Lab — M3 S1: Dirigiendo agentes en Frontend

Base de laboratorio y referencia de convenciones para el **Módulo 3, Sesión 1** del entrenamiento en desarrollo frontend con agentes.

El proyecto incluye un dashboard de catálogo de productos y un formulario de borrador de pedidos. Está pensado para practicar la dirección de agentes de código, la separación cliente/servidor y el uso consistente de componentes y utilidades compartidas.

## Stack

- **Framework:** [Next.js 16](https://nextjs.org/) con App Router
- **Lenguaje:** TypeScript en modo estricto
- **Estilos:** Tailwind CSS 4
- **Gestor de paquetes:** pnpm 11.25.0
- **Runtime:** React 19

## Requisitos previos

- Node.js (versión compatible con Next.js 16)
- [pnpm](https://pnpm.io/) 11.25.0 o similar

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd M3S1_Frontend
   ```

2. Instala las dependencias:

   ```bash
   pnpm install
   ```

3. No se requieren variables de entorno para ejecutar el laboratorio en local.

## Scripts disponibles

| Comando         | Descripción                                   |
|-----------------|-----------------------------------------------|
| `pnpm dev`      | Inicia el servidor de desarrollo              |
| `pnpm build`    | Compila la aplicación para producción         |
| `pnpm start`    | Inicia la aplicación compilada                |
| `pnpm typecheck`| Verifica el proyecto con TypeScript (`tsc`)   |

## Estructura del proyecto

```
.
├── app/                # Páginas como Server Components
│   ├── page.tsx        # Dashboard con catálogo de productos
│   └── pedidos/page.tsx# Formulario de nuevo pedido
├── components/         # Componentes de dominio y primitivas de UI
│   ├── OrderForm.tsx
│   ├── ProductTable.tsx
│   └── ui/             # Badge, Button, Card, Spinner
├── lib/                # Utilidades y tipos compartidos
│   ├── api.ts          # Simulación de API sobre mocks
│   ├── format.ts       # Formato de moneda y fecha
│   └── types.ts        # Tipos Product, OrderLine y Order
├── mocks/              # Datos de ejemplo
│   └── products.json
├── AGENTS.md           # Convenciones para agentes
├── next.config.ts
├── package.json
└── pnpm-workspace.yaml
```

## Convenciones principales

- Las páginas en `app/` son **Server Components** por defecto.
- `components/ui/` contiene los primitivos reutilizables; no dupliques componentes equivalentes.
- `lib/types.ts` centraliza los tipos compartidos; no redefinas tipos localmente.
- `lib/format.ts` es el punto único para formatear moneda y fechas.
- Los componentes con estado o efectos usan `"use client"` en el archivo que realmente lo necesita.
- Los estados de carga deben usar `components/ui/Spinner`.

Para más detalles, consulta `AGENTS.md`.
