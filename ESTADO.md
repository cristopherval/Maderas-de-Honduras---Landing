# Estado del sitio público de Maderas de Honduras

Última sesión: 2 de agosto de 2026.

## Qué es el sitio ahora

Un **catálogo**, no una landing. La referencia son los dos aserraderos que pasó
el cliente: [Wood Mizer HN](https://aserraderoyexportacionmaderawmhn.com/) y
[Sansone](https://sansone.hn/). Los dos hacen lo mismo: dicen qué son en una
línea y pasan directo al listado de producto, con el nombre y poco más.

**Cinco páginas**, no trece:

| Página | Qué lleva |
|---|---|
| `/` | Qué somos en dos líneas, especies, productos, la planta, servicios, dónde estamos |
| `/productos` | Los 11 productos por categoría, en grilla con foto, especies y unidad |
| `/servicios` | Los cuatro servicios, en grilla con foto |
| `/nosotros` | La progresión hasta la planta propia. Corta |
| `/contacto` | Formulario de tres campos, teléfonos, dirección y horario |

La navegación es **Inicio · Productos · Servicios · Nosotros · Contacto**, más el
botón de pedir precio, que nunca entra al menú de móvil.

El orden de la portada es: **héroe → productos (6) → nosotros → servicios →
especies → ubicación**.

### Sin filetes: la separación es por color

Se quitaron **todas** las líneas de división del sitio. Las secciones se
distinguen solo por el color de fondo, alternando `cal`, `aserrin` y
`verde-tinta`. El encabezado va en `aserrin` justamente para separarse del
`cal` de las páginas sin necesidad de un filete.

Quedan bordes solo donde cumplen una función y no dividen nada: los campos del
formulario, el contorno de los botones de línea, el panel flotante del menú de
móvil y el botón de WhatsApp.

### Héroe

`h1` = **Maderas de Honduras**, con una bajada pensada para SEO (aserradero,
planta procesadora, las cuatro especies, los cuatro servicios y la ubicación).

Va a sangre con **fondo de video**. Mientras `VIDEO_HEROE` sea `null` en
`data/empresa.ts` se pinta `heroe.jpg`; cuando el cliente entregue el video se
llena esa constante y pasa a `<video>` solo, silenciado, en bucle, con `poster`
y respetando `prefers-reduced-motion`. La maqueta no se toca.

El velo es un **degradado**, no un plano: al 80% parejo la foto desaparecía y el
héroe se veía como un bloque verde liso. Va opaco abajo, donde se apoya el
texto, y se abre hacia arriba. Contraste medido **sobre los píxeles de la foto**,
no contra un token: 9.39 y 8.73 a 1440px; 4.18 y 5.52 a 360px. Pasa en las dos.

### Animaciones

Sistema en `global.css`: entrada del héroe escalonada, revelado al hacer scroll
(`.revelar` + `--retraso` para escalonar tarjetas), acercamiento de la imagen y
cambio de color del título en las tarjetas, subrayado de navegación que crece
desde la izquierda, y la flecha de los botones.

**Todo lo de hover va dentro de `@media (hover: hover) and (pointer: fine)`.**
En una pantalla táctil el hover se queda pegado tras tocar, y una imagen que se
agranda sola al tocarla se lee como un zoom accidental. Ojo: eso no lo pude
verificar en el navegador headless —no emula esas media queries y `(hover:
hover)` sigue dando true—, así que está por construcción, no por medición.

Lo que sí está medido, a 1440 y a 360: los 51 elementos con `.revelar` terminan
visibles en las seis páginas, y con `prefers-reduced-motion` quedan todos en su
estado final con cero animaciones activas.

### Celular

Zonas de toque de **44px como mínimo**. Estaban en 18–24px los enlaces del pie y
los teléfonos; se arreglaron con `min-h-[44px]` y centrado, no calculando
padding a mano. La única excepción es "Saltar al contenido", que mide 1×1 a
propósito hasta recibir el foco.

El botón de WhatsApp es **circular**.

### Mapa

Coordenadas de la planta, del pin que pasó el cliente: **14.427782, -87.045227**.
Con eso `urlComoLlegar()` apunta al punto exacto y el JSON-LD emite `geo`.

El mapa incrustado de la portada es el de **Google Maps** (`output=embed`, que no
pide clave). El botón de "Cómo llegar" abre Maps para navegar.

TODO (cliente): no hay perfil de empresa en Google todavía. Cuando exista,
conviene enlazar la ficha en vez del pin suelto — sale con nombre, horario y
reseñas.

Más el 404. `astro check`: 0 errores, 0 avisos.

## Reescritura del 2 de agosto

### Lo que se quitó

- **La calculadora de pies tablares entera** y todo lo que colgaba de ella: la
  hoja de conteo, la barra fija de total, la lista que seguía por el sitio, la
  página `/gracias`, `listaStore`, `piesTablares` y `solicitudes`.
- **Las cuatro fichas de especie** con sus listas de "se usa en". El cliente no
  quiere describir dónde se usa cada madera.
- **`/proceso`**, que contaba las seis etapas de la troza al despacho. Ahora es
  `/servicios` y es una lista de cuatro.
- **La banda de estadísticas** (especies, productos, mínimo por envío, año,
  horarios) y **la franja del pie** con la dirección repetida en versalitas.
- **El bloque "a quién le vendemos"** de `/nosotros`.
- El formulario de cotización de nueve campos.

### Copy que ya no existe en ningún lado

- **Nada de mínimos**: se fue "10,000 pies tablares", "mínimo por envío" y "por
  debajo de eso se retira en planta". Decirle al que compra poco que no es su
  lugar es mala estrategia. Queda `NOTA_VOLUMEN` en `data/empresa.ts`, que dice
  **"Trabajamos por volumen"** y nada más.
- **Nada de transporte**: se fue "transporte propio", "despachamos por
  camionada" y "sale a la dirección de entrega". La planta no cubre entrega a
  cualquier distancia, así que no se promete.

### Tipografía

Era Archivo + Instrument Sans + IBM Plex Mono. Ahora es **Libre Franklin sola**,
del linaje de la Franklin Gothic, que es la tipografía de los catálogos
comerciales. Se eligió comparando tres parejas sobre contenido real del sitio.

- Un solo archivo variable autoalojado y recortado: **18 KB**, contra 64 KB en
  cuatro archivos. Una petición en vez de cuatro.
- La monoespaciada se fue con la calculadora. Los números alinean por
  `font-variant-numeric: tabular-nums`, que ya estaba en `global.css`.
- Los tres alias (`font-display`, `font-cuerpo`, `font-dato`) apuntan a la misma
  familia a propósito, para no reescribir cada clase del sitio. La jerarquía la
  dan el peso, el cuerpo y el tracking de cada token de `fontSize`.
- Se fueron `ancho-expandido` y `ancho-normal`: eran `font-stretch` sobre el eje
  de ancho de Archivo, y Libre Franklin no tiene ese eje.

### Logo

Llegó el real (`LOGO AZUR.jpeg`): tres pinos escalonados fundidos en una sola
masa de base plana, con cinco estrellas caladas.

**Está vectorizado desde el JPEG, no dibujado a ojo.** El archivo es de dos
colores planos y bordes rectos, así que se trazó de verdad: umbral, seguimiento
de contorno de Moore para la silueta y para cada hueco, y Douglas-Peucker para
quedarse con los vértices reales. Las cinco estrellas se ajustaron después a su
geometría exacta (centro, radio y giro tomados del contorno), porque el umbral
sobre el antialias del JPEG dejaba las puntas romas. Salen 21 vértices de
silueta y 10 por estrella.

Está en `src/components/Logo.astro` y en `public/logo.svg`. **Si llega el
vectorial del diseñador (.svg, .ai, .eps o .pdf), se reemplazan esas dos
constantes y nada más.**

Dos cosas que costaron y conviene no repetir:

- Las estrellas son **huecos**, no figuras blancas encima, para que el logo sirva
  sobre cualquier fondo. Con el trazado final `evenodd` funciona porque hay una
  sola silueta exterior y cinco huecos que no se tocan.
- Cuando el logo estaba dibujado como **tres pinos superpuestos**, ni `evenodd`
  ni `nonzero` calaban bien: con `evenodd` se agujereaba cada zona compartida, y
  con `nonzero` el índice de giro en el solape es 2, así que restarle el hueco
  deja 1 y la estrella no se abre. Ahí hacía falta máscara. Con la silueta
  trazada el problema desaparece.

### Accesibilidad (auditoría del 31 de julio, sigue vigente)

Se corrigió que la tabla de contrastes de `tailwind.config.ts` **declaraba 4.6
al par `ocote`/`verde-tinta` cuando medido da 3.90**, con lo que el botón
principal reprobaba AA en todas las páginas.

- `ocote` pasó de `#B4712A` a **`#C27C34`** (4.55).
- `verde-musgo` dejó de usarse como texto y el marcador de foto perdió su
  `opacity-70`.
- El hover de `.eyebrow-especie` pasó a `ocote-tinta`.
- **El aro de foco es de dos tonos** (anillo `cal` pegado al elemento y
  `verde-tinta` por fuera). Es la única regla que cumple el 3:1 sobre cualquier
  fondo del sitio: `ocote` fijo daba 2.96 sobre `verde-monte`.

Lighthouse quedó en **100 de accesibilidad en las 26 corridas** (venía de 95–96),
y rendimiento, buenas prácticas y SEO en 100 salvo variaciones de un punto o dos
en móvil. Falta **volver a correrlo sobre la estructura nueva**.

### Fotos de relleno — HAY QUE CAMBIARLAS ANTES DE PUBLICAR

**Todo lleva foto**: las 4 especies, los 11 productos, los 4 servicios y las 2
tomas de planta. 21 archivos en `src/assets/fotos/`, con créditos y licencias en
`src/assets/fotos/CREDITOS-RELLENO.json`.

**No son de la planta y no son del cliente.** Todas tienen licencia de uso
comercial, pero muestran madera genérica y talleres ajenos. El pipeline ya está
armado: se cambia el archivo y el `alt`, y nada más.

Cuatro cosas que conviene saber:

- **17 son únicas; 4 se repiten.** Openverse no devolvió nada usable para
  `palillo`, `secado`, `capote` y `timber`, así que cada una copia la más
  parecida (`caoba`, `pallets`, `planta-tabla` y `roble`). Está anotado en el
  JSON de créditos. `timber` copia a `roble` a propósito, y no a
  `madera-en-cuadro`, para que la repetición no quede en la misma fila.
- Los textos `alt` y `toma` describen **la foto que se quiere**, no la de
  relleno. Cuando lleguen las reales van a coincidir; hoy no.
- De dónde salieron: loremflickr empareja las palabras clave pésimo (por
  "lumber" devolvió la estatua de un gato), y la búsqueda y las categorías de
  Commons dan material de archivo —locomotoras, un aula de 1900, un cuadro de
  1861—. La que sirvió fue **Openverse**. Aun así hicieron falta tres pasadas y
  tres filtros: exigir que el título hable de madera, descartar una lista de
  palabras (`hall`, `bird`, `fence`, `truck`…) y **medir la saturación** de la
  imagen para tirar el material en blanco y negro y sepia, que no se puede
  detectar por metadato.
- **Las capturas de página completa mienten con la carga diferida.**
  `captureBeyondViewport` no dispara `loading="lazy"`, así que las filas de
  abajo salen en blanco y parece un fallo que no existe. Hay que recorrer la
  página y esperar a que cada `<img>` quede `complete` antes de fotografiar.

### Números medidos tras la reescritura

| Cosa | Valor |
|---|---|
| Páginas | 6 (5 + 404), antes 13 |
| Fuentes | **18 KB** en un archivo, antes 64 KB en cuatro |
| Desbordamiento horizontal a 360px | 0 en las 6 |
| Errores de consola | 0 en las 6, a 360 y a 1440 |

## Pendiente al retomar

1. **Volver a correr Lighthouse** sobre las cinco páginas nuevas. La auditoría
   completa es de la estructura vieja.
2. **Las fotos reales de la planta.** Las que hay ahora son de relleno, sacadas
   de internet, y están puestas nada más para ver cómo queda el sitio con
   imágenes. Es lo que más lo levantaría: los dos sitios de referencia tienen
   fotos propias de planta y de producto. La lista de tomas está en los campos
   `toma` de `especies.json` y en las constantes de `index.astro` y
   `nosotros.astro`.
3. **El botón flotante de WhatsApp tapa contenido en móvil.** A 360px se le pone
   encima a un campo del formulario en `/contacto`. Es el compromiso de
   cualquier botón flotante; moverlo es decisión de diseño.
4. **Recortar el catálogo.** Son 11 productos; Wood Mizer muestra 7 y Sansone 4.
   Falta que el cliente diga cuáles vende de verdad y cuáles sacar.
5. **Medidas por producto.** Sansone pone "1×6 y 1×8", "6 a 20 pies". Acá no hay
   ese dato y no se inventó. Si el cliente lo pasa, el catálogo mejora mucho.
6. Rehacer `public/og.png` con el logo real (`node scripts/og.mjs`).

## Notas de entorno

- `pnpm` no está instalado como binario: se invoca **`corepack pnpm`**.
- pnpm 11 lee sus ajustes de `pnpm-workspace.yaml`, no de `package.json`.
- El servidor de preview muere si se lanza como tarea de fondo del agente. Para
  dejarlo corriendo: `corepack pnpm preview --port 4321 --host`. Con `--host`
  se puede abrir desde el celular en la misma red y probar 360px de verdad.
- Lighthouse no está en las dependencias: `corepack pnpm dlx lighthouse@12`, con
  `CHROME_PATH` en ruta de Windows. **`--preset=mobile` no existe**: móvil es el
  modo por defecto; los presets válidos son `perf`, `experimental` y `desktop`.
- Para verificar 360px **no sirve** `msedge --headless --window-size=360`:
  Windows impone un ancho mínimo de ~500px a la ventana y la captura sale
  recortada, simulando un desbordamiento que no existe. Hay que emular por CDP
  (`--remote-debugging-port` + `Emulation.setDeviceMetricsOverride`).
- Al medir el aro de foco: `getComputedStyle` **sin enfocar el elemento**
  devuelve el outline inicial del navegador, no la regla `:focus-visible`. Y un
  `focus()` programático no siempre la activa. Hay que mandar un Tab real por
  `Input.dispatchKeyEvent`. Medirlo mal da fallos que no existen.
- En Git Bash, un argumento que sea sólo `/` se convierte en ruta de Windows, y
  un heredoc se come las barras invertidas de las rutas. Las rutas van por
  bandera nombrada y los scripts se escriben como archivo.

## Decisiones que hay que recordar

- **Runtime**: la isla del formulario está escrita en React pero corre sobre
  **preact/compat**, por el presupuesto de JS. Se revierte cambiando
  `astro.config.mjs` y los `paths` de `tsconfig.json`. `@astrojs/preact` está
  fijado en **4.1.3** porque la 6.x pide Astro 7.
- **El formulario de contacto no tiene servidor**: al enviar abre WhatsApp con
  el mensaje ya escrito. Es como trabajan de hecho los dos aserraderos de
  referencia, y evita prometer un buzón que nadie lee.
- **Los números de contraste se miden, no se estiman.** La tabla del config
  llevaba un 4.6 que era 3.90 y con eso el CTA reprobó AA toda la construcción.
- Sobre fondo **claro** el ámbar que puede llevar texto es `ocote-tinta`;
  `ocote` solo vale de relleno. Sobre fondo **oscuro** es al revés.
- `verde-musgo` no es texto **ni fondo de texto**: solo líneas, bordes y UI.
- El aro de foco es la **única excepción a la regla de cero sombras**. Su
  `box-shadow` no tiene desenfoque ni desplazamiento: es un anillo sólido de 2px
  que rellena el hueco de `outline-offset`.
- En móvil el botón de WhatsApp **no** está en el encabezado: es el flotante. El
  de pedir precio sí. Ninguno queda dentro del menú hamburguesa.

## Preguntas abiertas para el cliente

- **Vectorial del logo**: el trazado actual sale del JPEG. Si existe el `.svg`,
  `.ai`, `.eps` o `.pdf` original, conviene usarlo.
- **Dominio**: se asumió `https://maderasdehonduras.hn` en `astro.config.mjs`
  y en `public/robots.txt`.
- **Correo, redes y coordenadas**: siguen en `null` / vacío y la UI los oculta.
- **Teléfono con WhatsApp**: se asumió 8843-9226.
- **Línea de tiempo**: "13 años en el rubro" no cuadra con "planta propia desde
  2013". Solo se publica el segundo dato.
- **Matriz especie × producto** y **unidad de venta** de capote, leña, ocote y
  aserrín: armadas con el criterio estándar del rubro, sin confirmar.
- **Lista de tomas fotográficas**: son los campos `toma` de
  `src/content/especies.json`.
