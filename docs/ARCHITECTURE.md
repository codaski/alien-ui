# Alien UI — Architecture

This document describes the folder structure, layer model, theming strategy,
SSR/CSR approach, and the override/eject mechanism.

---

## Folder structure

```
alien-ui/
│
├── src/
│   ├── index.ts                    # Main package entry — re-exports everything public
│   ├── nuxt.ts                     # Nuxt module entry
│   │
│   ├── components/
│   │   ├── forms/                  # Form input components
│   │   │   ├── Input/               ✅ implemented
│   │   │   │   ├── Input.vue
│   │   │   │   ├── Input.types.ts
│   │   │   │   ├── Input.variants.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── __tests__/
│   │   │   │       └── Input.spec.ts
│   │   │   ├── Textarea/            (planned)
│   │   │   ├── Select/              (planned)
│   │   │   ├── Checkbox/            (planned)
│   │   │   ├── Radio/               (planned)
│   │   │   ├── Switch/              (planned)
│   │   │   ├── DatePicker/          (planned)
│   │   │   ├── FileUpload/          (planned)
│   │   │   └── index.ts            # Re-exports all form components
│   │   │
│   │   ├── blocks/                 # Layout-level / composite components
│   │   │   ├── Card/                (planned)
│   │   │   ├── Modal/               (planned)
│   │   │   ├── Drawer/              (planned)
│   │   │   ├── Tabs/                (planned)
│   │   │   ├── Accordion/           (planned)
│   │   │   ├── Alert/               (planned)
│   │   │   ├── Toast/               (planned)
│   │   │   ├── Tooltip/             (planned)
│   │   │   ├── Popover/             (planned)
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── Container/           (planned)
│   │   │   ├── Stack/               (planned)
│   │   │   ├── Divider/             (planned)
│   │   │   └── index.ts
│   │   │
│   │   ├── feedback/
│   │   │   ├── Spinner/             (planned)
│   │   │   ├── Skeleton/            (planned)
│   │   │   ├── Progress/            (planned)
│   │   │   ├── Badge/               (planned)
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                # Re-exports all categories
│   │
│   ├── composables/
│   │   ├── useTheme.ts             # CSS var context + colour mode helpers
│   │   ├── useLocale.ts            # i18n accessor composable
│   │   ├── useVariants.ts          # Resolve cva variants from props
│   │   └── index.ts                # Planned: useField, useFormGroup
│   │
│   ├── utils/
│   │   ├── cn.ts                   # clsx + tailwind-merge helper
│   │   ├── id.ts                   # Unique ID generator (SSR-safe)
│   │   ├── validation.ts           # Zod → VeeValidate adapter helpers
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── global.ts               # Library-wide shared interfaces
│   │   ├── theme.ts                # Theme token types
│   │   ├── i18n.ts                 # Locale message schema type
│   │   └── index.ts
│   │
│   ├── locales/
│   │   └── en.json                 # Default locale (planned: ar/fr/es)
│   │
│   ├── styles/
│   │   ├── base.css                # @import "tailwindcss" + CSS var definitions
│   │   ├── tokens.css              # All --alien-* design tokens
│   │   └── index.css               # Barrel: imports base + tokens
│   │
│   └── plugin/
│       ├── index.ts                # Vue plugin factory (createAlienUI)
│       └── nuxt-runtime.ts         # Nuxt plugin (calls createAlienUI)
│
├── cli/
│   ├── cli.ts                      # `npx alien-ui` dispatcher (→ dist/cli.mjs)
│   ├── new-component.ts            # Scaffold a new component (maintainers)
│   └── eject.ts                    # Copy a component folder into an app
│
├── docs/
│   ├── ARCHITECTURE.md             # ← this file
│   ├── REFERENCES.md
│   └── CONTRIBUTING.md
│
├── RULES.md
├── README.md
├── package.json
├── vite.config.ts
├── eslint.config.js
├── tsconfig.json
├── LICENSE
```

> **No `tailwind.config.ts`.** Tailwind CSS v4 is configured entirely via CSS —
> see `src/styles/base.css` which uses `@theme` to map design tokens to Tailwind utilities.

---

## Layer model

Alien UI has three clearly separated layers. Keeping them separate ensures that consumers
can replace any layer without touching the others.

```
┌─────────────────────────────────────────────┐
│  3. STYLE LAYER                             │
│  Tailwind CSS + cva variants + CSS tokens   │
│  → Fully replaceable per-component          │
├─────────────────────────────────────────────┤
│  2. COMPOSITION LAYER                       │
│  Vue SFCs + composables + slots             │
│  → Override via eject or slot injection     │
├─────────────────────────────────────────────┤
│  1. BEHAVIOUR LAYER                         │
│  Reka UI primitives (focus, ARIA, portal)   │
│  → Inherited for free, versioned separately │
└─────────────────────────────────────────────┘
```

### Layer 1 — Behaviour (Reka UI)

Reka UI provides:
- Focus trap and focus restoration (Modal, Drawer, Popover)
- Keyboard navigation (Select, Combobox, Tabs, Accordion)
- ARIA attribute management
- Portal / teleport management
- Dismissible / escape-key handling

**Rule:** Never reimplement anything Reka UI already provides.

### Layer 2 — Composition (Vue SFCs)

This layer:
- Wraps Reka UI primitives with opinionated slot structure
- Wires validation state (VeeValidate + Zod) into form fields
- Injects i18n translations
- Manages theme token access via `useTheme()`
- Exposes a clean, typed component API

### Layer 3 — Style (Tailwind + cva)

This layer:
- Defines all visual variants in `*.variants.ts` using `cva`
- References only `--alien-*` CSS variables for colour and spacing
- Applies `cn()` (clsx + tailwind-merge) for dynamic class merging
- Is 100% replaceable — a consumer can pass `class` or override the variant file

---

## Theming model

### CSS variables

All design tokens are defined as CSS custom properties under `:root`
(and overridden under `.dark` for dark mode):

```css
/* src/styles/tokens.css */
:root {
  /* Colour channels (hsl — no unit suffix) */
  --alien-primary:              210 100% 56%;
  --alien-primary-foreground:   0 0% 100%;
  --alien-secondary:            220 14% 96%;
  --alien-secondary-foreground: 220 9% 46%;
  --alien-surface:              0 0% 100%;
  --alien-surface-elevated:     0 0% 98%;
  --alien-border:               220 13% 91%;
  --alien-destructive:          0 72% 51%;
  --alien-success:              142 71% 45%;
  --alien-muted:                220 9% 46%;

  /* Shape */
  --alien-radius:               0.5rem;
  --alien-radius-sm:            0.25rem;
  --alien-radius-lg:            0.75rem;

  /* Shadow */
  --alien-shadow-sm:            0 1px 2px rgb(0 0 0 / 0.05);
  --alien-shadow:               0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06);
}

.dark {
  --alien-primary:              217 91% 60%;
  --alien-surface:              224 71% 4%;
  --alien-border:               215 28% 17%;
  /* … */
}
```

### Tailwind v4 integration — `@theme` directive

Tailwind CSS v4 uses a **CSS-first config** — no `tailwind.config.ts` exists in this project.
Tokens are mapped to Tailwind utility classes directly in `src/styles/base.css` via `@theme`:

```css
/* src/styles/base.css */
@import "tailwindcss";

@theme {
  /* Maps --alien-* vars → Tailwind colour utilities */
  --color-primary:   hsl(var(--alien-primary));
  --color-surface:   hsl(var(--alien-surface));
  --color-border:    hsl(var(--alien-border));
  --color-destructive: hsl(var(--alien-destructive));

  /* Maps --alien-radius-* → Tailwind rounded-* utilities */
  --radius-sm:      var(--alien-radius-sm);
  --radius-DEFAULT: var(--alien-radius);
  --radius-lg:      var(--alien-radius-lg);
}
```

This makes `bg-primary`, `text-destructive`, `border-border`, `rounded`, `rounded-lg` etc.
available as first-class Tailwind utilities — all backed by CSS variables that consumers
can override without touching any build config.

**Consumer project setup (Vite):**

```ts
// vite.config.ts (consumer)
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [tailwindcss()] })
```

```css
/* consumer/assets/main.css */
@import "@alien-ui/vue/styles";   /* ← imports Alien UI's @theme + tokens */

/* Override tokens here — no config file needed */
:root {
  --alien-primary: 265 90% 60%;
  --alien-radius:  1rem;
}
```

---

## SSR / CSR strategy

### Rules

1. **No browser globals at module scope.** Any access to `window`, `document`, `navigator`,
   `localStorage`, or `matchMedia` must be inside `onMounted` or guarded.

2. **IDs are generated server-safe.** Use `useId()` from Vue 3.5+ or the library's own
   `src/utils/id.ts` which falls back to a counter during SSR.

3. **Teleports work with Nuxt.** Reka UI's portal/teleport targets must be conditional:
   ```vue
   <Teleport to="body" :disabled="!isMounted">
   ```
   where `isMounted` is set in `onMounted`.

4. **CSS is hydration-safe.** No JavaScript-driven style injection on mount — all styles
   are static CSS (Tailwind + CSS vars). This prevents hydration mismatches.

5. **Nuxt auto-import.** The Nuxt module registers components under the `Alien` prefix
   so they are tree-shaken correctly by Nuxt's auto-import mechanism.

---

## Override and eject mechanism

### Slot-based override (light customisation)

Every component exposes named slots for its major regions:

```vue
<AlienInput>
  <template #prefix>
    <MyIcon />
  </template>
</AlienInput>
```

### Class / variant override (style customisation)

Pass `class` directly — it merges via `cn()` (tailwind-merge respects specificity):

```vue
<AlienInput class="rounded-full border-2 border-violet-500" />
```

Or override the entire variant set by passing `variants`:

```ts
// consumer project: my-variants.ts
import { inputVariants } from '@alien-ui/vue/variants'
export const myInputVariants = inputVariants.extend({ … })
```

### Eject (full ownership)

```bash
npx alien-ui eject Input
```

This copies `src/components/forms/Input/` into `<project>/components/alien/Input/`.
The package's auto-resolver checks for a local copy first before using the package version.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@alien-ui/vue/nuxt'],
  alienUI: {
    ejectDir: '~/components/alien', // local overrides directory
  },
})
```

---

## Package exports map

```json
{
  "exports": {
    ".":              { "import": "./dist/index.mjs",    "types": "./dist/index.d.ts" },
    "./nuxt":         { "import": "./dist/nuxt.mjs",     "types": "./dist/nuxt.d.ts" },
    "./styles":       "./dist/styles/index.css",
    "./variants":     { "import": "./dist/variants.mjs", "types": "./dist/variants.d.ts" },
    "./components/*": { "import": "./dist/components/*.mjs", "types": "./dist/components/*.d.ts" }
  }
}
```

This allows consumers to import only what they need:

```ts
import { AlienInput } from '@alien-ui/vue'                      // full lib
import { AlienInput } from '@alien-ui/vue/components/forms'     // category
import { inputVariants } from '@alien-ui/vue/variants'          // variants only
import '@alien-ui/vue/styles'                                   // CSS only
```
