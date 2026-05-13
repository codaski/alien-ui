# Changelog

Notable changes to **`@codaski/alien-ui`** (npm user **`codaski`**, **public** scoped package) are listed here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html) applies. During **pre-1.0** (`0.y.z`),
breaking API or export changes remain possible despite patch/minor bumps.

## [Unreleased]

### Changed

- _Nothing yet._

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

[Unreleased]: https://github.com/codaski/alien-ui/compare/v0.2.0-beta...HEAD
[0.2.0-beta]: https://github.com/codaski/alien-ui/releases/tag/v0.2.0-beta
[0.1.1-beta]: https://github.com/codaski/alien-ui/releases/tag/v0.1.1-beta
[0.1.0]: https://github.com/codaski/alien-ui/releases/tag/v0.1.0
