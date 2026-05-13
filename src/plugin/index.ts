import { type App, ref } from 'vue'
import { createI18n } from 'vue-i18n'
import type { AlienThemeConfig, AlienColorMode } from '@/types'
import type { AlienMessages } from '@/types/i18n'
import { ALIEN_LOCALE_KEY, type AlienLocaleContext } from '@/composables/useLocale'
import { ALIEN_THEME_KEY, type AlienThemeContext } from '@/composables/useTheme'
import enMessages from '@/locales/en.json'

// ── Options ────────────────────────────────────────────────────────────────

export interface AlienUIOptions {
  /**
   * Active locale code. Defaults to 'en'.
   * @example 'ar', 'fr', 'es'
   */
  locale?: string

  /**
   * Additional or override locale messages merged into the library's built-in messages.
   * Use this to add new languages or override English strings.
   *
   * @example
   * messages: {
   *   ar: { 'alien-ui': { input: { placeholder: 'أدخل قيمة' } } }
   * }
   */
  messages?: Record<string, Partial<AlienMessages>>

  /**
   * Theme token overrides for light and/or dark mode.
   * Values are injected as --alien-* CSS custom properties.
   */
  theme?: AlienThemeConfig

  /**
   * Initial colour mode. Defaults to 'system'.
   */
  colorMode?: AlienColorMode

  /**
   * Directory where ejected components live (for Nuxt module).
   * @default '~/components/alien'
   */
  ejectDir?: string
}

// ── CSS variable injection ─────────────────────────────────────────────────

function applyTokens(tokens: Record<string, string>, selector: string): void {
  if (typeof document === 'undefined') return // SSR guard

  const style = document.createElement('style')
  const vars  = Object.entries(tokens)
    .map(([k, v]) => `  --alien-${k}: ${v};`)
    .join('\n')

  style.textContent = `${selector} {\n${vars}\n}`
  style.setAttribute('data-alien-theme', 'true')
  document.head.appendChild(style)
}

function kebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// ── Plugin factory ─────────────────────────────────────────────────────────

/**
 * Create and configure the Alien UI Vue plugin.
 *
 * @example
 * // main.ts
 * import { createAlienUI } from '@alien-ui/vue'
 * app.use(createAlienUI({ locale: 'ar', messages: { ar: arMessages } }))
 */
export function createAlienUI(options: AlienUIOptions = {}): { install: (app: App) => void } {
  return {
    install(app: App): void {
      const {
        locale    = 'en',
        messages  = {},
        theme     = {},
        colorMode = 'system',
      } = options

      // ── i18n setup ──────────────────────────────────────────────────────
      const mergedMessages: Record<string, AlienMessages> = {
        en: enMessages as AlienMessages,
        ...Object.fromEntries(
          Object.entries(messages).map(([lang, overrides]) => [
            lang,
            deepMerge(enMessages as AlienMessages, overrides as AlienMessages),
          ])
        ),
      }

      const i18n = createI18n({
        legacy:         false,
        locale,
        fallbackLocale: 'en',
        messages:       mergedMessages as unknown as NonNullable<NonNullable<Parameters<typeof createI18n>[0]>['messages']>,
        missingWarn:    false,
        fallbackWarn:   false,
      })

      app.use(i18n)

      const localeCtx: AlienLocaleContext = {
        locale,
        t: (key, values) => i18n.global.t(key, values ?? {}),
      }
      app.provide(ALIEN_LOCALE_KEY, localeCtx)

      // ── Theme setup ─────────────────────────────────────────────────────
      const mode = ref<AlienColorMode>(colorMode === 'system'
        ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light')
        : colorMode
      )

      // Inject CSS variables from theme config
      if (theme.light) {
        const lightVars: Record<string, string> = {}
        for (const [k, v] of Object.entries(theme.light)) {
          if (v) lightVars[kebab(k)] = v
        }
        applyTokens(lightVars, ':root')
      }
      if (theme.dark) {
        const darkVars: Record<string, string> = {}
        for (const [k, v] of Object.entries(theme.dark)) {
          if (v) darkVars[kebab(k)] = v
        }
        applyTokens(darkVars, '.dark')
      }

      // Sync .dark class on <html>
      function applyMode(m: AlienColorMode) {
        if (typeof document === 'undefined') return
        if (m === 'dark') {
          document.documentElement.classList.add('dark')
        }
        else {
          document.documentElement.classList.remove('dark')
        }
      }
      applyMode(mode.value)

      const themeCtx: AlienThemeContext = {
        theme,
        get colorMode() { return mode.value },
        toggle() {
          mode.value = mode.value === 'dark' ? 'light' : 'dark'
          applyMode(mode.value)
        },
        setMode(m) {
          mode.value = m === 'system'
            ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light')
            : m
          applyMode(mode.value)
        },
      }
      app.provide(ALIEN_THEME_KEY, themeCtx)
    },
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function deepMerge<T extends object>(base: T, override: Partial<T>): T {
  const result = { ...base }
  for (const key in override) {
    const o = override[key]
    const b = base[key]
    if (o && typeof o === 'object' && !Array.isArray(o) && b && typeof b === 'object') {
      result[key] = deepMerge(b as object, o as object) as T[typeof key]
    }
    else if (o !== undefined) {
      result[key] = o as T[typeof key]
    }
  }
  return result
}
