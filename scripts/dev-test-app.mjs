#!/usr/bin/env node
/**
 * One-shot: full library build + file: link into the Nuxt app, then run in parallel:
 *   - `vite build --watch` (library dist refreshes on save)
 *   - `npm run dev` in the consumer (Nuxt HMR)
 *
 * From this repo only — no need to open a second terminal for the test app.
 *
 * Usage:
 *   npm run dev:test-app
 *   npm run dev:test-app -- "C:\path\to\alien-ui-nuxt"
 *   ALIEN_UI_TEST_APP=C:\path npm run dev:test-app
 *
 * Flags:
 *   --skip-initial-build   skip `npm run build` + link (dist already fresh + linked)
 *   --watch-lib-only       only `vite build --watch` (run Nuxt dev yourself elsewhere)
 */
import concurrently from 'concurrently'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

import {
  assertConsumerPackageJson,
  libRoot,
  resolveConsumerAppDir,
} from './resolve-consumer-app.mjs'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function runNpm(cwd, args, shell = false) {
  return spawnSync(npmCmd, args, { cwd, stdio: 'inherit', shell })
}

const raw = process.argv.slice(2)
let skipInitial = false
let watchLibOnly = false
const filtered = []
for (const a of raw) {
  if (a === '--skip-initial-build')
    skipInitial = true
  else if (a === '--watch-lib-only')
    watchLibOnly = true
  else
    filtered.push(a)
}

const testApp = resolveConsumerAppDir(filtered)
assertConsumerPackageJson(testApp)

if (!skipInitial) {
  console.log('[dev:test-app] Initial npm run build (library)…')
  const b = runNpm(libRoot, ['run', 'build'], process.platform === 'win32')
  if (b.status !== 0) {
    console.error('[dev:test-app] Build failed. Fix errors or use --skip-initial-build if dist is already OK.')
    process.exit(b.status ?? 1)
  }
  console.log('[dev:test-app] npm install file: link into consumer…')
  const inst = runNpm(testApp, ['install', pathToFileURL(libRoot).href], false)
  if (inst.status !== 0)
    process.exit(inst.status ?? 1)
}

const commands = [
  {
    command: `${npmCmd} run build:watch`,
    name:    'lib',
    cwd:     libRoot,
    env:     { ...process.env },
  },
]

if (!watchLibOnly) {
  commands.push({
    command: `${npmCmd} run dev`,
    name:    'nuxt',
    cwd:     testApp,
    env:     { ...process.env },
  })
}

const { result } = concurrently(commands, {
  prefixColors: ['blue', 'magenta'],
  killOthersOn: 'failure',
})

result.then(
  () => process.exit(0),
  (err) => {
    console.error(err)
    process.exit(1)
  },
)
