#!/usr/bin/env node
/**
 * Build this package and reinstall it into a local Nuxt (or any) consumer via `npm install <path>`.
 *
 * Usage:
 *   npm run link:test-app
 *   npm run link:test-app -- "C:\path\to\alien-ui-nuxt"
 *   ALIEN_UI_TEST_APP=C:\path\to\app npm run link:test-app
 *
 *   npm run link:test-app:quick          # skip build; only reinstall from dist/
 */
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

import {
  assertConsumerPackageJson,
  libRoot,
  resolveConsumerAppDir,
} from './resolve-consumer-app.mjs'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

/** Run npm with optional shell (Windows build step only). */
const runNpm = (cwd, args, opts = {}) =>
  spawnSync(npmCmd, args, {
    cwd,
    stdio: 'inherit',
    // Install must use shell:false + file:// so paths with spaces work. Build is more reliable on some Windows setups with shell:true.
    shell: opts.shell ?? false,
  })

let noBuild = false
const filtered = []
for (const a of process.argv.slice(2)) {
  if (a === '--no-build')
    noBuild = true
  else
    filtered.push(a)
}

const testApp = resolveConsumerAppDir(filtered)
assertConsumerPackageJson(testApp)

if (!noBuild) {
  console.log('[link-test-app] npm run build (library)…')
  // Windows: shell helps npm.cmd resolve consistently; cwd is set separately (spaces in repo path are OK)
  const b = runNpm(libRoot, ['run', 'build'], { shell: process.platform === 'win32' })
  if (b.status !== 0 || b.signal) {
    console.error(`[link-test-app] "npm run build" failed (exit=${b.status ?? '?'}, signal=${b.signal ?? 'none'})`)
    if (b.error)
      console.error(b.error)
    console.error('[link-test-app] Run `npm run build` in this repo for full logs.')
    process.exit(b.status ?? 1)
  }
}

console.log('[link-test-app] npm install from library into consumer…')
console.log(`  library   ${libRoot}`)
console.log(`  consumer  ${testApp}`)
// Windows + paths with spaces: npm must receive a file:// URL (or unquoted path breaks on "Alien UI")
const installTarget = pathToFileURL(libRoot).href
const link = runNpm(testApp, ['install', installTarget])
process.exit(link.status ?? 0)
