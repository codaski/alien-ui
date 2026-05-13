/**
 * Alien UI — Main package entry point.
 *
 * Import path: `alien-ui`
 *
 * @example
 * import { createAlienUI, AlienInput } from 'alien-ui'
 * import 'alien-ui/styles'
 */

// ── Plugin ─────────────────────────────────────────────────────────────────
export { createAlienUI } from './plugin'
export type { AlienUIOptions } from './plugin'

// ── Components ─────────────────────────────────────────────────────────────
export * from './components'

// ── Composables ────────────────────────────────────────────────────────────
export { useLocale, useTheme, useVariants } from './composables'
export type { AlienLocaleContext, AlienThemeContext, TranslateFn } from './composables'

// ── Utils ──────────────────────────────────────────────────────────────────
export { cn, toAlienSchema, resolveFieldError } from './utils'

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  AlienSize,
  AlienFieldState,
  AlienColorMode,
  AlienBaseProps,
  AlienFormFieldProps,
  AlienThemeTokens,
  AlienThemeConfig,
  AlienMessages,
} from './types'
