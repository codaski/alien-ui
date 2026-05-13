# Changelog

Notable changes to `@alien-ui/vue` are listed here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html) applies. During **pre-1.0** (`0.y.z`),
breaking API or export changes remain possible despite patch/minor bumps.

## [Unreleased]

### Changed

- _Nothing yet._

## [0.1.0] - 2026-05-13

First public **beta** (`@alien-ui/vue`).

### Added

- Scoped package **`@alien-ui/vue`**: Vue plugin (`createAlienUI`), Tailwind v4 stylesheet export, variants entry.
- Nuxt module **`@alien-ui/vue/nuxt`**: runtime plugin, style injection, composable auto-imports, registered **`AlienInput`**.
- **`AlienInput`** component and **`alien-ui`** CLI (eject/scaffold).
- MIT license, CI (`npm run ci`), release workflow on **`v*`** tags.

### Changed

- **Node.js `>=22`** (`.nvmrc`, `engines`, CI) for ESLint 10 / modern JS.
- **npm `ci`:** lockfile hygiene (`cac`, `commander`), Vite peer **`overrides`** for Nuxt DevTools; **`@vue/language-core`** pinned for `unplugin-dts`.
- **Vite:** `rolldownOptions` (incl. **`pluginTimings: false`**); tests mount **`createAlienUI()`** to avoid `useLocale()` stderr noise.
- Maintainer-only **`docs/`** + **`RULES.md`** gitignored; public entry [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md).

[Unreleased]: https://github.com/codaski/alien-ui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/codaski/alien-ui/releases/tag/v0.1.0
