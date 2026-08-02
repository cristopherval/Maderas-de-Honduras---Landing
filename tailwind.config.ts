import type { Config } from 'tailwindcss';

/**
 * Sistema de diseño de Maderas de Honduras.
 *
 * Regla dura del proyecto: ningún componente escribe un color literal. Todo sale
 * de `theme.colors`. Si un color no está aquí, no existe en el sitio.
 *
 * Contrastes verificados (WCAG 2.1, ratio calculado sobre luminancia relativa).
 * Los números salen de medirlos, no de estimarlos: la tabla anterior daba 4.6
 * al par ocote/verde-tinta cuando en realidad daba 3.90, y con eso el botón de
 * cotizar reprobaba AA en las 13 páginas. Si tocás un color, volvé a medir.
 *
 *   verde-tinta / cal ....... 14.3  AAA   texto largo
 *   verde-tinta / aserrin ... 11.6  AAA   texto largo
 *   verde-monte / cal ........ 9.3  AAA
 *   verde-monte / aserrin .... 7.5  AAA
 *   cal / verde-tinta ....... 14.3  AAA   bandas oscuras
 *   aserrin / verde-monte .... 7.5  AAA
 *   ocote / verde-tinta ...... 4.6  AA    ámbar sobre oscuro y el botón de cotizar
 *   ocote-tinta / cal ........ 5.9  AA    enlaces, datos y acentos sobre claro
 *   ocote-tinta / aserrin .... 4.8  AA
 *   ocote / cal .............. 3.1  PROHIBIDO como texto; solo relleno y borde
 *   ocote / aserrin .......... 2.5  PROHIBIDO como texto en cualquier tamaño
 *   verde-musgo / cal ........ 4.2  PROHIBIDO como texto; sirve de línea y borde
 *   verde-musgo / verde-tinta  3.4  PROHIBIDO como texto; línea sobre oscuro
 *
 * Regla que se deduce de la tabla: sobre fondo CLARO el ámbar que puede llevar
 * texto es `ocote-tinta`; `ocote` solo vale como relleno. Sobre fondo OSCURO es
 * al revés. El aro de foco no usa ninguno de los dos: usa currentColor, que por
 * construcción contrasta con el fondo que sea.
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'verde-tinta': '#0E2A1D',
        'verde-monte': '#1C4B34',
        'verde-musgo': '#47825E',
        // Un punto más claro que el ámbar original (#B4712A): ahí el texto
        // verde-tinta encima daba 3.90 y no llegaba a AA. Acá da 4.55.
        ocote: '#C27C34',
        'ocote-tinta': '#8A5312',
        aserrin: '#E7DFCE',
        cal: '#F8F7F3',
      },

      /**
       * Una sola familia para todo el sitio: Libre Franklin, del linaje de la
       * Franklin Gothic, la tipografía de los catálogos comerciales.
       *
       * Los tres nombres apuntan a la misma familia a propósito. La jerarquía
       * la dan el peso, el cuerpo y el tracking —que es lo que define cada
       * token de `fontSize`—, no el cambio de tipografía. Se mantienen los tres
       * alias para no tener que reescribir cada clase del sitio de golpe.
       */
      fontFamily: {
        display: ['Franklin Recortada', 'Helvetica Neue', 'Arial', 'sans-serif'],
        cuerpo: ['Franklin Recortada', 'Helvetica Neue', 'Arial', 'sans-serif'],
        dato: ['Franklin Recortada', 'Helvetica Neue', 'Arial', 'sans-serif'],
        /**
         * Rótulo de marca. Condensada y alta, del género de la letra pintada
         * en señalización de planta. Solo en versalitas y en muy pocas
         * palabras: no es una familia de texto.
         */
        marca: ['Big Shoulders Recortada', 'Arial Narrow', 'sans-serif'],
      },

      /**
       * Toda la jerarquía sale de acá: peso, cuerpo y tracking. Con una sola
       * familia, un titular y un dato se distinguen por eso y no por venir de
       * dos tipografías distintas.
       *
       * Franklin aprieta bien en tamaños grandes: cuanto más grande el cuerpo,
       * más negativo el tracking. En los rótulos en versalitas pasa al revés.
       */
      fontSize: {
        // Titulares.
        'display-hero': [
          'clamp(2.5rem, 7.5vw, 5.5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.035em', fontWeight: '700' },
        ],
        'display-1': [
          'clamp(1.875rem, 4vw, 3rem)',
          { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '700' },
        ],
        'display-2': [
          'clamp(1.375rem, 2.4vw, 1.75rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],

        // Cuerpo.
        lead: ['1.1875rem', { lineHeight: '1.55', letterSpacing: '-0.005em' }],
        base: ['1.0625rem', { lineHeight: '1.6' }],
        sm: ['0.9375rem', { lineHeight: '1.55' }],

        // Números y medidas. Ya no son monoespaciados: el `font-variant-numeric`
        // de global.css les da cifras de ancho fijo para que las columnas de
        // medidas sigan alineando.
        'dato-xl': [
          'clamp(1.875rem, 4.5vw, 2.75rem)',
          { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '700' },
        ],
        'dato-lg': ['1.25rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '600' }],
        dato: ['1rem', { lineHeight: '1.45' }],
        'dato-sm': ['0.875rem', { lineHeight: '1.45' }],

        // Rótulos en versalitas.
        spec: ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.1em', fontWeight: '600' }],
        'spec-sm': ['0.6875rem', { lineHeight: '1.25', letterSpacing: '0.11em', fontWeight: '600' }],
      },

      maxWidth: {
        medida: '62ch', // medida máxima de lectura
        plano: '90rem', // ancho del contenedor principal
      },

      spacing: {
        riel: '4.5rem', // columna de rótulo en el margen izquierdo (desktop)
        barra: '4.25rem', // alto de la barra fija inferior
      },

      transitionTimingFunction: {
        // Curva única del sitio: salida rápida, frenado largo.
        sierra: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      transitionDuration: {
        micro: '200ms',
        conteo: '280ms',
        revelado: '500ms',
        umbral: '600ms',
        titular: '650ms',
      },

      borderWidth: {
        hair: '1px',
      },

      textDecorationThickness: {
        hair: '1px',
      },

      keyframes: {
        'revelar-linea': {
          from: { clipPath: 'inset(100% 0 0 0)', transform: 'translateY(0.18em)' },
          to: { clipPath: 'inset(-20% 0 -20% 0)', transform: 'translateY(0)' },
        },
        'aparecer-suave': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'subir-suave': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'dibujar-linea': {
          from: { transform: 'scaleY(0)' },
          to: { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
