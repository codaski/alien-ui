# Contributing

This repo is **public**: you may fork it, inspect the library source under `src/`, and participate via [Issues](https://github.com/codaski/alien-ui/issues).

## Maintainer-only docs

Architecture notes, REFERENCES, RULES-style standards, and the long-form contributor playbook live **outside the public clone** — they remain on maintainer disks only (`docs/`, `RULES.md`; see root `.gitignore`). That keeps internal process and narrative off GitHub without hiding the executable source.

Nothing stops you opening an issue asking for onboarding help; substantive PRs benefit from agreeing on scope first.

---

## Smoke-test `@codaski/alien-ui` locally (before npm)

**Prerequisites:** **Node.js 22+** and **npm 10+** (see root `package.json` `engines` and `.nvmrc`).

### Fast loop: same machine as a Nuxt playground

From this repo, after you have a consumer app on disk (your paths may differ):

1. Point the app at the library once, e.g. in the app’s `package.json`:

   ```json
   {
     "dependencies": {
       "@codaski/alien-ui": "file:C:/Projects/alien-ui/Alien UI"
     }
   }
   ```

2. Each time you change the library and want the app to pick it up:

   ```bash
   npm run link:test-app
   ```

   Do **not** run this in the same terminal while **`npm login` / `npm dist-tag` / anything waiting for Enter** is active — mixed input produces broken output and failed commands. Use a **second terminal** for `link:test-app`.

   That runs **`npm run build`** here, then **`npm install <this-repo>`** in the consumer so `node_modules/@codaski/alien-ui` tracks **`dist/`** (and runs the consumer’s install lifecycle). Override the consumer directory with the first CLI argument or **`ALIEN_UI_TEST_APP`**. If the default layout matches yours (`../../local-testing/alien-ui-nuxt` relative to this repo), you can omit both.

3. **`npm run link:test-app:quick`** skips the library build (use when you already ran `build` and only need to refresh the link).

### One terminal: watch the library + run the Nuxt app

If the consumer app already has **`@codaski/alien-ui`** as a **`file:`** dependency (see above), from **this repo** run:

```bash
npm run dev:test-app
```

This will:

1. Run **`npm run build`** once and **`npm install file:…`** into the consumer (refreshes the link).
2. Start **`vite build --watch`** (rebuilds **`dist/`** whenever you save library sources).
3. Start **`npm run dev`** in the Nuxt app (same path rules as **`link:test-app`**: first CLI argument or **`ALIEN_UI_TEST_APP`**, default `../../local-testing/alien-ui-nuxt`).

You work mainly from the Alien UI repo; the playground picks up changes from updated **`dist/`**.

Flags:

- **`--skip-initial-build`** — skip step 1 if you already built and linked.
- **`--watch-lib-only`** — only **`vite build --watch`** (run **`nuxt dev`** yourself elsewhere if you prefer).

Helpers: **`npm run build:watch`** (library watch alone) · **`npm run dev:test-app:lib`** = **`--watch-lib-only`** shortcut.

Watch mode runs **`vite build --watch`** only. For full **`.d.ts`** / **CLI** regeneration after changing types or **`cli/`**, stop and run **`npm run build`** once (same as before shipping).

Keep **`vite.resolve.dedupe: ['vue']`** (see below) in the Nuxt app when using `file:` installs.

### Pack tarball (CI-like install)

```bash
npm ci
npm run build
npm pack
```

In a separate Nuxt 4 playground:

```bash
npm install /absolute/path/to/codaski-alien-ui-x.y.z.tgz
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
