# Alien UI — Technology References

Every dependency used in this project, with rationale, version target, and official docs.

---

## Core dependencies

### Reka UI — Component primitives

| Property | Value |
|---|---|
| **Version target** | `^2.x` |
| **Docs** | https://reka-ui.com/docs/overview/getting-started |
| **GitHub** | https://github.com/unovue/reka-ui |
| **npm** | `reka-ui` |

**Why Reka UI?**
Reka UI (formerly Radix Vue) is a headless, unstyled component primitive library for Vue 3.
It provides battle-tested ARIA compliance, keyboard navigation, focus management, and portal
handling for every interactive component pattern — without imposing any visual opinion.
Building on top of Reka UI means we never maintain accessibility logic ourselves.

**Key modules used:**

| Reka Primitive | Used by |
|---|---|
| `SelectRoot / SelectContent` | `AlienSelect` |
| `DialogRoot / DialogContent` | `AlienModal`, `AlienDrawer` |
| `CheckboxRoot` | `AlienCheckbox` |
| `SwitchRoot` | `AlienSwitch` |
| `TabsRoot / TabsList / TabsContent` | `AlienTabs` |
| `AccordionRoot / AccordionItem` | `AlienAccordion` |
| `TooltipRoot / TooltipContent` | `AlienTooltip` |
| `PopoverRoot / PopoverContent` | `AlienPopover` |
| `ComboboxRoot` | `AlienCombobox` |
| `DatePickerRoot` | `AlienDatePicker` |
| `RadioGroupRoot` | `AlienRadio` |

**SSR note:** Reka UI 2.x is fully SSR-compatible when used with `@vueuse/core` >= 10.x.

---

### Tailwind CSS — Utility-first styling

| Property | Value |
|---|---|
| **Version target** | `^4.x` |
| **Docs** | https://tailwindcss.com/docs/installation/using-vite |
| **GitHub** | https://github.com/tailwindlabs/tailwindcss |
| **npm** | `tailwindcss` + `@tailwindcss/vite` |

**Why Tailwind CSS v4?**
Tailwind v4 is a complete rewrite with a **CSS-first configuration model** — there is
**no `tailwind.config.ts` or `tailwind.config.js`**. Everything is declared in CSS using
`@import`, `@theme`, and `@layer` directives. This results in faster builds (new Oxide engine),
smaller output, and simpler setup. Theme tokens, dark mode, and custom utilities are all
defined directly in your CSS file.

**Vite integration (required):**

```bash
npm install -D tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
})
```

**Library-specific CSS config (`src/styles/base.css`):**

```css
/* 1. Import Tailwind v4 */
@import "tailwindcss";

/* 2. Map design tokens to Tailwind utility classes via @theme */
@theme {
  --color-primary:   hsl(var(--alien-primary));
  --color-surface:   hsl(var(--alien-surface));
  --color-border:    hsl(var(--alien-border));
  --radius-DEFAULT:  var(--alien-radius);
  /* … all other tokens */
}
```

This generates utilities like `bg-primary`, `text-surface`, `border-border`, `rounded` —
pointing at the `--alien-*` CSS variables, which consumers can override in their own CSS.

**Key Tailwind v4 docs:**
- [Vite installation](https://tailwindcss.com/docs/installation/using-vite)
- [Theme variables with @theme](https://tailwindcss.com/docs/theme)
- [Dark mode](https://tailwindcss.com/docs/dark-mode)
- [CSS variables](https://tailwindcss.com/docs/css-variables)
- [Upgrade guide from v3](https://tailwindcss.com/docs/upgrade-guide)

**⚠️ No `tailwind.config.ts` — ever.** If you see one in this repo it is a mistake.
All Tailwind configuration lives in `src/styles/base.css`.

---

### TypeScript — Type safety

| Property | Value |
|---|---|
| **Version target** | `^5.4` |
| **Docs** | https://www.typescriptlang.org/docs/ |
| **npm** | `typescript` |

**Strict config required:**

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "jsx": "preserve",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "paths": {
      "alien-ui": ["./src/index.ts"]
    }
  }
}
```

---

## Vue ecosystem

### Vue 3

| Property | Value |
|---|---|
| **Version target** | `^3.5` |
| **Docs** | https://vuejs.org/guide/introduction |
| **Composition API** | https://vuejs.org/guide/extras/composition-api-faq |

**Key Vue 3.5+ features used:**

| Feature | Usage |
|---|---|
| `useId()` | SSR-safe unique IDs for form labels |
| `defineModel()` | Two-way binding in form components |
| `useTemplateRef()` | Typed template refs |
| `<script setup>` | All components use `<script setup lang="ts">` |

---

### Nuxt 3

| Property | Value |
|---|---|
| **Version target** | `^3.13` |
| **Docs** | https://nuxt.com/docs |
| **Modules** | https://nuxt.com/modules |

**Alien UI provides a Nuxt module** (`alien-ui/nuxt`) that:
- Auto-imports all components with the `Alien` prefix
- Injects the CSS automatically
- Supports the `ejectDir` option for local overrides
- Is compatible with Nuxt DevTools

---

## Validation stack

### Zod — Schema validation

| Property | Value |
|---|---|
| **Version target** | `^3.x` |
| **Docs** | https://zod.dev |
| **GitHub** | https://github.com/colinhacks/zod |
| **npm** | `zod` |

**Why Zod?**
Zod provides TypeScript-first runtime validation with excellent type inference.
A Zod schema both validates data at runtime AND generates the TypeScript type automatically —
eliminating the duplication of writing `interface + validator`.

**Usage pattern:**

```ts
import { z } from 'zod'

// Schema defines both runtime validation and TypeScript type
const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

type LoginData = z.infer<typeof loginSchema>
// → { email: string; password: string }
```

---

### VeeValidate — Form state management

| Property | Value |
|---|---|
| **Version target** | `^4.x` |
| **Docs** | https://vee-validate.logaretm.com/v4/ |
| **GitHub** | https://github.com/logaretm/vee-validate |
| **npm** | `vee-validate` |

**Why VeeValidate?**
VeeValidate v4 is composition-API-first and integrates cleanly with Zod via
`@vee-validate/zod`. It manages field state (touched, dirty, valid), form-level state,
async validation, and submit handling — without locking into a specific schema library.

**Integration with Zod:**

```ts
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})
```

**npm packages needed:**

```bash
npm install vee-validate @vee-validate/zod zod
```

---

## Internationalisation

### vue-i18n

| Property | Value |
|---|---|
| **Version target** | `^9.x` |
| **Docs** | https://vue-i18n.intlify.dev/guide/ |
| **GitHub** | https://github.com/intlify/vue-i18n |
| **npm** | `vue-i18n` |
| **Nuxt module** | `@nuxtjs/i18n` (optional, for full Nuxt i18n) |

**Why vue-i18n?**
vue-i18n is the de-facto standard for Vue/Nuxt internationalisation. Alien UI integrates
with it by merging its own message namespace (`alien-ui.*`) into the consumer's i18n instance.

**Docs for key features:**
- [Composition API](https://vue-i18n.intlify.dev/guide/advanced/composition.html)
- [Message format](https://vue-i18n.intlify.dev/guide/essentials/syntax.html)
- [Nuxt i18n module](https://i18n.nuxtjs.org/)

---

## Styling utilities

### class-variance-authority (cva)

| Property | Value |
|---|---|
| **Version target** | `^0.7.x` |
| **Docs** | https://cva.style/docs |
| **GitHub** | https://github.com/joe-bell/cva |
| **npm** | `class-variance-authority` |

**Why cva?**
`cva` provides a type-safe API for defining component variants declaratively.
It replaces conditional class logic with a structured, composable variant system —
the same pattern used by shadcn/ui and Radix themes.

---

### clsx + tailwind-merge → `cn()`

| Package | Version | npm |
|---|---|---|
| `clsx` | `^2.x` | `clsx` |
| `tailwind-merge` | `^2.x` | `tailwind-merge` |

```ts
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes safely.
 * clsx handles conditionals; twMerge resolves Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

---

## Build toolchain

### Vite

| Property | Value |
|---|---|
| **Version target** | `^5.x` |
| **Docs** | https://vitejs.dev/guide/ |
| **Library mode** | https://vitejs.dev/guide/build.html#library-mode |
| **npm** | `vite` |

**Vite plugins needed:**

| Plugin | Purpose | npm |
|---|---|---|
| `@vitejs/plugin-vue` | SFC compilation | `@vitejs/plugin-vue` |
| `vite-plugin-dts` | TypeScript declaration generation | `vite-plugin-dts` |

---

## Development tooling

| Tool | Version | Purpose | Docs |
|---|---|---|---|
| ESLint | `^9.x` | Linting | https://eslint.org |
| `@antfu/eslint-config` | latest | Vue + TS opinionated rules | https://github.com/antfu/eslint-config |
| Vitest | `^1.x` | Unit testing | https://vitest.dev |
| `@vue/test-utils` | `^2.x` | Vue component testing | https://test-utils.vuejs.org |
| `@testing-library/vue` | `^8.x` | Accessible component tests | https://testing-library.com/docs/vue-testing-library/intro |
| `happy-dom` | `^14.x` | Lightweight DOM for Vitest | https://github.com/capricorn86/happy-dom |

---

## Browser compatibility targets

Alien UI targets the following browsers (matching Tailwind v4's default target):

| Browser | Minimum version |
|---|---|
| Chrome / Edge | 111+ |
| Firefox | 128+ |
| Safari | 16.4+ |
| iOS Safari | 16.4+ |
| Samsung Internet | 21+ |

This aligns with the `baseline` widely-available feature set as of 2024.

**Browserslist config:**

```
> 0.5%
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
not dead
```
