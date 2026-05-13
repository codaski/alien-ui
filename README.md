# 👋 `@codaski/alien-ui` · Alien UI

[![npm](https://img.shields.io/npm/v/@codaski/alien-ui?label=npm&logo=npm&color=CB3837)](https://www.npmjs.com/package/@codaski/alien-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/typings-ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Hello!** Thanks for stopping by **Alien UI** — a Vue-friendly kit built on **[Reka UI](https://reka-ui.com)** primitives, **[Tailwind CSS v4](https://tailwindcss.com)** (**`--alien-*`** tokens), **[vue-i18n](https://vue-i18n.intlify.dev)**, and **[Zod](https://zod.dev)** / **[VeeValidate](https://vee-validate.logaretm.com/v5/)** for the direction we’re taking forms. We’re intentionally shipping **early and in the open** so you can try things, give feedback, and grow with the project.

**Scoped public package:** published under npm user **`codaski`** as **`@codaski/alien-ui`** (`publishConfig.access: public`). **Quick links:** [npm](https://www.npmjs.com/package/@codaski/alien-ui) · [Issues](https://github.com/codaski/alien-ui/issues) · [Source](https://github.com/codaski/alien-ui) · [Changelog](./CHANGELOG.md)

---

## A warm note on beta — you’re early, and that’s awesome

We’re **polishing in public**: the API is still finding its final shape, bundled components will grow, and **`0.x`** means we may ship **breaking tweaks** as we learn. That’s not a glitch in our plan — it’s part of baking a library that feels great to use long-term.

**What we’d love you to use this for**

- Sandbox apps · internal demos · spikes · learning beside us · sharing ideas in issues

**Where we politely ask you to wait**

- Customer-facing launches that can’t handle breaking changes · hardened long-term SLAs unless you consciously own the fork

Think of today’s releases as **“solid codepaths for exploratory timelines.”** Alien UI installs and runs, but **`0.*`** isn’t the moment to hinge a multinational release on undocumented behaviour. Pin versions, read **[CHANGELOG.md](./CHANGELOG.md)** on bumps, and when we trumpet **v1 / stable**, you’ll hear us.

Until then — **thanks for being early.** 👋✨

---

## What your app needs

| Requirement | Details |
|---|---|
| **Vue** | **`>= 3.5`** — **`peerDependency`**. Install **`vue`** in your app. |
| **Bundler** | **Vite** or **Nuxt 4** (examples below align with typical setups). |
| **Styles** | When you **`import '@codaski/alien-ui/styles'`**, add **Tailwind CSS v4** and **`@tailwindcss/vite`** in **your** app so utilities and theme layers compile. |
| **TypeScript** | **Optional** — typings ship with the tarball. |
| **Exact semver** | **`package.json`** on npm is the authoritative list (`dependencies`, `peerDependencies`). |

**What’s in the box today:** **`AlienInput`** leads the parade; more pieces follow on the roadmap below.

**Heads-up:** **VeeValidate v5** is still **beta upstream** · evaluate if you rely on it for risky flows.

---

## Install

**npm `latest` vs `beta`:** Bare **`npm install @codaski/alien-ui`** follows the **`latest`** [dist-tag](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag). Prerelease builds (`0.x.x-beta`) are published on **`beta`**; CI also moves **`latest`** to that same version so the default on [npmjs.com](https://www.npmjs.com/package/@codaski/alien-ui) tracks the newest tag from [GitHub releases](https://github.com/codaski/alien-ui/releases). Prefer **`@beta`** if you want to pin the channel explicitly:

```bash
npm install @codaski/alien-ui@beta
```

Standard:

```bash
npm install @codaski/alien-ui
```

Comfortable pinning while **`0.*`** evolves (stable **`latest`** channel):

```bash
npm install '@codaski/alien-ui@~0.1.0'
```

**Prereleases** (semver prerelease id, e.g. **`0.2.2-beta`**): use the **`beta`** tag or an exact version:

```bash
npm install @codaski/alien-ui@beta
npm install '@codaski/alien-ui@0.2.2-beta'
```

From **`npm pack` tarball**:

```bash
npm install /absolute/path/to/codaski-alien-ui-0.2.2-beta.tgz
```

Local **`file:`** path (monorepos / workspaces):

```json
{
  "dependencies": {
    "@codaski/alien-ui": "file:../path/to/package-root"
  }
}
```

See above for **`npm install @codaski/alien-ui@beta`** · exact **`0.2.2-beta`**, and tarball names.

---

## Vue 3 + Vite

1. Add **Vue** `>= 3.5`, **tailwindcss**, **`@tailwindcss/vite`**.  
2. Configure **`vite.config.ts`** (below).  
3. **`createAlienUI()` + styles** once before mount (below).  
4. **`import`** components where you want them *(or plug in **`unplugin-vue-components`** for auto-discovery — your choice).*

### `vite.config.ts`

```ts
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
})
```

### `main.ts`

```ts
import { createApp } from 'vue'
import { createAlienUI } from '@codaski/alien-ui'
import '@codaski/alien-ui/styles'
import App from './App.vue'

const app = createApp(App)
app.use(createAlienUI(/* optional: { locale, messages } */))
app.mount('#app')
```

### `.vue`

```vue
<script setup lang="ts">
import { AlienInput } from '@codaski/alien-ui'

const value = ref('')
</script>

<template>
  <AlienInput v-model="value" label="Email" placeholder="you@example.com" />
</template>
```

**Optional exports-respecting import:**

```ts
import { AlienInput } from '@codaski/alien-ui/components/forms'
```

---

## Nuxt 4

Nuxt **never auto-discovers** third-party modules: you install the package and add **`@codaski/alien-ui/nuxt`** to **`modules`** yourself (no extra Nuxt “enable module” wizard).

### Setup (install + config)

1. Install Alien UI **and** Tailwind in the **same app** (styles depend on them):

   ```bash
   npm install @codaski/alien-ui tailwindcss @tailwindcss/vite
   ```

2. Register the module in **`nuxt.config.ts`** (and add the Vite plugin Tailwind expects — Nuxt 4 typically uses `defineNuxtConfig` + `vite.plugins`):

   ```ts
   import tailwindcss from '@tailwindcss/vite'

   export default defineNuxtConfig({
     modules: ['@codaski/alien-ui/nuxt'],
     vite: {
       plugins: [tailwindcss()],
       resolve: { dedupe: ['vue'] },
     },
     alienUI: {
       // locale: 'en',
       // colorMode: 'system' | 'light' | 'dark',
       // prefix: 'Alien',
       // ejectDir: '~/components/alien',
     },
   })
   ```

3. Start dev or build — the module injects styles using a **file path** inside the package so Vite can resolve CSS correctly.

The module wires **CSS**, **`createAlienUI()`**, **composables auto-import**, and registered components (**`AlienInput` → `<AlienInput />`**).

### `nuxt.config.ts` (minimal)

If you already have Tailwind configured elsewhere, you only need the module line + options:

```ts
export default defineNuxtConfig({
  modules: ['@codaski/alien-ui/nuxt'],
  alienUI: {
    // locale: 'en',
    // colorMode: 'system' | 'light' | 'dark',
    // prefix: 'Alien',
    // ejectDir: '~/components/alien',
  },
  vite: {
    resolve: { dedupe: ['vue'] },
  },
})
```

**`dedupe: ['vue']`** helps cure duplicate-Vue quirks when **`file:`** linking or similar.

### Templates

```vue
<script setup lang="ts">
const email = ref('')
</script>

<template>
  <AlienInput v-model="email" label="Email" />
</template>
```

Explicit imports still welcomed:

```vue
<script setup lang="ts">
import { AlienInput } from '@codaski/alien-ui'
</script>
```

---

## Locale / i18n (English by default)

```ts
import { createAlienUI } from '@codaski/alien-ui'
import myMessages from './locales/ar.json'

app.use(createAlienUI({
  locale: 'ar',
  messages: { ar: myMessages },
}))
```

Nested keys commonly use the **`alien-ui.*`** prefix — merge your own catalogs as needed.

---

## Theming (`--alien-*`)

```css
@import "@codaski/alien-ui/styles";

:root {
  --alien-primary:  265 90% 60%;
  --alien-radius:   1rem;
}
```

*(Nuxt: module usually injects the stylesheet — you mainly override `:root` in your CSS.)*

---

## CLI · `npx alien-ui eject`

```bash
npx alien-ui eject Input
```

Point **`alienUI.ejectDir`** at wherever you parked the copy so Nuxt prioritises yours.

---

## Roadmap teaser

✅ **`AlienInput`** now · 🛠️ more primitives on deck — milestones land with **[CHANGELOG](./CHANGELOG.md)** entries, not stealth breaks.

Peek **`exports`** in **`package.json`** for subpath curiosity.

---

## Stack snapshot

**Reka UI 2 · Tailwind 4 · Vue 3.5+ · vue-i18n 11 · Zod 4 · VeeValidate 5 (beta lineage)** · copy-paste semver from **`package.json`**.

---

## Contributing · thanks 🙏

Hack, star, complain constructively — **[codaski/alien-ui](https://github.com/codaski/alien-ui)** · maintainers skim **[`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md)** · **`npm run dev:test-app`** = watch **`dist/`** + Nuxt dev from one terminal (see Contributing).

---

## License

MIT © Alien UI Contributors — see [LICENSE](./LICENSE).
