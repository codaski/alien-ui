import type { NuxtApp } from 'nuxt/app'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { createAlienUI } from './index'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const config = useRuntimeConfig()
  const alienConfig = (config.public as Record<string, unknown>).alienUI as {
    locale?: string
    colorMode?: string
  } | undefined

  nuxtApp.vueApp.use(createAlienUI({
    locale:    alienConfig?.locale    ?? 'en',
    colorMode: (alienConfig?.colorMode as 'light' | 'dark' | 'system') ?? 'system',
  }))
})
