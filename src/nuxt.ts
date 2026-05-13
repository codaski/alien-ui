import { existsSync } from 'node:fs'
import { defineNuxtModule, addPlugin, addComponent, createResolver, addImportsDir, logger } from '@nuxt/kit'
import type { Nuxt, ComponentsDir } from 'nuxt/schema'
import type { AlienUIOptions } from './plugin'

/**
 * Alien UI — Nuxt module.
 *
 * Usage in nuxt.config.ts:
 *   modules: ['@codaski/alien-ui/nuxt']
 *
 * With options:
 *   modules: [['@codaski/alien-ui/nuxt', { locale: 'ar', colorMode: 'dark' }]]
 *
 * Or via alienUI key:
 *   alienUI: { locale: 'ar' }
 */

export interface AlienUIModuleOptions extends AlienUIOptions {
  /**
   * Directory for ejected (locally overridden) components.
   * Alien UI will prefer components from this directory over the package.
   * @default '~/components/alien'
   */
  ejectDir?: string

  /**
   * Prefix for auto-imported components.
   * @default 'Alien'
   * @example 'Alien' → <AlienInput />, <AlienButton />
   */
  prefix?: string
}

export default defineNuxtModule<AlienUIModuleOptions>({
  meta: {
    name:          '@codaski/alien-ui',
    configKey:     'alienUI',
    compatibility: { nuxt: '>=3.10.0' },
  },

  defaults: {
    locale:    'en',
    colorMode: 'system',
    ejectDir:  '~/components/alien',
    prefix:    'Alien',
  },

  async setup(options: AlienUIModuleOptions, nuxt: Nuxt) {
    const resolver = createResolver(import.meta.url)

    // ── Auto-import CSS (absolute path — bare `@scope/pkg/styles` in `css[]` is not resolved via package exports) ──
    nuxt.options.css.push(resolver.resolve('./styles/index.css'))

    // ── Tailwind v4 is required in the consumer app (styles import `tailwindcss`) ──
    const moduleId = (m: unknown): string =>
      typeof m === 'string' ? m : Array.isArray(m) && typeof m[0] === 'string' ? m[0] : ''
    const hasTailwindModule = nuxt.options.modules?.some((m: unknown) => {
      const id = moduleId(m)
      return id.includes('tailwindcss') || id.includes('@tailwindcss')
    }) ?? false
    const vitePlugins = (typeof nuxt.options.vite === 'object' && nuxt.options.vite && 'plugins' in nuxt.options.vite && Array.isArray((nuxt.options.vite as { plugins?: unknown }).plugins)
      ? (nuxt.options.vite as { plugins: unknown[] }).plugins
      : []) as unknown[]
    const hasTailwindVite = vitePlugins.some((p: unknown) =>
      p && typeof p === 'object' && 'name' in p && typeof (p as { name: unknown }).name === 'string'
        ? (p as { name: string }).name.includes('tailwindcss')
        : false
    )
    if (!hasTailwindModule && !hasTailwindVite) {
      logger.warn(
        '[@codaski/alien-ui] Install and configure Tailwind CSS v4 and @tailwindcss/vite in your Nuxt app so Alien UI styles compile (see README, Nuxt 4 section).',
      )
    }

    // ── Register Nuxt plugin (injects createAlienUI) ─────────────────────
    addPlugin({ src: resolver.resolve('./plugin/nuxt-runtime'), mode: 'all' })

    // ── Auto-import composables ───────────────────────────────────────────
    addImportsDir(resolver.resolve('./composables'))

    // ── Register auto-imported components ─────────────────────────────────
    const prefix = options.prefix ?? 'Alien'

    addComponent({
      name: `${prefix}Input`,
      // Built `Input.mjs` only exposes `default` (compiled SFC), not named `AlienInput`.
      filePath: resolver.resolve('./components/forms/Input/Input'),
    })

    // ── Eject dir — prepend local overrides so they win over package ──────
    if (options.ejectDir) {
      const dirRaw = options.ejectDir.startsWith('~/')
        ? createResolver(nuxt.options.rootDir).resolve(options.ejectDir.slice(2))
        : createResolver(nuxt.options.rootDir).resolve(options.ejectDir)

      nuxt.hook('components:dirs', (dirs: (string | ComponentsDir)[]) => {
        if (!existsSync(dirRaw))
          return
        dirs.unshift({
          path:   dirRaw,
          prefix: '',
        })
      })
    }

    // ── Pass options to runtime config ────────────────────────────────────
    nuxt.options.runtimeConfig.public.alienUI = {
      locale:    options.locale    ?? 'en',
      colorMode: options.colorMode ?? 'system',
    }
  },
})
