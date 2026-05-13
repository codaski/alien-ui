import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'
import type { AlienUIOptions } from './plugin'

/**
 * Alien UI — Nuxt module.
 *
 * Usage in nuxt.config.ts:
 *   modules: ['alien-ui/nuxt']
 *
 * With options:
 *   modules: [['alien-ui/nuxt', { locale: 'ar', colorMode: 'dark' }]]
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
    name:          'alien-ui',
    configKey:     'alienUI',
    compatibility: { nuxt: '^3.0.0' },
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
    nuxt.options.css.push('alien-ui/styles')

    // ── Register Nuxt plugin (injects createAlienUI) ─────────────────────
    addPlugin(resolver.resolve('./plugin/nuxt-runtime'))

    // ── Auto-import composables ───────────────────────────────────────────
    addImportsDir(resolver.resolve('./composables'))

    // ── Pass options to runtime config ────────────────────────────────────
    nuxt.options.runtimeConfig.public.alienUI = {
      locale:    options.locale ?? 'en',
      colorMode: options.colorMode ?? 'system',
    }
  },
})
