import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'

/**
 * Alien UI — Vite library build config.
 *
 * Tailwind CSS v4 is wired in via @tailwindcss/vite — no PostCSS config,
 * no tailwind.config.ts. The CSS file (src/styles/base.css) IS the config.
 *
 * Tailwind v4 Vite docs: https://tailwindcss.com/docs/installation/using-vite
 *
 * Outputs:
 *   dist/index.mjs          — main ESM bundle
 *   dist/variants.mjs       — variants sub-entry
 *   dist/nuxt.mjs           — Nuxt module entry
 *   dist/styles/index.css   — compiled Tailwind CSS (with --alien-* tokens)
 *   dist/**\/*.d.ts           — TypeScript declarations
 */
export default defineConfig({
  plugins: [
    // Tailwind CSS v4 — must come before @vitejs/plugin-vue
    tailwindcss(),

    // Vue 3 SFC compilation
    vue(),

    // TypeScript declaration generation
    dts({
      include:      ['src/**/*.ts', 'src/**/*.vue'],
      outDir:       'dist',
      staticImport: true,
      rollupTypes:  true,
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    // ── Library mode ──────────────────────────────────────────────────────
    lib: {
      entry: {
        index:    resolve(__dirname, 'src/index.ts'),
        variants: resolve(__dirname, 'src/variants.ts'),
        nuxt:     resolve(__dirname, 'src/nuxt.ts'),
      },
      formats: ['es'],
    },

    // ── Rollup options ─────────────────────────────────────────────────────
    rollupOptions: {
      // Never bundle peer deps — consumers provide them
      external: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/core',
        'vee-validate',
        'zod',
        'reka-ui',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        /^@floating-ui\/.*/,
        /^reka-ui\/.*/,
        '#app',
        'nuxt/app',
        '@nuxt/kit',
      ],
      output: {
        // Preserve module tree for per-component tree-shaking
        preserveModules:     true,
        preserveModulesRoot: 'src',
        entryFileNames:      '[name].mjs',
        chunkFileNames:      '[name]-[hash].mjs',
      },
    },

    // ── Output ─────────────────────────────────────────────────────────────
    outDir:      'dist',
    emptyOutDir: true,
    sourcemap:   true,
    cssCodeSplit: false,   // Single CSS bundle — easier for consumers to import
    minify:      false,    // Consumers handle minification
    target:      'esnext',
  },

  // ── Vitest ─────────────────────────────────────────────────────────────────
  test: {
    environment: 'happy-dom',
    globals:     true,
    include:     ['src/**/__tests__/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
