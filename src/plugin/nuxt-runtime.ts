import type { NuxtApp } from 'nuxt/app'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import type { AlienColorMode } from '@/types'
import { createAlienUI } from './index'

/** Shape of `runtimeConfig.public.alienUI` set by the Nuxt module */
interface AlienUIPublicRuntime {
  locale?: string
  colorMode?: AlienColorMode
}

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const config = useRuntimeConfig()
  const alienConfig = (config.public as { alienUI?: AlienUIPublicRuntime }).alienUI

  nuxtApp.vueApp.use(createAlienUI({
    locale:    alienConfig?.locale    ?? 'en',
    colorMode: alienConfig?.colorMode ?? 'system',
  }))
})
