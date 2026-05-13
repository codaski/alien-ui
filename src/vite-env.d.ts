/// <reference types="vite/client" />

/**
 * Vite-injected env (see https://vite.dev/guide/env-and-mode)
 */
interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly DEV: boolean
  readonly MODE: string
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
