// @ts-check
import antfu from '@antfu/eslint-config'

/**
 * Alien UI — ESLint flat config (ESLint 9+).
 * Uses @antfu/eslint-config — Vue + TypeScript + import rules.
 */
export default antfu(
  {
    ignores: [
      'dist/**',
      '**/node_modules/**',
      '.github/**',
      'eslint.config.js',
      '**/*.md',
      '**/*.json',
      'cli/**',
      'vite.config.ts',
      '**/__tests__/**',
      'scripts/**',
    ],
    markdown: false,
    vue:      true,
    typescript: {
      tsconfigPath: './tsconfig.json',
    },
    stylistic: false,
  },
  {
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any':               'error',
      '@typescript-eslint/ban-ts-comment':                ['error', {
        'ts-ignore': 'allow-with-description',
      }],
      // Keep noise low for a component library with many barrel files.
      'perfectionist/sort-imports':              'off',
      'perfectionist/sort-named-imports':        'off',
      'perfectionist/sort-exports':              'off',
      'perfectionist/sort-named-exports':        'off',
      'import/consistent-type-specifier-style':  'off',
      'ts/consistent-type-definitions':          'off',
      'ts/strict-boolean-expressions':         'off',
      'ts/no-unsafe-assignment':                 'off',
      'ts/no-unnecessary-type-assertion':        'off',
      'vue/multi-word-component-names':          ['error', { ignores: ['Input'] }],
      'vue/component-api-style':                 ['error', ['script-setup']],
      'vue/no-unused-vars':                      'error',
    },
  },
)
