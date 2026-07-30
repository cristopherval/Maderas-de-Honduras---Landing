# Estado del sitio público de Maderas de Honduras

Última sesión: 30 de julio de 2026. Commit `4a99207`.

## Hecho

- **Paso 1 y 2 del proceso** — plan de diseño y autocrítica, aprobados por Josue.
  Concepto rector: **la hoja de conteo** (papelería de aserradero: hairlines en
  vez de tarjetas, radio 0, cero sombras, rótulos de margen en monoespaciada).
- **Paso 3, andamiaje** — completo salvo lo que queda abajo:
  - `astro.config.mjs`, `tsconfig.json` (strict + `noUncheckedIndexedAccess`),
    `postcss.config.mjs`, `tailwind.config.ts` con paleta, escala tipográfica,
    curva `sierra` y keyframes.
  - `scripts/subset-fuentes.mjs` → `public/fonts/`. Correr con
    `node scripts/subset-fuentes.mjs` si se cambia el juego de caracteres.
  - `src/types/contenido.ts`, `src/data/empresa.ts`, `src/content.config.ts`,
    `src/content/*.json` (especies, productos, servicios, proceso, perfiles).
  - `src/lib/`: `contenido.ts`, `piesTablares.ts`, `listaStore.ts`,
    `whatsapp.ts`, `solicitudes.ts`.

## Pendiente inmediato al retomar

1. `src/styles/global.css` — `@font-face` de las cuatro fuentes recortadas,
   capas de Tailwind, utilidades de `font-stretch` y el sistema de animación
   (las siete permitidas + apagado por `prefers-reduced-motion`).
2. `public/logo.svg` provisional, `public/robots.txt`, imagen OG.
3. `src/layouts/Base.astro` + Encabezado, PieDePagina, JSON-LD `LocalBusiness`
   (sin `geo`), botón flotante de WhatsApp con mensaje por página.
4. Islas React: `Calculadora.tsx` (hoja de conteo) y `BarraTotal.tsx`
   (barra fija, cruce de los 10,000 pt).
5. Páginas, en este orden: `/`, `/especies`, `/especies/[slug]`, `/productos`,
   `/proceso`, `/nosotros`, `/cotizar`, `/contacto`, `/gracias`, `404`.
6. `pnpm build` limpio, luego Paso 5: auditoría (Lighthouse, teclado, 360px,
   contrastes, consola, lista de TODO para el cliente).

## Notas de entorno

- `pnpm` no está instalado como binario; se invoca con **`corepack pnpm`**.
- pnpm 11 lee sus ajustes de `pnpm-workspace.yaml`, no de `package.json`.

## Decisiones que hay que recordar

- El botón de cotizar es **fondo `ocote` con texto `verde-tinta`** (4.6:1).
  Blanco sobre ocote reprueba AA (3.7:1) y quedó prohibido.
- `ocote` sobre `aserrin` da 3.0:1 → **prohibido como texto en cualquier tamaño**.
  Para texto ámbar sobre fondo claro existe `ocote-tinta` (#8A5312).
- `verde-musgo` nunca es texto: solo líneas, bordes y elementos de UI.
- Las cinco estrellas aparecen **exactamente dos veces** fuera del logo: el
  divisor único de la portada y el indicador de umbral de la barra fija.
- La memoria del cruce de umbral es una variable de módulo, no `sessionStorage`,
  porque el brief prohíbe escribir fuera de la clave de la lista.

## Preguntas abiertas para el cliente

- **Logo**: no se recibió el JPEG. Se va a generar un SVG provisional.
- **Dominio**: se asumió `https://maderasdehonduras.hn` en `astro.config.mjs`.
- **Correo, redes y coordenadas del mapa**: siguen en `null` / vacío, y la UI
  los oculta. Confirmar cuando existan.
- **Teléfono con WhatsApp**: se asumió 8843-9226.
- **Línea de tiempo**: "13 años en el rubro" no cuadra con "planta propia desde
  2013". Solo se publica el segundo dato.
- **Matriz especie × producto** y **unidad de venta** de capote, leña, ocote y
  aserrín: armadas con criterio estándar del rubro, sin confirmar.
