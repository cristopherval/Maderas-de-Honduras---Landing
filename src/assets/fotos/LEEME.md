# Fotografías de la planta

Aquí van las fotos reales cuando se haga la sesión. **No se usan bancos de
imágenes**: una foto de un bosque canadiense le resta credibilidad a un
aserradero de Olancho.

## Cómo se conecta una foto

1. Dejá el archivo en esta carpeta (`jpg`, `png`, `webp` o `avif`, al ancho
   original más grande que tengás; Astro genera las variantes).
2. En el JSON de contenido correspondiente, agregá `archivo` dentro de `foto`:

   ```json
   "foto": {
     "toma": "Pila de tabla de pino recién aserrada...",
     "alt": "Pila de tablas de pino recién aserradas apiladas en el patio",
     "proporcion": "16/9",
     "archivo": "pino-pila-extremos.jpg"
   }
   ```

3. Listo. `MarcadorFoto.astro` deja de pintar el bloque de color y sirve la foto
   en avif/webp, con dimensiones explícitas y carga diferida.

El `alt` que ya está escrito en cada entrada es el texto alternativo definitivo,
no un relleno. Si la foto termina siendo distinta a la descrita, actualizá el
`alt` junto con el archivo.

## Lista de tomas

Es la que está escrita en el campo `toma` de cada entrada de
`src/content/especies.json` y `src/content/proceso.json`. Se puede sacar toda de
un tirón con:

```
node --experimental-strip-types -e "..."
```

o simplemente leyendo los dos JSON: cada `toma` es una foto que hay que tomar.
