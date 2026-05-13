import { inject, type InjectionKey } from 'vue'
import type { AlienThemeConfig, AlienColorMode } from '@/types'

/**
 * Alien UI — theme composable.
 *
 * Provides access to the active theme configuration and colour mode.
 * CSS variable injection happens once in the plugin (createAlienUI),
 * not on every component mount — so this composable is read-only in components.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface AlienThemeContext {
  /** The full theme configuration as provided to createAlienUI() */
  theme:     AlienThemeConfig
  /** Current colour mode */
  colorMode: AlienColorMode
  /** Toggle between light and dark */
  toggle:    () => void
  /** Set a specific mode */
  setMode:   (mode: AlienColorMode) => void
}

// ── Injection key ──────────────────────────────────────────────────────────

export const ALIEN_THEME_KEY: InjectionKey<AlienThemeContext> = Symbol('alien-theme')

// ── Composable ─────────────────────────────────────────────────────────────

/**
 * Access Alien UI's theme context inside any component.
 *
 * @example
 * const { colorMode, toggle } = useTheme()
 */
export function useTheme(): AlienThemeContext {
  const ctx = inject(ALIEN_THEME_KEY, null)

  if (ctx) return ctx

  // Minimal fallback (no theme provider)
  return {
    theme:     {},
    colorMode: 'light',
    toggle:    () => {},
    setMode:   () => {},
  }
}
