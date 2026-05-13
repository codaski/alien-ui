# Alien UI — Contributing Guide

How to add new components, write variants, extend the theme, and eject components
into your own project for full ownership.

> **Real reference implementation:** `src/components/forms/Input/` is the first
> fully-built component and the canonical example to follow for structure, typing,
> variants, and tests.

---

## Local testing before publishing

Before publishing to npm, test the package locally in a Nuxt 4 app:

```bash
# 1. Build the package
npm run build

# 2. Pack it into a tarball
npm pack

# 3. In your test Nuxt project
npm install /absolute/path/to/alien-ui-vue-0.1.0.tgz
```

Or use a file reference in the test project's `package.json`:
```json
"dependencies": {
  "@alien-ui/vue": "file:C:/Projects/alien-ui/Alien UI"
}
```

Then in `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  modules: ['@alien-ui/vue/nuxt'],
})
```

If you see duplicate Vue errors, extend `defineNuxtConfig` with:

```ts
export default defineNuxtConfig({
  vite: {
    resolve: {
      dedupe: ['vue'],
    },
  },
})
```

---

## Adding a new component

### Step 1 — Decide the category

| Category | Use when |
|---|---|
| `forms/` | The component captures user input (text, selection, toggle) |
| `blocks/` | The component is a composite container (card, modal, tabs) |
| `layout/` | The component controls spatial arrangement |
| `feedback/` | The component communicates state to the user (spinner, badge) |

### Step 2 — Create the folder

```
src/components/<category>/<ComponentName>/
├── ComponentName.vue
├── ComponentName.types.ts
├── ComponentName.variants.ts
├── index.ts
└── __tests__/
    └── ComponentName.spec.ts
```

Run the scaffold helper (creates all files with correct boilerplate):

```bash
npm run new:component -- --name MyComponent --category forms
```

### Step 3 — Define types first (`ComponentName.types.ts`)

```ts
// src/components/forms/MyComponent/MyComponent.types.ts
import type { VNode } from 'vue'

// ----- Props -----
export interface MyComponentProps {
  /** The current value */
  modelValue?: string
  /** Visual size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Disables interaction */
  disabled?: boolean
  /** Validation error message */
  error?: string
  /** Accessible label */
  label?: string
}

// ----- Emits -----
export interface MyComponentEmits {
  'update:modelValue': [value: string]
  'blur': []
  'focus': []
}

// ----- Slots -----
export interface MyComponentSlots {
  /** Content before the input */
  prefix?: () => VNode[]
  /** Content after the input */
  suffix?: () => VNode[]
}

// ----- Expose (imperative API) -----
export interface MyComponentExpose {
  focus: () => void
  blur: () => void
  reset: () => void
}
```

### Step 4 — Define variants (`ComponentName.variants.ts`)

```ts
// src/components/forms/MyComponent/MyComponent.variants.ts
import { cva, type VariantProps } from 'class-variance-authority'

export const myComponentVariants = cva(
  // ← base classes applied always
  [
    'inline-flex items-center w-full rounded border',
    'bg-surface text-sm text-foreground',
    'transition-colors duration-150',
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/50',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
      state: {
        default: 'border-border hover:border-primary/60',
        error:   'border-destructive focus-within:ring-destructive/50',
        success: 'border-success focus-within:ring-success/50',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50 pointer-events-none',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
)

// Export variant prop types for use in the component's props interface
export type MyComponentVariants = VariantProps<typeof myComponentVariants>
```

### Step 5 — Implement the component (`ComponentName.vue`)

```vue
<!-- src/components/forms/MyComponent/MyComponent.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useField } from 'reka-ui'          // ← Reka UI primitive (if applicable)
import { useLocale } from '@/composables/useLocale'
import { cn } from '@/utils/cn'
import { myComponentVariants } from './MyComponent.variants'
import type {
  MyComponentProps,
  MyComponentEmits,
  MyComponentSlots,
  MyComponentExpose,
} from './MyComponent.types'

// ── Props & Emits ──────────────────────────────────────────────────────────
const props = withDefaults(defineProps<MyComponentProps>(), {
  size:     'md',
  disabled: false,
})

const emit = defineEmits<MyComponentEmits>()

// ── Slots ──────────────────────────────────────────────────────────────────
defineSlots<MyComponentSlots>()

// ── i18n ───────────────────────────────────────────────────────────────────
const { t } = useLocale()

// ── Model ──────────────────────────────────────────────────────────────────
const model = defineModel<string>({ default: '' })

// ── Computed ───────────────────────────────────────────────────────────────
const state = computed(() => (props.error ? 'error' : 'default'))

const rootClass = computed(() =>
  cn(
    myComponentVariants({ size: props.size, state: state.value, disabled: props.disabled }),
  )
)

// ── Expose ─────────────────────────────────────────────────────────────────
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

defineExpose<MyComponentExpose>({
  focus: () => inputRef.value?.focus(),
  blur:  () => inputRef.value?.blur(),
  reset: () => { model.value = '' },
})
</script>

<template>
  <div :class="rootClass">
    <!-- Prefix slot -->
    <slot name="prefix" />

    <input
      ref="inputRef"
      v-model="model"
      v-bind="$attrs"
      :disabled="disabled"
      :placeholder="t('alien-ui.input.placeholder')"
      class="flex-1 bg-transparent outline-none"
      @blur="emit('blur')"
      @focus="emit('focus')"
    />

    <!-- Suffix slot -->
    <slot name="suffix" />
  </div>

  <!-- Error message -->
  <p v-if="error" class="mt-1 text-xs text-destructive" role="alert">
    {{ error }}
  </p>
</template>
```

### Step 6 — Barrel export (`index.ts`)

```ts
// src/components/forms/MyComponent/index.ts

// Component
export { default as AlienMyComponent } from './MyComponent.vue'

// Types (consumers can import these for typed usage)
export type {
  MyComponentProps,
  MyComponentEmits,
  MyComponentSlots,
  MyComponentExpose,
} from './MyComponent.types'

// Variants (consumers can extend or override)
export { myComponentVariants } from './MyComponent.variants'
export type { MyComponentVariants } from './MyComponent.variants'
```

### Step 7 — Add to category barrel

```ts
// src/components/forms/index.ts
export * from './Input'
export * from './MyComponent'   // ← add here
```

### Step 8 — Add locale keys

```json5
// src/locales/en.json  (required, must be complete)
{
  "alien-ui": {
    "my-component": {
      "placeholder": "Enter a value",
      "clear": "Clear"
    }
  }
}
```

### Step 9 — Write tests

```ts
// src/components/forms/MyComponent/__tests__/MyComponent.spec.ts
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { AlienMyComponent } from '../index'

describe('AlienMyComponent', () => {
  it('renders with correct role', () => {
    render(AlienMyComponent, { props: { label: 'Name' } })
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeTruthy()
  })

  it('is disabled when disabled prop is true', () => {
    render(AlienMyComponent, { props: { disabled: true } })
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('shows error message when error prop is set', () => {
    render(AlienMyComponent, { props: { error: 'Required field' } })
    expect(screen.getByRole('alert').textContent).toContain('Required field')
  })
})
```

---

## Extending the theme

### Adding tokens

Add new CSS variables to `src/styles/tokens.css`:

```css
:root {
  --alien-brand-accent: 265 90% 60%;
}
```

Then extend `tailwind.config.ts`:

```ts
colors: {
  'brand-accent': 'hsl(var(--alien-brand-accent) / <alpha-value>)',
}
```

### Overriding tokens in a consumer project

```css
/* your-app/assets/main.css */
@import "@alien-ui/vue/styles";

:root {
  /* Override just what you need */
  --alien-primary: 265 90% 60%;
  --alien-radius:  1rem;
}
```

---

## Ejecting a component (full ownership)

### Via CLI

```bash
npx alien-ui eject Input
# Copies src/components/forms/Input/ → <project>/components/alien/Input/
```

### Manual eject

1. Copy `node_modules/@alien-ui/vue/src/components/forms/Input/` into your project.
2. Configure the resolver in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@alien-ui/vue/nuxt'],
  alienUI: {
    ejectDir: '~/components/alien',
  },
})
```

3. Alien UI will resolve `AlienInput` from your local copy first.

### After ejecting

- The ejected component is entirely yours — update it freely.
- You receive no automatic updates to that component from new Alien UI releases.
- You can still import the rest of the library normally.

---

## Writing a new composable

```ts
// src/composables/useMyFeature.ts

import { ref, computed } from 'vue'

// ── Types ──────────────────────────────────────────────────────────────────
export interface UseMyFeatureOptions {
  initialValue?: string
}

export interface UseMyFeatureReturn {
  value: Ref<string>
  isEmpty: ComputedRef<boolean>
  reset: () => void
}

// ── Implementation ─────────────────────────────────────────────────────────
/**
 * A reusable composable for managing X.
 *
 * @example
 * const { value, isEmpty, reset } = useMyFeature({ initialValue: 'hello' })
 */
export function useMyFeature(options: UseMyFeatureOptions = {}): UseMyFeatureReturn {
  const { initialValue = '' } = options

  const value   = ref(initialValue)
  const isEmpty = computed(() => value.value.trim().length === 0)

  function reset() {
    value.value = initialValue
  }

  return { value, isEmpty, reset }
}
```

Then export from the composables barrel:

```ts
// src/composables/index.ts
export * from './useMyFeature'
```

---

## Release checklist

Before opening a PR for a new component:

- [ ] `ComponentName.types.ts` — all props, emits, slots, expose typed
- [ ] `ComponentName.variants.ts` — all visual states covered with `cva`
- [ ] `ComponentName.vue` — `<script setup lang="ts">`, `v-bind="$attrs"` on root native element
- [ ] `index.ts` — component, types, and variants all explicitly exported
- [ ] Category `index.ts` updated
- [ ] `src/locales/en.json` — all user-facing strings added
- [ ] `__tests__/ComponentName.spec.ts` — role, disabled, error, and keyboard tests
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] `npm test` passes
