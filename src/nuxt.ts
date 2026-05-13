import { defineNuxtModule, addPlugin, addComponent, createResolver, addImportsDir } from '@nuxt/kit'
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

  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // ── Auto-import CSS ──────────────────────────────────────────────────
    nuxt.options.css.push('@codaski/alien-ui/styles')

    // ── Register Nuxt plugin (injects createAlienUI) ─────────────────────
    addPlugin({ src: resolver.resolve('./plugin/nuxt-runtime'), mode: 'all' })

    // ── Auto-import composables ───────────────────────────────────────────
    addImportsDir(resolver.resolve('./composables'))

    // ── Register auto-imported components ─────────────────────────────────
    const prefix = options.prefix ?? 'Alien'

    addComponent({
      name:     `${prefix}Input`,
      export:   'AlienInput',
      filePath: resolver.resolve('./components/forms/Input/index'),
    })

    // ── Eject dir — prepend local overrides so they win over package ──────
    if (options.ejectDir) {
      const dirRaw = options.ejectDir.startsWith('~/')
        ? createResolver(nuxt.options.rootDir).resolve(options.ejectDir.slice(2))
        : createResolver(nuxt.options.rootDir).resolve(options.ejectDir)

      nuxt.hook('components:dirs', (dirs) => {
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
