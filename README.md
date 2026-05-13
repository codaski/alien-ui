# `@alien-ui/vue` · Alien UI

[![npm](https://img.shields.io/npm/v/@alien-ui/vue?label=npm&logo=npm&color=CB3837)](https://www.npmjs.com/package/@alien-ui/vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

> A Vue 3 / Nuxt component library — themed, headless-ready, and fully ejectable.  
> Built on [Reka UI](https://reka-ui.com) · [Tailwind CSS v4](https://tailwindcss.com) · [Zod](https://zod.dev) · [vue-i18n](https://vue-i18n.intlify.dev)

**Quick links:** [Package on npm](https://www.npmjs.com/package/@alien-ui/vue) · [Issues](https://github.com/codaski/alien-ui/issues) · [Source](https://github.com/codaski/alien-ui)

---

## Table of contents

- [Status](#status-beta--not-for-production-yet)
- [What is Alien UI?](#what-is-alien-ui)
- [Tech stack](#tech-stack)
- [Developing this library](#developing-this-library)
- [Installation and usage](#installation-and-usage)
- [Component categories](#component-categories-planned-vs-present)
- [i18n](#i18n)
- [Overriding the theme](#overriding-the-theme)
- [Contributor documentation](#contributor-documentation)
- [Changelog](./CHANGELOG.md)
- [Repository](#repository)
- [License](#license)

## Status: beta — not for production yet

**This package is unfinished and under active development.** Treat every release as **experimental**.

| | |
|---|---|
| **Use it for** | Spikes, playgrounds, local testing, early feedback, design experiments. |
| **Do not use it for** | Production applications, customer-facing launches, or long-lived codebases you cannot afford to rewrite. |
| **Expect** | Breaking API changes, renamed exports, changed Nuxt module behaviour, incomplete components, and semver `0.x` instability until a stable **v1** is announced. |
| **Versioning** | Releases follow **SemVer** (`0.y.z` allows breaking changes); still **pin an exact version** (`"0.1.0"`) when experimenting so updates are deliberate. |

Until maintainers publish a clear **“stable”** or **v1** milestone, you assume all risk. There is **no** guarantee of backward compatibility or support SLAs.

---

## What is Alien UI?

Alien UI is an **open-architecture UI kit** aimed at Vue 3 and Nuxt 4.

Only a **small set of components is implemented today** (for example **Input**); others are planned. When more ship, the goals stay the same:

### Design philosophy

| Principle | What it means in practice |
|---|---|
| **Headless-first** | Behaviour leans on Reka UI primitives; styling is a separate layer. |
| **Themed by default** | Defaults use Tailwind CSS variables (`--alien-*`). |
| **Override anything** | Components can be **ejected** into your repo so you own the source. |
| **Type-safe API** | Props, emits, slots, and composables are typed in TypeScript. |
| **i18n-friendly** | vue-i18n integration for library strings. |
| **SSR-minded** | Designed to work with Nuxt (guards on browser-only APIs). |
| **Forms** | Intended direction: Zod + VeeValidate wiring on form controls (VeeValidate v5 is still beta upstream — evaluate before any production use). |

---

## Tech stack

| Layer | Technology | Version target |
|---|---|---|
| Component primitives | [Reka UI](https://reka-ui.com) | `^2.x` |
| Styling | [Tailwind CSS](https://tailwindcss.com) | `^4.x` |
| Language | TypeScript | `^6.0` |
| Runtime | Node.js | `>=22` (`engines` / `.nvmrc`; ESLint 10 toolchain needs modern `Object.groupBy`) |
| Framework | Vue 3 + Nuxt 4 | Vue `^3.5` / Nuxt `^4.x` |
| Validation schema | [Zod](https://zod.dev) | `^4.x` |
| Form state | [VeeValidate](https://vee-validate.logaretm.com/v5/) | `^5.x` beta |
| Internationalisation | [vue-i18n](https://vue-i18n.intlify.dev) | `^11.x` |
| Bundler | [Vite](https://vitejs.dev) + `@tailwindcss/vite` | `^8.x` |
| Package manager | npm | `^11.x` |

---

## Developing this library

Same pipeline as **[CI](https://github.com/codaski/alien-ui/actions)** (`lint` → `typecheck` → `test` → `build` → `npm pack --dry-run`):

```bash
npm ci
npm run ci
```

Use **Node 22** ([`.nvmrc`](./.nvmrc), [`package.json`](./package.json) `engines`).

---

## Installation and usage

### Prerequisites

- **Node.js `>=22`** (see [`package.json`](./package.json) `engines` and repo **`.nvmrc`**). Needed for development **and** this repo’s ESLint toolchain.
- **Vue** `>= 3.5` as a peer (`vue` in your app).
- **Tailwind CSS v4** with **`@tailwindcss/vite`** in your app if you use **`@alien-ui/vue/styles`** (recommended), so tokens and utilities compile correctly.

### Install

```bash
npm install @alien-ui/vue

# Recommended during beta: pin an explicit version SemVer range or exact version
npm install '@alien-ui/vue@~0.1.0'
```

Pre-release publishes may use npm’s **`beta`** [dist-tag](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag): then install with `npm install @alien-ui/vue@beta` (maintainers can run `npm run publish:beta` from this repo).

---

### Option A — Vue 3 + Vite (manual imports)

Register the plugin once, import styles once, then **import each component** you need (there is no built-in auto-import unless you add something like `unplugin-vue-components` yourself).

```ts
// main.ts
import { createApp } from 'vue'
import { createAlienUI } from '@alien-ui/vue'
import '@alien-ui/vue/styles'
import App from './App.vue'

const app = createApp(App)
app.use(createAlienUI(/* optional: { locale, messages, … } */))
app.mount('#app')
```

```vue
<!-- Any .vue file -->
<script setup lang="ts">
import { AlienInput } from '@alien-ui/vue'

const value = ref('')
</script>

<template>
  <AlienInput v-model="value" label="Email" placeholder="you@example.com" />
</template>
```

**Deep imports** (subject to the package `exports` map), for example:

```ts
import { AlienInput } from '@alien-ui/vue/components/forms'
```

Use these only if your bundler resolves them; prefer the main entry during beta while APIs settle.

---

### Option B — Nuxt 4 (module: styles + plugin + selective auto-import)

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@alien-ui/vue/nuxt'],
  alienUI: {
    // locale: 'en',
    // colorMode: 'system' | 'light' | 'dark',
    // prefix: 'Alien',           // default → <AlienInput />
    // ejectDir: '~/components/alien', // optional: local components override package
  },
  vite: {
    resolve: {
      dedupe: ['vue'], // helpful when npm-linking or monorepo duplicates
    },
  },
})
```

What the **Nuxt module** currently does in broad strokes:

- Injects **`@alien-ui/vue/styles`** into Nuxt’s CSS pipeline (no manual `@import` needed for the default path).
- Registers a **Nuxt plugin** that calls **`createAlienUI()`** using **`runtimeConfig.public.alienUI`** for options.
- **Auto-imports composables** from the published package (for example `useLocale`, `useTheme`, `useVariants`) when resolution finds them in the built output.
- **Registers implemented components** by name (today includes **`AlienInput`** with default prefix **`Alien`**).
- If **`ejectDir`** is set, that directory is scanned **first** so **ejected** `.vue` files override the package.

You can still **import manually** in Nuxt if you prefer:

```vue
<script setup lang="ts">
import { AlienInput } from '@alien-ui/vue'
</script>
```

---

### Option C — Try locally before npm (file / tarball)

See **[`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md)** for `npm pack`, `file:` dependencies, Nuxt playground setup, and `dedupe`. Same beta warnings apply.

---

### CLI — eject a component (experimental)

After installing the package:

```bash
npx alien-ui eject Input
```

Copies source from the package into your project (exact target path is printed by the CLI). In Nuxt, align **`alienUI.ejectDir`** with where you place overrides.

---

## Component categories (planned vs present)

Only **forms / Input** is realistically usable today; others are **roadmap**.

```
alien-ui/
├── forms/          # Input … (more planned)
├── blocks/         # Card, Modal, … (planned)
├── layout/         # … (planned)
└── feedback/       # … (planned)
```

---

## i18n

English messages ship by default. Example override:

```ts
import { createAlienUI } from '@alien-ui/vue'
import myMessages from './locales/ar.json'

app.use(createAlienUI({
  locale: 'ar',
  messages: { ar: myMessages },
}))
```

---

## Overriding the theme

Tokens are **`--alien-*`** CSS variables after you import the library styles:

```css
/* assets/main.css (Vue) — Nuxt loads @alien-ui/vue/styles via the module */
@import "@alien-ui/vue/styles";

:root {
  --alien-primary:  265 90% 60%;
  --alien-radius:   1rem;
}
```

Vite apps need the Tailwind v4 plugin:

```ts
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
})
```

---

## Contributor documentation

**Public repo reality:** Anything **committed** to GitHub can be cloned in full — there are no permissioned folders inside one public repo.

This project keeps detailed internal material **off Git** by ignoring it (see `.gitignore`):

| Path | Stays |
|---|---|
| **`docs/`** | On maintainer disks only (architecture, REFERENCES, full contributing playbook). |
| **`RULES.md`** | On maintainer disks only (coding norms & release notes). |

**Public surface for contributors:**

- **[`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md)** — how to engage, fork, smoke-test locally, and visibility notes.

**Consumers** — use **`README.md`**, **`CHANGELOG.md`**, and the **[npm readme](https://www.npmjs.com/package/@alien-ui/vue)**; the tarball is mostly `dist/` + `src/` per `package.json` `files`.

> **Historical commits:** Paths removed from Git still exist in older commits unless you rewrite history (`git filter-repo` / [BFG](https://rtyley.github.io/bfg-repo-cleaner/) before going public).

---

## Repository

[**github.com/codaski/alien-ui**](https://github.com/codaski/alien-ui) — forks and issues welcome.

**Switching visibility to Public (GitHub):** *Settings → General → Danger zone → Change visibility → Public.*

---

## License

MIT © Alien UI Contributors — see [`LICENSE`](./LICENSE).
