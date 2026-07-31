# Estado del sitio público de Maderas de Honduras

Última sesión: 31 de julio de 2026.

## Hecho

- **Pasos 1 y 2** — plan de diseño y autocrítica, aprobados.
  Concepto rector: **la hoja de conteo** (papelería de aserradero: hairlines en
  vez de tarjetas, radio 0, cero sombras, rótulos de margen en monoespaciada).
- **Paso 3, andamiaje** — completo. Astro 5 estático, TypeScript strict,
  Tailwind con los tokens, fuentes autoalojadas y recortadas, colecciones de
  contenido con la forma que van a tener las tablas de Supabase.
- **Paso 4, construcción** — **las 13 páginas construyen limpio**:
  `/`, `/especies`, `/especies/{pino,roble,caoba,cedro}`, `/productos`,
  `/proceso`, `/nosotros`, `/cotizar`, `/contacto`, `/gracias`, `404`.
  `astro check`: 0 errores, 0 avisos.

### Números medidos

| Cosa | Valor | Presupuesto |
|---|---|---|
| JS del inicio (comprimido) | **18 KB** | < 60 KB |
| Fuentes, las cuatro | **64 KB** | — |
| Archivo recortada | 25.8 KB (era 88) | — |
| Desbordamiento horizontal a 360px | **0** | 0 |

## Pendiente al retomar

1. **Paso 5, auditoría final**, que es lo único que falta del proceso:
   - Lighthouse en las cuatro categorías (meta ≥ 95). No se corrió todavía.
   - Recorrido completo con teclado, incluida la calculadora.
   - Verificar `prefers-reduced-motion` con la preferencia activada.
   - Revisar consola limpia en las 13 páginas.
   - Capturas de las páginas que aún no se revisaron a ojo: solo se auditó la
     portada (escritorio y 360px). Faltan las otras nueve.
2. Correcciones ya identificadas y **ya aplicadas** en la portada: proporción
   unificada en la grilla de tres especies, borde al marcador en tono `aserrin`,
   cinta métrica más densa.
3. Rehacer `public/og.png` y `public/logo.svg` cuando llegue el logo real
   (`node scripts/og.mjs`).

## Notas de entorno

- `pnpm` no está instalado como binario: se invoca **`corepack pnpm`**.
- pnpm 11 lee sus ajustes de `pnpm-workspace.yaml`, no de `package.json`.
- Para verificar 360px **no sirve** `msedge --headless --window-size=360`:
  Windows le impone a la ventana un ancho mínimo de ~500px y la captura sale
  recortada, simulando un desbordamiento que no existe. Hay que emular por CDP
  (`--remote-debugging-port=9222` + `Emulation.setDeviceMetricsOverride`).
  El script quedó en el scratchpad de la sesión; si hace falta se reescribe.

## Decisiones que hay que recordar

- **Runtime**: las islas están escritas en React pero corren sobre
  **preact/compat**. El brief pide React y a la vez < 60 KB de JS, y react-dom
  solo ya pesa 58.5 KB comprimido. Con preact/compat el inicio quedó en 18 KB.
  Se revierte cambiando `astro.config.mjs` y los `paths` de `tsconfig.json`;
  los componentes no se tocan. `@astrojs/preact` está fijado en **4.1.3**
  porque la 6.x pide Astro 7.
- El botón de cotizar es **fondo `ocote` con texto `verde-tinta`** (4.6:1).
  Blanco sobre ocote reprueba AA (3.7:1).
- `ocote` sobre `aserrin` da 3.0:1 → **prohibido como texto**. Para ámbar sobre
  fondo claro existe `ocote-tinta` (#8A5312).
- `verde-musgo` nunca es texto: solo líneas, bordes y UI.
- Las cinco estrellas aparecen **exactamente dos veces** fuera del logo: el
  divisor único de la portada y el indicador de umbral de la barra fija.
- La memoria del cruce de umbral es una variable de módulo, no `sessionStorage`,
  porque el brief prohíbe escribir fuera de la clave de la lista.
- En móvil el botón de WhatsApp **no** está en el encabezado: es el flotante,
  que se acomoda arriba de la barra fija. El de cotizar sí está en el
  encabezado. Ninguno de los dos queda dentro del menú hamburguesa.

## Preguntas abiertas para el cliente

- **Logo**: no se recibió el archivo. Hay un SVG provisional en `public/logo.svg`
  reconstruido según la descripción (tres pinos, cinco estrellas).
- **Dominio**: se asumió `https://maderasdehonduras.hn` en `astro.config.mjs`
  y en `public/robots.txt`.
- **Correo, redes y coordenadas**: siguen en `null` / vacío y la UI los oculta.
- **Teléfono con WhatsApp**: se asumió 8843-9226.
- **Línea de tiempo**: "13 años en el rubro" no cuadra con "planta propia desde
  2013". Solo se publica el segundo dato.
- **Matriz especie × producto** y **unidad de venta** de capote, leña, ocote y
  aserrín: armadas con el criterio estándar del rubro, sin confirmar. Están en
  `src/content/productos.json` y `src/content/especies.json` con su TODO.
- **Lista de tomas fotográficas**: son los campos `toma` de
  `src/content/especies.json`, `proceso.json` y de `src/pages/nosotros.astro`.
