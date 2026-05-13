# Contributing

This repo is **public**: you may fork it, inspect the library source under `src/`, and participate via [Issues](https://github.com/codaski/alien-ui/issues).

## Maintainer-only docs

Architecture notes, REFERENCES, RULES-style standards, and the long-form contributor playbook live **outside the public clone** — they remain on maintainer disks only (`docs/`, `RULES.md`; see root `.gitignore`). That keeps internal process and narrative off GitHub without hiding the executable source.

Nothing stops you opening an issue asking for onboarding help; substantive PRs benefit from agreeing on scope first.

---

## Smoke-test `@codaski/alien-ui` locally (before npm)

**Prerequisites:** **Node.js 22+** and **npm 10+** (see root `package.json` `engines` and `.nvmrc`).

```bash
npm ci
npm run build
npm pack
```

In a separate Nuxt 4 playground:

```bash
npm install /absolute/path/to/codaski-alien-ui-0.2.2-beta.tgz
```

Or in that app’s `package.json`:

```json
{
  "dependencies": {
    "@codaski/alien-ui": "file:/absolute/path/to/alien-ui/Alien UI"
  }
}
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@codaski/alien-ui/nuxt'],
  vite: { resolve: { dedupe: ['vue'] } },
})
```

Beta notice: APIs may change frequently; pin a version (`@codaski/alien-ui@~0.1.0`) while experimenting.

---

## Release note for maintainers

Switching visibility to **Public** is done on GitHub: **Settings → General → Danger zone → Change visibility**.  
Paths under `.gitignore` never leave your machine unless you `-f` add them — but **anything already pushed remains in Git history** until rewritten (filter-repo/BFG).
