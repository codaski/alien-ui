# Changelog

Notable changes to `@alien-ui/vue` are listed here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html) applies. During **pre-1.0** (`0.y.z`),
breaking API or export changes remain possible despite patch/minor bumps.

## [Unreleased]

### Changed

- **Tests:** Register **`createAlienUI()`** on VTU **`global.plugins`** in **`Input`** specs so `useLocale()` has a provider (no stray stderr during **`npm run ci`**).
- **Build (Vite → Rolldown):** **`build.rolldownOptions.checks.pluginTimings: false`** — `unplugin-dts` legitimately dominates a slice of build time; the timing warning is noise in CI.
- **Build / `unplugin-dts`:** Add **`@vue/language-core`** as a devDependency (aligned with **`vue-tsc`**) so declarations build resolves the module under `npm ci`.
- **npm `ci` / lockfile:** Direct devDependencies **`cac`** and **`commander`** plus **`overrides`** for Vite peer plugins under Nuxt DevTools keep `package-lock.json` complete and suppress spurious peer warnings with Vite **8**.
- **Node.js `>=22`:** `engines`, [`.nvmrc`](./.nvmrc), and CI read the same version (fixes ESLint 10 / `Object.groupBy` on Node 20). Use `npm run ci` locally — it is what GitHub Actions runs after `npm ci`.
- Long-form docs (`docs/`, `RULES.md`) removed from revision control via `.gitignore` so clones show source + public readme only; keep those trees locally if you rely on them. Public contributor entry-point is [.github/CONTRIBUTING.md](./.github/CONTRIBUTING.md).

## [0.1.0] - 2026-05-13

### Added

- Scoped package `@alien-ui/vue`: Vue plugin (`createAlienUI`), Tailwind v4 stylesheet export, variants entry.
- Nuxt module entry `@alien-ui/vue/nuxt` with runtime plugin, style injection, composable auto-imports, and registered `AlienInput`.
- Implemented `AlienInput` plus CLI (`alien-ui` bin) for eject/scaffold workflows.
- MIT license, CI (lint/typecheck/test/build), npm release workflow on `v*` tags.

[Unreleased]: https://github.com/codaski/alien-ui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/codaski/alien-ui/releases/tag/v0.1.0
