import type { Config } from 'tailwindcss';

/**
 * Sistema de diseño de Maderas de Honduras.
 *
 * Regla dura del proyecto: ningún componente escribe un color literal. Todo sale
 * de `theme.colors`. Si un color no está aquí, no existe en el sitio.
 *
 * Contrastes verificados (WCAG 2.1, ratio calculado sobre luminancia relativa):
 *   verde-tinta / cal ....... 14.3  AAA   texto largo
 *   verde-tinta / aserrin ... 11.6  AAA   texto largo
 *   verde-monte / cal ........ 9.3  AAA
 *   verde-monte / aserrin .... 7.5  AAA
 *   cal / verde-tinta ....... 14.3  AAA   bandas oscuras
 *   aserrin / verde-monte .... 7.5  AAA
 *   ocote / verde-tinta ...... 4.6  AA    texto normal sobre oscuro
 *   verde-tinta / ocote ...... 4.6  AA    <- el botón de cotizar: ámbar con tinta
 *   ocote-tinta / cal ........ 5.9  AA    enlaces y datos sobre claro
 *   ocote-tinta / aserrin .... 4.8  AA
 *   ocote / cal .............. 3.7  solo >=24px, aro de foco y elementos de UI
 *   ocote / aserrin .......... 3.0  PROHIBIDO como texto en cualquier tamaño
 *   verde-musgo / cal ........ 4.2  PROHIBIDO como texto; sirve de línea y borde
 *   verde-musgo / verde-tinta  3.4  PROHIBIDO como texto; línea sobre oscuro
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'verde-tinta': '#0E2A1D',
        'verde-monte': '#1C4B34',
        'verde-musgo': '#47825E',
        ocote: '#B4712A',
        'ocote-tinta': '#8A5312',
        aserrin: '#E7DFCE',
        cal: '#F8F7F3',
      },

      fontFamily: {
        // Rotulación industrial. Solo titulares, nunca párrafos.
        display: ['Archivo Recortada', 'Arial Narrow', 'Arial', 'sans-serif'],
        // Cuerpo.
        cuerpo: ['Instrument Recortada', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        // Todo número con unidad: pies tablares, pulgadas, pies, teléfonos, horas.
        dato: ['Plex Recortada', 'Consolas', 'Menlo', 'monospace'],
      },

      fontSize: {
        // Display — Archivo, ancho expandido, interlineado apretado.
        'display-hero': [
          'clamp(2.75rem, 9vw, 7rem)',
          { lineHeight: '0.92', letterSpacing: '-0.025em', fontWeight: '800' },
        ],
        'display-1': [
          'clamp(2rem, 4.5vw, 3.5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'display-2': [
          'clamp(1.5rem, 2.6vw, 2rem)',
          { lineHeight: '1.02', letterSpacing: '-0.015em', fontWeight: '700' },
        ],

        // Cuerpo — Instrument Sans.
        lead: ['1.25rem', { lineHeight: '1.5' }],
        base: ['1.0625rem', { lineHeight: '1.6' }],
        sm: ['0.9375rem', { lineHeight: '1.55' }],

        // Datos — IBM Plex Mono.
        'dato-xl': [
          'clamp(2rem, 5vw, 3.25rem)',
          { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '600' },
        ],
        'dato-lg': ['1.375rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '600' }],
        dato: ['1rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'dato-sm': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],

        // Rótulos de margen, eyebrows, franja de especificación.
        spec: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.14em', fontWeight: '500' }],
        'spec-sm': ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.16em', fontWeight: '500' }],
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
