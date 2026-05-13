# Alien UI — Technology References

Every dependency used in this project, with rationale, **verified latest version as of 13 May 2026**,
and official docs.

> Versions are pinned to exact latest at time of writing.
> Run `npm outdated` regularly and update this file whenever `package.json` changes.

---

## Core dependencies

### Reka UI — Component primitives

| Property | Value |
|---|---|
| **Version** | `^2.9.7` |
| **Docs** | https://reka-ui.com/docs/overview/getting-started |
| **GitHub** | https://github.com/unovue/reka-ui |
| **npm** | `reka-ui` |

**Why Reka UI?**
Reka UI (formerly Radix Vue) is a headless, unstyled component primitive library for Vue 3.
It provides battle-tested ARIA compliance, keyboard navigation, focus management, and portal
handling — without imposing any visual opinion. Building on Reka UI means we never maintain
accessibility logic ourselves.

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

---

### Tailwind CSS — Utility-first styling

| Property | Value |
|---|---|
| **Version** | `tailwindcss ^4.3.0` + `@tailwindcss/vite ^4.3.0` |
| **Docs** | https://tailwindcss.com/docs/installation/using-vite |
| **GitHub** | https://github.com/tailwindlabs/tailwindcss |
| **npm** | `tailwindcss` + `@tailwindcss/vite` |

**Why Tailwind CSS v4?**
Tailwind v4 is a complete rewrite with a **CSS-first configuration model** — there is
**no `tailwind.config.ts` or `tailwind.config.js`**. Everything is declared in CSS using
`@import`, `@theme`, and `@layer`. The new Oxide engine makes builds significantly faster.

**Vite integration (required):**

```bash
npm install -D tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [tailwindcss(), vue()] })
```

**Library CSS config (`src/styles/base.css`):**

```css
@import "tailwindcss";

@theme {
  --color-primary:  hsl(var(--alien-primary));
  --color-surface:  hsl(var(--alien-surface));
  --color-border:   hsl(var(--alien-border));
  --radius-DEFAULT: var(--alien-radius);
}
```

**Key Tailwind v4 docs:**
- [Vite installation](https://tailwindcss.com/docs/installation/using-vite)
- [Theme variables with @theme](https://tailwindcss.com/docs/theme)
- [Dark mode](https://tailwindcss.com/docs/dark-mode)
- [CSS variables](https://tailwindcss.com/docs/css-variables)
- [Upgrade guide from v3](https://tailwindcss.com/docs/upgrade-guide)

> **⚠️ No `tailwind.config.ts` — ever.** All Tailwind config lives in `src/styles/base.css`.

---

### TypeScript

| Property | Value |
|---|---|
| **Version** | `^6.0.3` |
| **Docs** | https://www.typescriptlang.org/docs/ |
| **npm** | `typescript` |

> TypeScript 6 was released in 2026 with stricter inference and improved ESM support.
> The library targets `"moduleResolution": "Bundler"` which is the correct setting for Vite + TS6.

**Strict config (enforced):**

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "moduleResolution": "Bundler",
    "target": "ESNext"
  }
}
```

---

## Vue ecosystem

### Vue 3

| Property | Value |
|---|---|
| **Version** | `^3.5.34` |
| **Docs** | https://vuejs.org/guide/introduction |
| **Composition API** | https://vuejs.org/guide/extras/composition-api-faq |

> Vue 3.6 beta is available but the library targets stable `^3.5.x`.

**Key Vue 3.5 features used:**

| Feature | Usage |
|---|---|
| `useId()` | SSR-safe unique IDs for form labels |
| `defineModel()` | Two-way binding in form components |
| `useTemplateRef()` | Typed template refs |
| `<script setup lang="ts">` | All components |

---

### Nuxt

| Property | Value |
|---|---|
| **Version** | `^4.4.5` |
| **Docs** | https://nuxt.com/docs |
| **Modules** | https://nuxt.com/modules |

> **Nuxt 3 reaches EOL on 31 July 2026.** This library targets Nuxt 4.
> Nuxt 4 is fully backwards-compatible with Nuxt 3 module authoring.

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
| **Version** | `^3.23.0` (pinned to v3) |
| **Docs** | https://zod.dev |
| **GitHub** | https://github.com/colinhacks/zod |
| **npm** | `zod` |

> **⚠️ Zod v4 (4.4.3) is now available on npm** but we pin to `^3.x` because
> `@vee-validate/zod@4.15.1` still targets Zod v3.
>
> Upgrade path: when VeeValidate v5 (currently beta) is stable, we can drop
> `@vee-validate/zod` and use Zod v4 natively via Standard Schema support.
> Track: https://github.com/logaretm/vee-validate/releases

**Usage pattern:**

```ts
import { z } from 'zod'
const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})
type LoginData = z.infer<typeof loginSchema>
```

---

### VeeValidate — Form state management

| Property | Value |
|---|---|
| **Version** | `^4.15.1` |
| **Docs** | https://vee-validate.logaretm.com/v4/ |
| **GitHub** | https://github.com/logaretm/vee-validate |
| **npm** | `vee-validate` + `@vee-validate/zod` |

> VeeValidate v5 (beta) will natively support Zod v4, Valibot, and Yup via
> Standard Schema — no companion packages needed. Watch for stable release.

**Integration with Zod v3:**

```ts
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})
```

---

## Internationalisation

### vue-i18n

| Property | Value |
|---|---|
| **Version** | `^11.4.2` |
| **Docs** | https://vue-i18n.intlify.dev/guide/ |
| **GitHub** | https://github.com/intlify/vue-i18n |
| **npm** | `vue-i18n` |

> **vue-i18n v9 is in maintenance mode.** v11 is the current stable release.
> The composition API (`useI18n`) is unchanged between v9 and v11.

---

## Styling utilities

### class-variance-authority (cva)

| Property | Value |
|---|---|
| **Version** | `^0.7.1` |
| **Docs** | https://cva.style/docs |
| **GitHub** | https://github.com/joe-bell/cva |
| **npm** | `class-variance-authority` |

---

### clsx + tailwind-merge → `cn()`

| Package | Version | Note |
|---|---|---|
| `clsx` | `^2.1.1` | Conditional class logic |
| `tailwind-merge` | `^3.6.0` | **v3 required for Tailwind v4 support** |

> `tailwind-merge` v3 added full Tailwind v4 class conflict resolution.
> v2 only supports Tailwind v3. Do not downgrade.

```ts
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

---

## Build toolchain

### Vite

| Property | Value |
|---|---|
| **Version** | `^8.0.12` |
| **Docs** | https://vitejs.dev/guide/ |
| **Library mode** | https://vitejs.dev/guide/build.html#library-mode |
| **npm** | `vite` |

**Vite plugins:**

| Plugin | Version | Purpose |
|---|---|---|
| `@vitejs/plugin-vue` | `^6.0.6` | SFC compilation (aligns with Vite 8) |
| `vite-plugin-dts` | `^5.0.0` | TypeScript declaration generation |

---

## Development tooling

| Tool | Version | Purpose | Docs |
|---|---|---|---|
| `vue-tsc` | `^3.2.8` | Vue-aware TypeScript type checking | https://github.com/vuejs/language-tools |
| `vitest` | `^4.1.6` | Unit testing | https://vitest.dev |
| `@vue/test-utils` | `^2.4.10` | Vue component mounting | https://test-utils.vuejs.org |
| `@testing-library/vue` | `^8.1.0` | Accessible component tests | https://testing-library.com/docs/vue-testing-library/intro |
| `@testing-library/user-event` | `^14.6.1` | Realistic user interactions | https://testing-library.com/docs/user-event/intro |
| `happy-dom` | `^20.9.0` | Lightweight DOM for Vitest | https://github.com/capricorn86/happy-dom |
| `eslint` | `^10.3.0` | Linting | https://eslint.org |
| `@antfu/eslint-config` | `^8.2.0` | Vue + TS opinionated rules | https://github.com/antfu/eslint-config |
| `tsx` | `^4.21.0` | Run TS scripts (CLI tools) | https://github.com/privatenumber/tsx |

---

## Browser compatibility targets

Alien UI targets the following browsers (matching Tailwind v4's baseline):

| Browser | Minimum version |
|---|---|
| Chrome / Edge | 111+ |
| Firefox | 128+ |
| Safari | 16.4+ |
| iOS Safari | 16.4+ |
| Samsung Internet | 21+ |

**Browserslist:**

```
> 0.5%
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
not dead
```

---

## Version history

| Date | Change |
|---|---|
| 2026-05-13 | Initial version audit — updated all packages to latest stable |
| | `tailwind-merge` bumped to v3 (required for Tailwind v4) |
| | `vue-i18n` bumped from v9 → v11 (v9 in maintenance) |
| | `nuxt` / `@nuxt/kit` bumped from v3 → v4 (v3 EOL July 2026) |
| | `typescript` bumped to v6, `vite` to v8, `vitest` to v4 |
| | Zod pinned to `^3.x` pending VeeValidate v5 stable release |
