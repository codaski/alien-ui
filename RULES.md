# Alien UI — Development Rules

These rules are **non-negotiable** for all code merged into this repository.
They exist to guarantee a consistent, maintainable, and consumer-friendly library.

---

## 1. TypeScript rules

### 1.1 Strict mode — always on

Every file compiles under `"strict": true`. No exceptions, no `@ts-ignore` without a comment explaining why.

```jsonc
// tsconfig.json (enforced)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true
  }
}
```

### 1.2 No `any` — ever

Use `unknown` when the type is genuinely unknown. Use generics when type flows through.
`any` is a lint error (`@typescript-eslint/no-explicit-any`).

### 1.3 Explicit return types on all exported functions and composables

```ts
// ✅ correct
export function useField(name: string): UseFieldReturn { … }

// ❌ wrong — return type inferred, breaks consumers on refactor
export function useField(name: string) { … }
```

### 1.4 Props and emits must be typed with `defineProps<T>()` and `defineEmits<T>()`

```vue
<script setup lang="ts">
// ✅ correct
const props = defineProps<{
  label: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  change: [value: string]
  blur: []
}>()
</script>
```

### 1.5 Slot types must be declared

```ts
// types/slots.ts
export interface InputSlots {
  default?: () => VNode[]
  prefix?: () => VNode[]
  suffix?: () => VNode[]
}
```

---

## 2. Component rules

### 2.1 One component per folder

Every component lives in its own folder with a consistent internal structure:

```
src/components/forms/Input/
├── Input.vue           # Component implementation
├── Input.types.ts      # Props, Emits, Slot interfaces
├── Input.variants.ts   # cva() variant definitions
├── index.ts            # Public barrel export
└── __tests__/
    └── Input.spec.ts
```

### 2.2 Reka UI as the behaviour foundation

All interactive components **must** be built on Reka UI primitives.
Do not reimplement focus management, keyboard navigation, ARIA, or portal logic from scratch.

```vue
<!-- ✅ correct — behaviour from Reka UI -->
<script setup lang="ts">
import { SelectRoot, SelectTrigger, SelectContent } from 'reka-ui'
</script>

<!-- ❌ wrong — custom native implementation -->
<div @keydown="handleKeydown" role="listbox" …>
```

### 2.3 Styling via `cva` (class-variance-authority)

All component variants are declared using `cva`. No inline ternaries for class logic.

```ts
// Input.variants.ts
import { cva } from 'class-variance-authority'

export const inputVariants = cva(
  // base classes always applied
  'w-full rounded-[--alien-radius] border bg-surface text-sm transition-colors',
  {
    variants: {
      size: {
        sm: 'h-8 px-2',
        md: 'h-10 px-3',
        lg: 'h-12 px-4',
      },
      state: {
        default: 'border-border focus:border-primary',
        error:   'border-destructive focus:border-destructive',
        success: 'border-success focus:border-success',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
)
```

### 2.4 No hardcoded colours

All colour values must reference a Tailwind utility that is backed by an `--alien-*`
CSS variable (mapped via `@theme` in `src/styles/base.css`):

```ts
// ✅ correct — Tailwind utility class backed by --alien-primary (via @theme)
'bg-primary text-primary-foreground'

// ✅ also correct — arbitrary CSS var reference when no utility exists yet
'bg-[hsl(var(--alien-primary))]'

// ❌ wrong — hardcoded colour, breaks theming
'bg-blue-600 text-white'
```

> **Tailwind v4 note:** There is no `tailwind.config.ts`. All token-to-utility mappings
> live in `src/styles/base.css` under the `@theme` directive.

### 2.5 Component API contract

Every component must expose these in order (if applicable):

| Layer | Rule |
|---|---|
| **Props** | All optional props have typed defaults |
| **Emits** | Emit names use `camelCase`, payload types are explicit |
| **Slots** | Named slots preferred over default-only; always typed |
| **Expose** | Use `defineExpose` only for public imperative API (e.g. `focus()`, `reset()`) |
| **Attrs** | Pass `v-bind="$attrs"` to the root native element (not the wrapper) |

### 2.6 SSR safety

- Never access `window`, `document`, `navigator`, or `localStorage` at the **module level**.
- Wrap browser APIs in `onMounted` or guard with `if (typeof window !== 'undefined')`.
- All async data must work with `useAsyncData` / `useFetch` in Nuxt context.

```ts
// ✅ correct
onMounted(() => {
  observer = new IntersectionObserver(…)
})

// ❌ wrong — breaks SSR
const observer = new IntersectionObserver(…) // module level
```

---

## 3. Composable rules

### 3.1 File and naming convention

All composables live in `src/composables/`. File name = export name.

```
src/composables/
├── useField.ts
├── useFormGroup.ts
├── useTheme.ts
├── useLocale.ts
└── useVariants.ts
```

### 3.2 Composables return a typed object — never an array (unless it is a pair)

```ts
// ✅ correct — named return
export function useField(name: string): UseFieldReturn {
  return { value, error, validate, reset }
}

// ❌ wrong — positional return breaks destructuring refactors
export function useField(name: string) {
  return [value, error, validate]
}
```

### 3.3 Composables must be callable outside `<script setup>`

Don't depend on Vue's injection context implicitly. Accept context via parameters where needed.

---

## 4. Validation rules

### 4.1 Zod v4 is the schema language — pass directly to VeeValidate v5

All form validation schemas use **Zod v4**. VeeValidate v5 consumes Zod schemas
**directly** via the Standard Schema spec — **no `toTypedSchema()`, no adapter, no
`@vee-validate/zod` package**.

```ts
import { z } from 'zod'
import { useForm } from 'vee-validate'

const schema = z.object({
  email: z.string().email(),
  age:   z.number().min(18),
})

// ✅ correct — pass schema directly, VeeValidate v5 reads Standard Schema natively
const { handleSubmit, errors } = useForm({ validationSchema: schema })

// ❌ wrong — toTypedSchema() no longer exists in vee-validate v5
// const { handleSubmit } = useForm({ validationSchema: toTypedSchema(schema) })
```

### 4.2 Never import `@vee-validate/zod`

That package is **deprecated** as of VeeValidate v5 and is incompatible with Zod v4.
It must not appear anywhere in this codebase.

### 4.3 Use `InferSchema<typeof schema>` for type inference

```ts
import type { InferSchema } from 'alien-ui'

const schema = z.object({ email: z.string() })
type FormData = InferSchema<typeof schema>
// → { email: string }
```

### 4.4 Validation errors display through the component's `error` prop

Never render raw VeeValidate error DOM outside of a component.
Components accept an `error?: string` prop and render it consistently.

### 4.5 Field names match schema keys exactly

The `name` prop on a form field must match the Zod schema key exactly. No magic string mapping.

---

## 5. i18n rules

### 5.1 All user-facing strings go through `t()`

No hardcoded English strings in component templates.

```vue
<!-- ✅ correct -->
<span>{{ t('alien-ui.input.placeholder') }}</span>

<!-- ❌ wrong -->
<span>Enter a value</span>
```

### 5.2 Locale key namespace

All library keys are namespaced under `alien-ui.*` to avoid collision with app keys.

```json
{
  "alien-ui": {
    "input": { "placeholder": "Enter a value", "clear": "Clear" },
    "select": { "placeholder": "Select an option" },
    "validation": {
      "required": "This field is required",
      "email":    "Enter a valid email address"
    }
  }
}
```

### 5.3 English (`en`) is the fallback locale — always complete

The `src/locales/en.json` file must be 100% complete at all times.
Other locales may be partial; missing keys fall back to English.

---

## 6. File and folder conventions

### 6.1 Naming

| Artefact | Convention | Example |
|---|---|---|
| Component file | `PascalCase.vue` | `DatePicker.vue` |
| Composable file | `camelCase.ts` | `useField.ts` |
| Type file | `PascalCase.types.ts` | `Button.types.ts` |
| Variant file | `PascalCase.variants.ts` | `Button.variants.ts` |
| Locale file | `ISO-639-1.json` | `ar.json`, `fr.json` |
| Test file | `Name.spec.ts` | `Input.spec.ts` |
| Barrel export | `index.ts` | (every folder) |

### 6.2 Barrel exports — always explicit

```ts
// ✅ correct — explicit named exports
export { Input } from './Input.vue'
export type { InputProps, InputEmits } from './Input.types'
export { inputVariants } from './Input.variants'

// ❌ wrong — wildcard re-exports bloat consumer bundles
export * from './Input.vue'
```

### 6.3 Circular imports are forbidden

No component may import another component directly.
Cross-component dependencies go through composables or utility functions.

---

## 7. Testing rules

### 7.1 Every component has a `__tests__/` folder

Tests live next to the component, not in a global `tests/` directory.

### 7.2 Test what the user experiences, not implementation details

```ts
// ✅ correct — tests rendered output and accessibility
expect(screen.getByRole('textbox')).toBeDisabled()

// ❌ wrong — tests internal state
expect(wrapper.vm.internalValue).toBe('')
```

### 7.3 Accessibility assertions are mandatory

Every interactive component test must include at least one `toHaveRole` or `toHaveAccessibleName` assertion.

---

## 8. Git and PR rules

### 8.1 Commit format — Conventional Commits

```
feat(Input): add clearable variant
fix(Select): keyboard navigation on mobile Safari
docs(RULES): add SSR safety section
chore: bump Reka UI to 2.1.0
```

### 8.2 Every PR that adds a component must include

- [ ] Component implementation
- [ ] TypeScript types file
- [ ] Variants file
- [ ] Barrel export updated
- [ ] Unit tests
- [ ] Locale keys in `en.json`

### 8.3 Breaking changes require a deprecation notice one minor version before removal

---

## 9. Performance rules

- Tree-shaking must work: never use side-effect imports in component files.
- No component should import the entire library — only what it uses.
- Avoid `watch` with `deep: true` unless absolutely required; prefer `watchEffect` or targeted watchers.
- Images and icons are never bundled into components — consumers provide them.

---

## 10. Accessibility rules

- All interactive elements must have an accessible name (via `aria-label`, `aria-labelledby`, or visible text).
- Focus must be visible at all times (no `outline: none` without a replacement).
- Colour contrast must meet WCAG 2.1 AA (4.5:1 for text, 3:1 for large text).
- Keyboard navigation must be complete — no mouse-only interactions.
- Components must not trap focus unexpectedly (Reka UI handles this for dialogs/popovers).
