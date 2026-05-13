/**
 * Alien UI — Main package entry point.
 *
 * Import path: `@codaski/alien-ui`
 *
 * @example
 * import { createAlienUI, AlienInput } from '@codaski/alien-ui'
 * import '@codaski/alien-ui/styles'
 */

import './styles/index.css'

// ── Plugin ─────────────────────────────────────────────────────────────────
export { createAlienUI } from './plugin'
export type { AlienUIOptions } from './plugin'

// ── Components ─────────────────────────────────────────────────────────────
export * from './components'

// ── Composables ────────────────────────────────────────────────────────────
export { useLocale, useTheme, useVariants } from './composables'
export type { AlienLocaleContext, AlienThemeContext, TranslateFn } from './composables'

// ── Utils ──────────────────────────────────────────────────────────────────
export { cn, resolveFieldError, useAlienId } from './utils'
export type { InferSchema } from './utils'

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
