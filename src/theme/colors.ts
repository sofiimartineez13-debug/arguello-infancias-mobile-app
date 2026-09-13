/**
 * Colores del design system, en TypeScript.
 *
 * Reexporta `design-tokens.json` (misma fuente que consume `tailwind.config.js`)
 * con nombres planos en camelCase, para los casos que `className` no cubre:
 * el prop `color` de `Ionicons`/`ActivityIndicator`, `placeholderTextColor`, etc.
 *
 * No inventa valores nuevos — si un color cambia, cambia acá porque cambió en
 * `design-tokens.json`, no al revés.
 */
import tokens from '../../design-tokens.json';

const c = tokens.color;

export const colors = {
  arguelloBlue: c.arguello.blue,
  arguelloBluePressed: c.arguello.bluePressed,
  arguelloPurple: c.arguello.purple,
  arguelloTeal: c.arguello.teal,

  success: c.semantic.success,
  warning: c.semantic.warning,
  streak: c.semantic.streak,
  error: c.semantic.error,
  errorPressed: c.semantic.errorPressed,
  info: c.semantic.info,

  textPrimary: c.neutral.textPrimary,
  textSecondary: c.neutral.textSecondary,
  textDisabled: c.neutral.textDisabled,
  border: c.neutral.border,
  surface: c.neutral.surface,
  background: c.neutral.background,

  badgeSuccessBg: c.badge.successBg,
  badgeSuccessText: c.badge.successText,
  badgePendingBg: c.badge.pendingBg,
  badgePendingText: c.badge.pendingText,
  badgeProgressBg: c.badge.progressBg,
  badgeProgressText: c.badge.progressText,
  badgeLockedBg: c.badge.lockedBg,
  badgeLockedText: c.badge.lockedText,
} as const;
