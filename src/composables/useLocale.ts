import { inject, type InjectionKey } from 'vue'

/**
 * Alien UI — locale accessor composable.
 *
 * Components call `useLocale()` to get a translation function.
 * The function is injected by `createAlienUI()` so it can delegate
 * to the consumer's vue-i18n instance (or any other i18n provider).
 *
 * Fallback: returns the key itself when no provider is installed
 * (useful in unit tests and when running standalone).
 */

// ── Types ──────────────────────────────────────────────────────────────────

export type TranslateFn = (key: string, values?: Record<string, unknown>) => string

export interface AlienLocaleContext {
  t:      TranslateFn
  locale: string
}

// ── Injection key ──────────────────────────────────────────────────────────

export const ALIEN_LOCALE_KEY: InjectionKey<AlienLocaleContext> = Symbol('alien-locale')

// ── Composable ─────────────────────────────────────────────────────────────

/**
 * Access Alien UI's translation function inside any component.
 *
 * @example
 * const { t } = useLocale()
 * t('alien-ui.input.placeholder')
 */
export function useLocale(): AlienLocaleContext {
  const ctx = inject(ALIEN_LOCALE_KEY, null)

  if (ctx) return ctx

  // Fallback when no provider (dev warning in development)
  if (import.meta.env.DEV) {
    console.warn('[alien-ui] useLocale(): no locale provider found. '
      + 'Make sure you called app.use(createAlienUI()).')
  }

  return {
    locale: 'en',
    t:      (key: string) => key,
  }
}
