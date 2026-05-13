# Alien UI

> A Vue 3 / Nuxt component library — themed, headless-ready, and fully ejectable.
> Built on [Reka UI](https://reka-ui.com) primitives · [Tailwind CSS v4](https://tailwindcss.com) · [Zod](https://zod.dev) · [vue-i18n](https://vue-i18n.intlify.dev)

---

## What is Alien UI?

Alien UI is a **production-ready, open-architecture UI kit** for Vue 3 and Nuxt 3 applications.
It ships beautiful, accessible components out of the box while remaining **fully overridable** —
you can eject any component directly into your project and own it completely, just like shadcn/ui.

### Design philosophy

| Principle | What it means in practice |
|---|---|
| **Headless-first** | All behaviour lives in Reka UI primitives. Styling is a separate, swappable layer. |
| **Themed by default** | A polished default theme via Tailwind CSS variables. No unstyled soup on first install. |
| **Override anything** | Every component is exportable into your project for full customisation. |
| **Type-safe API** | Strict TypeScript throughout — props, emits, slots, and composables are all typed. |
| **i18n-native** | Built-in vue-i18n integration. Add your own locale files or override existing ones. |
| **SSR/CSR safe** | No `window`/`document` access at the module level. Every component is Nuxt-compatible. |
| **Validation baked in** | Form components wire up Zod schemas + VeeValidate with zero extra config. |

---

## Tech stack

| Layer | Technology | Version target |
|---|---|---|
| Component primitives | [Reka UI](https://reka-ui.com) | `^2.x` |
| Styling | [Tailwind CSS](https://tailwindcss.com) | `^4.x` |
| Language | TypeScript | `^5.4` |
| Framework | Vue 3 + Nuxt 3 | Vue `^3.5` / Nuxt `^3.13` |
| Validation schema | [Zod](https://zod.dev) | `^3.x` |
| Form state | [VeeValidate](https://vee-validate.logaretm.com/v4/) | `^4.x` |
| Internationalisation | [vue-i18n](https://vue-i18n.intlify.dev) | `^9.x` |
| Bundler | [Vite](https://vitejs.dev) + `vite-plugin-vue` | `^5.x` |
| Package manager | npm | `^10.x` |

---

## Quick install

```bash
npm install alien-ui
```

### Vite / Vue 3 project

```ts
// main.ts
import { createApp } from 'vue'
import { createAlienUI } from 'alien-ui'
import 'alien-ui/styles'
import App from './App.vue'

const app = createApp(App)
app.use(createAlienUI())
app.mount('#app')
```

### Nuxt 3 project

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['alien-ui/nuxt'],
})
```

---

## Component categories

```
alien-ui/
├── forms/          # Input, Textarea, Select, Checkbox, Radio, Switch, DatePicker …
├── blocks/         # Card, Modal, Drawer, Tabs, Accordion, Alert, Toast …
├── layout/         # Container, Grid, Stack, Divider …
└── feedback/       # Spinner, Skeleton, Progress, Badge …
```

---

## Ejecting a component (full override)

When you need to customise a component beyond what props/slots allow, eject it directly:

```bash
npx alien-ui eject Button
# → copies src/components/forms/Button/ into your project
```

The ejected component is a plain `.vue` file — no magic, no hidden dependencies.
Update it freely; Alien UI will prefer your local version over the package version.

---

## i18n

Alien UI ships English messages by default. To add or override:

```ts
import { createAlienUI } from 'alien-ui'
import myMessages from './locales/ar.json'

app.use(createAlienUI({
  locale: 'ar',
  messages: { ar: myMessages },
}))
```

---

## Overriding the theme

Alien UI uses **Tailwind CSS v4's CSS-first config** — all tokens are `--alien-*` CSS variables.
Override them after importing the styles:

```css
/* assets/main.css */
@import "alien-ui/styles";   /* imports Tailwind + @theme + default tokens */

/* Override only what you need — no config file required */
:root {
  --alien-primary:  265 90% 60%;   /* violet instead of blue */
  --alien-radius:   1rem;          /* rounder corners */
}
```

Your Vite config only needs the `@tailwindcss/vite` plugin — no `tailwind.config.ts`:

```ts
// vite.config.ts (your app)
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [tailwindcss(), vue()] })
```

---

## Documentation

| File | Purpose |
|---|---|
| [`RULES.md`](./RULES.md) | Coding standards every contributor must follow |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Folder structure, layer model, SSR/theming strategy |
| [`docs/REFERENCES.md`](./docs/REFERENCES.md) | All technology references with version rationale |
| [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) | How to add components, variants, and override the library |

---

## License

MIT © Alien UI Contributors
