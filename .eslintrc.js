// @ts-check
import antfu from '@antfu/eslint-config'

/**
 * Alien UI — ESLint configuration.
 * Uses @antfu/eslint-config as a base (includes Vue, TypeScript, import rules).
 */
export default antfu(
  {
    // Enable Vue SFC linting
    vue: true,

    // Enable TypeScript linting
    typescript: {
      tsconfigPath: './tsconfig.json',
    },

    // Style rules (formatters handle whitespace — ESLint handles logic)
    stylistic: false,
  },

  // ── Custom overrides ─────────────────────────────────────────────────────
  {
    rules: {
      // Enforce explicit return types on exports
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      // No `any` — ever
      '@typescript-eslint/no-explicit-any': 'error',

      // No `@ts-ignore` without explanation
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': 'allow-with-description',
      }],

      // Consistent type imports
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      }],

      // Vue: component names must be multi-word (e.g. AlienInput, not Input)
      'vue/multi-word-component-names': 'error',

      // Vue: always use <script setup>
      'vue/component-api-style': ['error', ['script-setup']],

      // Vue: v-bind="$attrs" must be on the root native element
      'vue/no-unused-vars': 'error',

      // No barrel re-exports with `*` (explicit exports only)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:  'Use explicit named exports instead of export * (tree-shaking)',
        },
      ],
    },
  },
)
