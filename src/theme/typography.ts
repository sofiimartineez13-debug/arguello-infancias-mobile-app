/**
 * Tipografía del design system, en TypeScript.
 *
 * Reexporta `design-tokens.json` (tamaños) unificado con los `lineHeight`
 * ya definidos en `tailwind.config.js` — no se reinventan valores nuevos.
 */
import tokens from '../../design-tokens.json';

export const fontFamily = tokens.font.family;

export const fontSize = {
  caption: { size: tokens.font.size.caption, lineHeight: 15 },
  bodySmall: { size: tokens.font.size.bodySmall, lineHeight: 20 },
  bodyMedium: { size: tokens.font.size.bodyMedium, lineHeight: 22 },
  bodyLarge: { size: tokens.font.size.bodyLarge, lineHeight: 26 },
  h4: { size: tokens.font.size.h4, lineHeight: 22 },
  h3: { size: tokens.font.size.h3, lineHeight: 26 },
  h2: { size: tokens.font.size.h2, lineHeight: 31 },
  h1: { size: tokens.font.size.h1, lineHeight: 38 },
} as const;
