# Changelog

Notable changes to **`@codaski/alien-ui`** (npm user **`codaski`**, **public** scoped package) are listed here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html) applies. During **pre-1.0** (`0.y.z`),
breaking API or export changes remain possible despite patch/minor bumps.

## [Unreleased]

### Changed

- _Nothing yet._

## [0.2.4-beta] - 2026-05-16

Prerelease on the **`beta`** dist-tag (`npm install @codaski/alien-ui@beta`).

### Fixed

- **Tooling:** use **`defineConfig` from `vitest/config`** so the **`test`** block in **`vite.config.ts`** type-checks with Vitest-augmented Vite types.

### Changed

- **Build:** **`vite-plugin-dts`** (unplugin-dts) — replace deprecated **`outDir`** with **`outDirs`**; remove obsolete **`rollupTypes`** (bundling would require **`@microsoft/api-extractor`**; declarations still come from emit + **`vue-tsc --emitDeclarationOnly`** as before).

## [0.2.3-beta] - 2026-05-15

Prerelease on the **`beta`** dist-tag (`npm install @codaski/alien-ui@beta`).

### Fixed

- **Nuxt module:** emit **`dist/plugin/nuxt-runtime.mjs`** (explicit Vite entry) so `addPlugin` resolves and `nuxi prepare` no longer hits ENOENT on the runtime plugin path.
- **Nuxt module:** register **`AlienInput`** via **`components/forms/Input/Input`** instead of the barrel **`index`** (barrel has no emitted `.mjs` with preserve-modules).
- **Nuxt module:** only register **`ejectDir`** in `components:dirs` when the directory exists (avoids “Components directory not found” for new apps).
- **Build:** list **`node:fs`** as Rollup **`external`** so the emitted Nuxt module keeps a real `import { existsSync } from 'node:fs'` (Vite’s browser stub would break that guard at runtime).

### Changed

- **Release workflow:** tag pushes run a **`ci`** job first (`npm run ci`); **`publish`** runs only if **`ci`** succeeds. After publishing a prerelease to **`beta`**, **`latest`** is still updated to match (see [0.2.2-beta] notes).

## [0.2.2-beta] - 2026-05-15

Prerelease on the **`beta`** dist-tag (`npm install @codaski/alien-ui@beta`).

### Changed

- **GitHub Actions:** `actions/checkout@v5` and `actions/setup-node@v5` so workflow steps use the Node 24 action runtime (addresses Node 20 deprecation warnings on `checkout` / `setup-node`).
- **Package metadata:** `package.json` **`homepage`** set to the GitHub repo readme.

## [0.2.1-beta] - 2026-05-14

Prerelease under the **`beta`** dist-tag. **Local `npm run ci` passed** before tag.

### Fixed

- **Published stylesheet:** build now emits **`dist/styles/index.css`** so **`@codaski/alien-ui/styles`** and `package.json` **`exports["./styles"]`** resolve on disk after `npm pack` / install.

### Changed

- **Vite:** `assetFileNames` routes the Tailwind bundle to **`styles/index.css`**; main entry side-imports styles so the CSS is produced.
- **Nuxt:** stricter `nuxt/schema` hook typings; runtime config typed for `createAlienUI`.
- **TypeScript:** `ImportMetaEnv`, CLI `tsconfig`, **`@types/node`**, and `npm run typecheck` covers `cli/`.

## [0.2.0-beta] - 2026-05-13

First npm-oriented prerelease under **`@codaski/alien-ui`** at this version train; published under the **`beta`** dist-tag (**`npm install @codaski/alien-ui@beta`**).

### Changed

- Version bump for a clean tag/npm publish after **`@codaski`** scope stabilization (changelog and install examples refreshed).

## [0.1.1-beta] - 2026-05-13

Prerelease published to npm under the **`beta`** dist-tag (**`npm install @codaski/alien-ui@beta`**).

### Changed

- **README:** consumer-first usage guide and optimistic beta wording.
- **Release workflow:** versions containing a hyphen (semver prereleases) run **`npm publish --tag beta`** so **`npm install @codaski/alien-ui`** (**`latest`**) stays on **`0.1.0`** until you publish a stable version without prerelease identifiers.
- **BREAKING (post-tag note):** npm package name **`@alien-ui/vue`** → **`@codaski/alien-ui`** for publishing under user **`codaski`** (public). Imports and Nuxt module path are now **`@codaski/alien-ui`**, **`@codaski/alien-ui/styles`**, **`@codaski/alien-ui/nuxt`**.

## [0.1.0] - 2026-05-13

First public **beta** (package name later **`@codaski/alien-ui`**; was planned as `@alien-ui/vue`).

### Added

- Scoped package **`@codaski/alien-ui`**: Vue plugin (`createAlienUI`), Tailwind v4 stylesheet export, variants entry.
- Nuxt module **`@codaski/alien-ui/nuxt`**: runtime plugin, style injection, composable auto-imports, registered **`AlienInput`**.
- **`AlienInput`** component and **`alien-ui`** CLI (eject/scaffold).
- MIT license, CI (`npm run ci`), release workflow on **`v*`** tags.

### Changed

- **Node.js `>=22`** (`.nvmrc`, `engines`, CI) for ESLint 10 / modern JS.
- **npm `ci`:** lockfile hygiene (`cac`, `commander`), Vite peer **`overrides`** for Nuxt DevTools; **`@vue/language-core`** pinned for `unplugin-dts`.
- **Vite:** `rolldownOptions` (incl. **`pluginTimings: false`**); tests mount **`createAlienUI()`** to avoid `useLocale()` stderr noise.
- Maintainer-only **`docs/`** + **`RULES.md`** gitignored; public entry [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md).

[Unreleased]: https://github.com/codaski/alien-ui/compare/v0.2.2-beta...HEAD
[0.2.2-beta]: https://github.com/codaski/alien-ui/releases/tag/v0.2.2-beta
[0.2.1-beta]: https://github.com/codaski/alien-ui/releases/tag/v0.2.1-beta
[0.2.0-beta]: https://github.com/codaski/alien-ui/releases/tag/v0.2.0-beta
[0.1.1-beta]: https://github.com/codaski/alien-ui/releases/tag/v0.1.1-beta
[0.1.0]: https://github.com/codaski/alien-ui/releases/tag/v0.1.0
